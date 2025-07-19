const Booking = require('../models/bookingschema');
const Package = require('../models/packageschema');
const User = require('../models/userschema');

exports.bookPackage = async (req, res) => {
  const { userId, packageId, travelDate, numberOfPeople } = req.body;

  if (!userId || !packageId || !travelDate || !numberOfPeople) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newBooking = new Booking({
      userId,
      packageId,
      travelDate: new Date(travelDate),
      numberOfPeople: Number(numberOfPeople)
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

// 🔽 Fetch bookings of a specific user
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await Booking.find({ userId })
      .populate({
        path: 'userId',
        select: 'fullname email mobileno'
      })
      .populate({
        path: 'packageId',
        select: 'packagename destination pricePerPerson'
      });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Error in getUserBookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

exports.getPackageBooking = async (req, res) =>{
  try {
    const packageId = req.params.packageId;

    const booking = await Booking.find({ packageId })
    .populate({
      path: 'packageId',
      select:'packagename destination pricePerPerson'
    });
    res.status(200).json({ booking });
  }catch (err) {
    console.error("Error in getPackageBooking:", err);
    res.status(500).json({ message: "Failed to fetch booking", error: err.messag})
  }
}

// 🔽 Get all bookings (for admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: 'userId', select: 'fullname email mobileno' })
      .populate({ path: 'packageId', select: 'packagename destination pricePerPerson' });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Error in getAllBookings:", err);
    res.status(500).json({ message: "Failed to fetch all bookings", error: err.message });
  }
};


