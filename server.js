const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Ensure this points to your DB connection file
const Otp = require('./models/Otp'); // Import the Otp model

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middlewares
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
connectDB();

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the OTP Generator API');
});

// Route to generate OTP
app.post('/generate-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random 4-digit OTP

  try {
    const newOtp = new Otp({ phone, otp });
    await newOtp.save();
    res.status(200).json({ message: 'OTP generated successfully', otp });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Error generating OTP' });
  }
});

// Route to verify OTP
app.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const existingOtp = await Otp.findOne({ phone, otp });
    if (existingOtp) {
      await Otp.deleteOne({ phone, otp }); // Delete the OTP after verification
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
