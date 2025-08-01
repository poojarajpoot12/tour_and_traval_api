const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4545;

// ✅ Setup CORS
const defaultOrigins = ['http://localhost:3000'];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : defaultOrigins;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS error: ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const uri = process.env.MONGO_URI;
console.log("🔗 MONGO_URI:", uri);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to database"))
.catch((err) => console.log("❌ Database connection error: ", err));

// Routes
app.get('/', (req, res) => {
    res.send("This is my first API");
});
app.use('/user', require('./routes/userroutes'));
app.use('/package', require('./routes/packageroutes'));
app.use('/booking', require('./routes/bookingroutes'));

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
