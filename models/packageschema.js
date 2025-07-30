const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  duration: String,
  images: [String], // Array of Cloudinary URLs
  locationCategory: {
    type: String,
    enum: ["North India", "South India", "East India", "West India", "Central India"],
    required: true,
  },
  packageType: {
    type: String,
    enum: [
      "Romantic Getaways",
      "Family Vacations",
      "Adventure Trips",
      "Wellness Retreats",
      "Summer Specials",
      "Festival Holidays",
      "Beach Holidays",
      "Wildlife Safaris",
    ],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Package", packageSchema);
