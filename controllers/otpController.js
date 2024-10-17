const Otp = require('../models/Otp');
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

// Generate OTP
exports.generateOTP = async (req, res) => {
  const { phone } = req.body;

  // Check if phone number exists
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Create new OTP and save to database
  const otp = generateOtp();
  const newOtp = new Otp({ phone, otp });

  await newOtp.save();

  return res.status(201).json({ message: 'OTP generated', otp });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  // Find the OTP in the database
  const existingOtp = await Otp.findOne({ phone, otp });

  if (!existingOtp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP is valid, delete it from the database
  await existingOtp.deleteOne();

  return res.status(200).json({ message: 'OTP verified successfully' });
};
