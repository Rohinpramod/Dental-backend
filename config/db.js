// config/db.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection error:", error);
  }
};
