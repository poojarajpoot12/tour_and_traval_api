const express = require('express');
const usercontroller = require('../controllers/usercontroller');
const upload = require('../config/upload'); // ✅ Multer config for handling file uploads

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

// ✅ This might be a duplicate delete route – you can remove one if unnecessary
route.delete('/userdelete/:id', usercontroller.userdelete); // ⚠ Possibly redundant

// NOTE:
// - If both delete routes are used in different contexts (admin/user), keep both.
// - Otherwise, consider combining them with role-checking in the controller.

module.exports = route;
