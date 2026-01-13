import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/otp.js";
import { sendMail } from "../utils/mailer.js";

// OTP time-to-live in ms
const OTP_TTL_MS = 10 * 60 * 1000;

// Placeholder for rate limiting (implement with express-rate-limit in production)
const otpAttempts = {};

export const register = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;
    const role = req.body.role;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = Date.now() + OTP_TTL_MS;

    await User.create({
      name,
      email,
      password: hashed,
      role,
      isVerified: false,
      otp,
      otpExpiresAt,
    });

    await sendMail(email, "OTP Verification", `Your OTP: ${otp}`);
    return res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ message: "No OTP requested" });
    }

    if (user.otpExpiresAt < Date.now()) {
      // Clear expired OTP
      user.otp = undefined;
      user.otpExpiresAt = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Generate JWT token for successful verification
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1d" }
    );

    // Return consistent response format with token and user data
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ message: "Verification failed" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    // Rate limit: allow max 3 resends per hour (example)
    otpAttempts[email] = otpAttempts[email] || [];
    otpAttempts[email] = otpAttempts[email].filter(ts => ts > Date.now() - 60 * 60 * 1000);
    if (otpAttempts[email].length >= 3) {
      return res.status(429).json({ message: "Too many OTP requests, try later" });
    }
    otpAttempts[email].push(Date.now());

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + OTP_TTL_MS;
    await user.save();

    await sendMail(email, "OTP Verification", `Your OTP: ${otp}`);
    return res.json({ message: "OTP resent" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ message: "Resend failed" });
  }
};

export const login = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    const user = await User.findOne({ email });
    if (!user || user.isBlocked) {
      return res.status(401).json({ message: "Access denied" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1d" } // Use environment variable for expiration
    );

    // Return consistent response format with token and user data
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};
