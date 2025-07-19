const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingcontroller');

router.post('/book', bookingController.bookPackage);
router.get('/user/:userId', bookingController.getUserBookings); // ✅ This is used in profile.jsx
router.get('/package/:packageId',bookingController.getPackageBooking)
router.get('/all', bookingController.getAllBookings); // ✅ Admin route

module.exports = router;
