const express = require('express');
const usercontroller = require('../controllers/usercontroller');
const upload = require('../config/upload'); // ✅ Using Cloudinary-based multer config

const route = express.Router();

// ✅ Get all users (used by admin)
route.get('/userlist', usercontroller.userlist);

// ✅ Get one user by ID (used for profile viewing or editing)
route.get('/singleuserlist/:id', usercontroller.singleuserlist);

// ✅ Register a user with profilePic upload (image field name = 'profilePic')
route.post('/registration', upload.single('profilePic'), usercontroller.registration);

// ✅ Login route
route.post('/login', usercontroller.login);

// ✅ Update user info with optional new profilePic (for profile editing)
route.put('/update/:id', upload.single('profilePic'), usercontroller.updateUser);

// ✅ Delete user from admin panel or system
route.delete('/delete/:id', usercontroller.deleteuser);

// ✅ Possibly redundant route (if same as above); keep only if used differently
route.delete('/userdelete/:id', usercontroller.userdelete);

module.exports = route;
