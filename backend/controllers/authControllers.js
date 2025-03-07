import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import Pw_Reset from "../models/forgotpassword.js";
import express from 'express';
import dotenv from "dotenv";
dotenv.config();

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOG IN USER */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const otpStore = {};

/* Send OTP */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    const expires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Store OTP in database
    await Pw_Reset.findOneAndUpdate(
      { email },
      { otp, expires },
      { upsert: true, new: true }
    );

    // Configure Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify Email Server
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error generating OTP", details: error.message });
  }
};

/* Verify OTP */
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Fetch OTP Record
    const record = await Pw_Reset.findOne({ email });

    if (!record) {
      return res.status(400).json({ success: false, message: "No OTP found for this email" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date(record.expires) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    return res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP", details: error.message });
  }
};

/* Reset Password */
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist!" });
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ msg: "Password reset successfully." });

  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", details: error.message });
  }
};
