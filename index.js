const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 4545;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/tour_and_traval', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database");
}).catch(() => {
    console.log("Not connected to database");
});

// Test route
app.get('/myserver', (req, res) => {
    res.send("This is my first API");
});

// API routes
app.use('/user', require('./routes/userroutes'));
app.use('/package', require('./routes/packageroutes'));
app.use('/booking', require('./routes/bookingroutes'));

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
