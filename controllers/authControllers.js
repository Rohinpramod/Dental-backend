import User from "../models/userModel.js";
import Address from "../models/addressModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import nodemailer from 'nodemailer'

import  {generateToken}  from "../utils/token.js";
import sendEmail from "../utils/nodemailer.js";
import Otp from"../models/otp.js";


const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

//signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, profilePic, role, otp } = req.body;

    // 1. Validate email & required fields
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (!email || !password || !phone || (!otp && !name)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User email already exists" });
    }

    // 👉 STEP 1: No OTP in body = start signup (generate/send OTP)
    if (!otp) {
      const newOtp = generateOTP();

      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 min
      await Otp.deleteMany({ email }); // Clear previous OTPs
      await Otp.create({ email, otp: newOtp, expiresAt });

      await sendEmail(
        email,
        "Your Dental OTP Code (Valid for 2 Minutes)",
        `Hi there,\n\nYour one-time password (OTP) is: ${newOtp}\n\nIt will expire in 2 minutes.\n\nThank you,\nDental Team`,
        `<p>Hi there,</p><p>Your OTP is <strong>${newOtp}</strong>. It will expire in 2 minutes.</p><p>Thank you,<br>Dental Team</p>`,
        "dental@gmail.com"
      );

      return res.status(200).json({ message: "OTP sent to your email" });
    }

    // 👉 STEP 2: OTP is present = verify OTP + complete signup
    const foundOtp = await Otp.findOne({ email, otp });
    if (!foundOtp || foundOtp.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteOne({ _id: foundOtp._id }); // Remove OTP after use

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      profilePic,
      role,
    });
    await newUser.save();

    const token = generateToken(newUser, "user");
    res.cookie("token", token);
    res.status(200).json({ message: "Signup successful " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

//Login
export const  login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "all fields required" });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordMatch = bcrypt.compareSync(password, userExist.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message:"password not match" });
    }
    const token = generateToken(userExist, "user");
    res.cookie("token", token, {
      httpOnly: true, // Prevents access via JavaScript (XSS protection)
      secure: true, // Works only on HTTPS (important in production)
      sameSite: "None", // Allows cross-origin requests
      path: "/", // Available for all routes
    });

    res.json({ message: " Login succssfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Profile
export const  getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Retrieve user profile excluding password
    const userProfile = await User.findById(userId).select("-password");

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve user addresses
    const userAddresses = await Address.find({ user: userId });

    // Combine user profile and addresses
    res.json({
      message: "Profile fetched successfully",
      data: {
        profile: userProfile,
        addresses: userAddresses,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink =`http://localhost:3000/api/user/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    });

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reset email', error: err.message });
  }
};

//RestPassword
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};

//Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // Only in HTTPS (production)
      sameSite: "None",
    });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update-profile
export const  profileUpdate = async (req, res) => {
  try {
    const { name, email, phone, profilePic } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, profilePic },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//checkUser
export const  checkUser = async (req, res, next) => {
  try {
    res.json({ message: "user autherized" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//deleteAccount
export const  deleteUserAccount = async (req, res) => {
  try {
    res.clearCookie("token");
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const userId = req.user.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
    
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
