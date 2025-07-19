const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ must match the exact model name
    required: true
  },
  packageId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Package', // ✅ model name match hona chahiye
  required: true
  },

  paymentId:{
    String
  },
  travelDate: {
    type: Date,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'confirmed'
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
