import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const admin = await User.findOne({ role: "SUPER_ADMIN" });
    if (admin) {
      console.log("Super admin found:");
      console.log("Email:", admin.email);
      console.log("Name:", admin.name);
      console.log("Verified:", admin.isVerified);
      console.log("Blocked:", admin.isBlocked);
    } else {
      console.log("No super admin found");
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
};

checkAdmin();