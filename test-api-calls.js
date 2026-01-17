import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Job from "./models/Job.js";
import PromotionRequest from "./models/PromotionRequest.js";

dotenv.config();

const testAPICalls = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Simulate GET /api/admin/users
    console.log("=== TEST: GET /api/admin/users ===");
    const users = await User.find().select("-password");
    console.log(`Response: ${users.length} users`);
    if (users.length > 0) {
      console.log("Sample:", users[0]);
    } else {
      console.log("❌ NO USERS RETURNED");
    }

    // Simulate GET /api/admin/all-posts
    console.log("\n=== TEST: GET /api/admin/all-posts ===");
    const posts = await Job.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });
    console.log(`Response: ${posts.length} posts`);
    if (posts.length > 0) {
      console.log("Sample:", {
        title: posts[0].title,
        createdBy: posts[0].createdBy,
        status: posts[0].status,
        promoted: posts[0].promoted
      });
    } else {
      console.log("❌ NO POSTS RETURNED");
    }

    // Simulate GET /api/admin/promotion-requests
    console.log("\n=== TEST: GET /api/admin/promotion-requests ===");
    const requests = await PromotionRequest.find()
      .populate("jobId", "title description salary location jobType")
      .populate("companyId", "name email")
      .sort({ createdAt: -1 });
    console.log(`Response: ${requests.length} requests`);
    if (requests.length > 0) {
      console.log("Sample:", {
        jobId: requests[0].jobId,
        companyId: requests[0].companyId,
        status: requests[0].status,
        message: requests[0].message
      });
    } else {
      console.log("❌ NO REQUESTS RETURNED");
    }

    console.log("\n=== CHECKING ISSUES ===");
    
    // Check if jobs have createdBy field
    const jobsWithoutCreatedBy = await Job.countDocuments({ createdBy: { $exists: false } });
    if (jobsWithoutCreatedBy > 0) {
      console.log(`⚠️  ${jobsWithoutCreatedBy} jobs missing createdBy field`);
    }

    // Check if promotion requests have proper references
    const requestsWithoutJob = await PromotionRequest.countDocuments({ jobId: { $exists: false } });
    const requestsWithoutCompany = await PromotionRequest.countDocuments({ companyId: { $exists: false } });
    if (requestsWithoutJob > 0) {
      console.log(`⚠️  ${requestsWithoutJob} promotion requests missing jobId`);
    }
    if (requestsWithoutCompany > 0) {
      console.log(`⚠️  ${requestsWithoutCompany} promotion requests missing companyId`);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  }
};

testAPICalls();
