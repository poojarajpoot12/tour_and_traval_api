const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, required: true, unique: true },
  mobileno: String,
  password: { type: String, required: true },
  
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profilePic: {
    type: String, // stores filename
    default: ''   // or default avatar
  }
});

module.exports = mongoose.model('User', userSchema); // ✅ Capitalized singular name
