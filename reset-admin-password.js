import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const admin = await User.findOne({ role: "SUPER_ADMIN" });
    if (!admin) {
      console.log("No super admin found");
      return;
    }

    // Reset password to "admin123"
    const hashedPassword = await bcrypt.hash("admin123", 10);
    admin.password = hashedPassword;
    await admin.save();

    console.log("Super admin password reset successfully!");
    console.log("Email:", admin.email);
    console.log("New password: admin123");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
};

resetAdminPassword();