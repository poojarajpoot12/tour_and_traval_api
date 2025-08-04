const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packagecontroller');
const upload = require('../config/upload');

// Image upload field: "images" (form field name must match!)
router.post('/create', upload.array('images', 5), packageController.createPackage);
// Update route must also handle file uploads
router.put('/update/:id', upload.array('images', 5), packageController.updatePackage);

router.get('/all', packageController.getAllPackages);
router.get('/select/:id', packageController.getPackageById);
// router.put('/update/:id', packageController.updatePackage);
router.delete('/delete/:id', packageController.deletePackage);
router.get('/category/:category', packageController.getPackagesByCategory);
router.get('/package',packageController.getFilteredPackages);


module.exports = router;
