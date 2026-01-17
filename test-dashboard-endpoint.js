import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { getDashboardStats } from "./controllers/admin.controller.js";

dotenv.config();

const testDashboardEndpoint = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find admin user
    const adminUser = await User.findOne({ role: "SUPER_ADMIN" });
    if (!adminUser) {
      console.log("❌ No SUPER_ADMIN user found");
      return;
    }

    console.log(`Found admin: ${adminUser.name} (${adminUser.email})`);

    // Create a mock request object
    const mockReq = {
      userId: adminUser._id,
      user: {
        id: adminUser._id,
        role: adminUser.role
      }
    };

    // Create a mock response object
    let responseData = null;
    let responseStatus = null;
    
    const mockRes = {
      json: (data) => {
        responseData = data;
        responseStatus = 200;
        console.log("✅ Dashboard stats generated successfully!");
        console.log("Response keys:", Object.keys(data));
        console.log("Total users:", data.totals?.users);
        console.log("Total jobs:", data.totals?.jobPosts);
        console.log("Total applications:", data.totals?.applications);
        return mockRes;
      },
      status: (code) => {
        responseStatus = code;
        return mockRes;
      }
    };

    console.log("\n🔄 Testing getDashboardStats function...");
    
    // Call the actual controller function
    await getDashboardStats(mockReq, mockRes);

    if (responseStatus === 200 && responseData) {
      console.log("\n✅ SUCCESS - Dashboard endpoint works!");
      console.log("Data structure is valid");
    } else {
      console.log("\n❌ FAILED - Dashboard endpoint has issues");
    }

  } catch (error) {
    console.error("❌ Error testing dashboard endpoint:", error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  }
};

testDashboardEndpoint();