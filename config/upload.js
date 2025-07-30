const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.js");
const path = require("path");

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tour-app", // Change if you want different folder on Cloudinary
    allowed_formats: ["jpeg", "jpg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

// Filter to allow only specific image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValid =
    allowedTypes.test(file.mimetype) &&
    allowedTypes.test(path.extname(file.originalname).toLowerCase());

  cb(null, isValid); // If false, file will be rejected
};

// Define multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// NOTE: This config is used for profile pics and package images
module.exports = upload;
