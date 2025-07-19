const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packagename: String,
  destination: String,
  pricePerPerson: Number,
  description: String,
  duration: String,
  category: String,
  isFeatured: Boolean,
  status: String,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Package', packageSchema);
