const multer = require('multer');
const path = require('path');

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // All files will be saved to the 'uploads' directory
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    // Prepend timestamp to original filename to avoid name conflicts
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Filter to allow only specific image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValid =
    allowedTypes.test(file.mimetype) &&
    allowedTypes.test(path.extname(file.originalname).toLowerCase());

  cb(null, isValid); // Reject if file format is invalid
};

// Define multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// NOTE: Currently this upload config is used for profile pics and package images
// If needed in future, we can extend it to support PDFs, videos etc.

module.exports = upload;
