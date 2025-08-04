const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  packagename: { type: String, required: true },   // ✅ from frontend
  destination: String,
  pricePerPerson: Number,                           // ✅ from frontend
  duration: String,
  description: String,
  images: [String], // Array of Cloudinary URLs

  location: {
    type: String,
    enum: ["North India", "South India", "East India", "West India", "Central India"],
    required: true,
  },
  category: {
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

  isFeatured: { type: Boolean, default: false },
  status: { type: String, default: "active" },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Package", packageSchema);
