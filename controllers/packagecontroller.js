const Package = require('../models/packageschema');
const Cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// ✅ Cloudinary config (if not in separate file)
Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Buffer upload helper
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = Cloudinary.uploader.upload_stream(
      { folder: 'packages' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Create Package
exports.createPackage = async (req, res) => {
  try {
    console.log('📦 req.body:', req.body);
    console.log('🖼️ req.files:', req.files);

    const {
      packagename,
      destination,
      pricePerPerson,
      description,
      duration,
      location,
      category,
      isFeatured,
      status,
    } = req.body;

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer);
        uploadedImages.push(imageUrl);
      }
    }

    const newPackage = new Package({
      packagename,
      destination,
      pricePerPerson,
      description,
      duration,
      location,
      category,
      isFeatured,
      status,
      images: uploadedImages,
    });

    await newPackage.save();

    res.status(201).json({ message: '✅ Package created successfully', package: newPackage });
  } catch (error) {
    console.error('❌ Error in createPackage:', error.message);
    res.status(500).json({ error: 'Server error while creating package' });
  }
};

// ✅ Get All Packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Package by ID
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.status(200).json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Package
exports.updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const updatedFields = req.body;

    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer);
        newImages.push(imageUrl);
      }
      updatedFields.images = newImages;
    }

    const updatedPackage = await Package.findByIdAndUpdate(packageId, updatedFields, {
      new: true,
    });

    if (!updatedPackage) return res.status(404).json({ error: 'Package not found' });

    res.status(200).json({ message: '✅ Package updated', package: updatedPackage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Package
exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Package not found' });
    res.status(200).json({ message: '🗑️ Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Packages by Category
exports.getPackagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (category === 'All') {
      const allPackages = await Package.find();
      return res.status(200).json(allPackages);
    }

    const packages = await Package.find({ category });
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Filtered Packages by location & category
exports.getFilteredPackages = async (req, res) => {
  try {
    const { location, category } = req.query;
    const filter = {};

    if (location) filter.location = location;
    if (category) filter.category = category;

    const packages = await Package.find(filter);
    res.status(200).json(packages);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
