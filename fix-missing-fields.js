import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";
import User from "./models/User.js";

dotenv.config();

const fixMissingFields = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find jobs without createdBy
    const jobsWithoutCreatedBy = await Job.find({ 
      $or: [
        { createdBy: { $exists: false } },
        { createdBy: null }
      ]
    });

    console.log(`Found ${jobsWithoutCreatedBy.length} jobs without createdBy field`);

    if (jobsWithoutCreatedBy.length > 0) {
      // Get a company user to assign
      const companyUser = await User.findOne({ role: "COMPANY" });
      
      if (!companyUser) {
        console.log("❌ No company user found to assign jobs to");
        return;
      }

      console.log(`Assigning jobs to: ${companyUser.name} (${companyUser.email})`);

      for (const job of jobsWithoutCreatedBy) {
        job.createdBy = companyUser._id;
        if (!job.companyId) {
          job.companyId = companyUser._id;
        }
        await job.save();
        console.log(`✅ Fixed job: ${job.title}`);
      }

      console.log(`\n✅ Fixed ${jobsWithoutCreatedBy.length} jobs`);
    } else {
      console.log("✅ All jobs have createdBy field");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  }
};

fixMissingFields();
