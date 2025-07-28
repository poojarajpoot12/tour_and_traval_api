const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();                 
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4545;

// ✅ CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Aapka frontend origin
  credentials: true               // Agar aap cookies ya token bhejna chahti ho
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const uri = process.env.MONGO_URI;
console.log("🔗 MONGO_URI:", uri); // Console me check karega ki URI aa rahi hai ya nahi

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to database"))
.catch((err) => console.log("❌ Database connection error: ", err));

// Test route
app.get('/', (req, res) => {
    res.send("This is my first API");
});

// Routes
app.use('/user', require('./routes/userroutes'));
app.use('/package', require('./routes/packageroutes'));
app.use('/booking', require('./routes/bookingroutes'));

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
