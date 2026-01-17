import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: "SUPER_ADMIN" });
    if (existingAdmin) {
      console.log("Super admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isVerified: true,
      isBlocked: false
    });

    console.log("Super admin created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login.");

  } catch (error) {
    console.error("Error creating super admin:", error);
  } finally {
    mongoose.disconnect();
  }
};

createSuperAdmin();