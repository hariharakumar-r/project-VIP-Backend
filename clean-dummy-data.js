import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Job from "./models/Job.js";
import PromotionRequest from "./models/PromotionRequest.js";

dotenv.config();

const cleanDummyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete all dummy/sample data
    // Keep only SUPER_ADMIN users
    const deletedUsers = await User.deleteMany({ 
      role: { $in: ["COMPANY", "APPLICANT"] },
      email: { $regex: /@example\.com$/ } // Only delete example.com emails
    });
    
    const deletedJobs = await Job.deleteMany({});
    const deletedPromoRequests = await PromotionRequest.deleteMany({});

    console.log("\n✅ Dummy data cleaned successfully!");
    console.log(`   - Deleted ${deletedUsers.deletedCount} sample users`);
    console.log(`   - Deleted ${deletedJobs.deletedCount} job posts`);
    console.log(`   - Deleted ${deletedPromoRequests.deletedCount} promotion requests`);
    console.log("\n📝 Note: Super admin accounts were preserved");

  } catch (error) {
    console.error("❌ Error cleaning dummy data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
};

cleanDummyData();
