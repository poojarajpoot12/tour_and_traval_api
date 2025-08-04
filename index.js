const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 4545;

// ✅ Step 1: CORS fixed setup
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend.netlify.app'], // ⬅️ Add live frontend here
  credentials: true
}));


// ✅ Step 2: Required headers for preflight
app.options('*', cors());

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to database"))
.catch((err) => console.log("❌ Database connection error: ", err));

// ✅ Routes
app.get('/', (req, res) => {
  res.send("This is my first API");
});
app.use('/user', require('./routes/userroutes'));
app.use('/package', require('./routes/packageroutes'));
app.use('/booking', require('./routes/bookingroutes'));

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
