const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// OTP සේව් කරගන්න තැන
let otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- FUNCTION 1: SEND OTP ---
app.post('/api/send-otp', (req, res) => {
    const email = req.body.email ? req.body.email.trim() : '';

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required!" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = otp; 
    console.log(`[SERVER] OTP for ${email} is ${otp}`); // Terminal එකේ බලාගන්න පුළුවන්

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'BloomFresh - Verification OTP',
        text: `Your Verification OTP code is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email Error:", error);
            return res.status(500).json({ success: false, message: "Email sending failed!" });
        }
        res.status(200).json({ success: true, message: "OTP sent successfully!" });
    });
});

// --- FUNCTION 2: VERIFY OTP ---
app.post('/api/verify-otp', (req, res) => {
    // Spaces අයින් කරලාම ගන්නවා (.trim() පාවිච්චි කරලා)
    const email = req.body.email ? req.body.email.trim() : '';
    const otp = req.body.otp ? req.body.otp.trim() : '';

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required!" });
    }

    const savedOtp = otpStore[email];

    if (!savedOtp) {
        return res.status(400).json({ success: false, message: "OTP expired or not requested!" });
    }

    if (savedOtp === otp) {
        delete otpStore[email]; // වැඩේ හරි ගියාම OTP එක මකනවා
        console.log(`[SERVER] User ${email} verified successfully!`);
        return res.status(200).json({ success: true, message: "Authentication Successful!" });
    } else {
        return res.status(400).json({ success: false, message: "Invalid OTP! Try again." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});