const Package = require('../models/packageschema');
const Cloudinary =require('../config/cloudinary');
const fs =require('fs');

// Create Package
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
      location,      // ✅ matches frontend's <select name="location">
      category,      // ✅ matches frontend's <select name="category">
      isFeatured,
      status
    } = req.body;

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await Cloudinary.uploader.upload(file.path, {
          folder: 'packages'
        });
        uploadedImages.push(result.secure_url);
        fs.unlinkSync(file.path);
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
    res.status(500).json({ error: error.message });
  }
};


// Get All Packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Package
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.status(200).json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Package
exports.updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const updatedField = req.body;
    if(req.files && req.files.length>0){
      updatedField.images = req.files.map(file=>file.filename);
    }
    const updated = await Package.findByIdAndUpdate(packageId,updatedField, { new: true });
    if (!updated) return res.status(404).json({ error: 'Package not found' });
    res.status(200).json({ message: 'Package updated', package: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Package
exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Package not found' });
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get Packages by Category
exports.getPackagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // If 'All' is requested, return all packages
    if (category === 'All') {
      const allPackages = await Package.find();
      return res.status(200).json(allPackages);
    }

    // Else filter by category
    const packages = await Package.find({ category });
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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


