const express = require('express');
const { generateOTP, verifyOTP } = require('../controllers/otpController');
const router = express.Router();

// Route to generate OTP
router.post('/generate-otp', generateOTP);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

module.exports = router;
