import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Job from "./models/Job.js";
import PromotionRequest from "./models/PromotionRequest.js";

dotenv.config();

const testEndpoints = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Test 1: Check Users
    console.log("=== TESTING USERS ===");
    const totalUsers = await User.countDocuments();
    const companies = await User.countDocuments({ role: "COMPANY" });
    const applicants = await User.countDocuments({ role: "APPLICANT" });
    const admins = await User.countDocuments({ role: "SUPER_ADMIN" });
    
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Companies: ${companies}`);
    console.log(`Applicants: ${applicants}`);
    console.log(`Admins: ${admins}`);
    
    if (totalUsers > 0) {
      const sampleUsers = await User.find().select("name email role isBlocked").limit(3);
      console.log("\nSample Users:");
      sampleUsers.forEach(u => console.log(`  - ${u.name} (${u.email}) - ${u.role} - Blocked: ${u.isBlocked}`));
    } else {
      console.log("⚠️  NO USERS FOUND IN DATABASE!");
    }

    // Test 2: Check Jobs
    console.log("\n=== TESTING JOBS ===");
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "ACTIVE" });
    const promotedJobs = await Job.countDocuments({ promoted: true });
    const blockedJobs = await Job.countDocuments({ isBlockedByAdmin: true });
    
    console.log(`Total Jobs: ${totalJobs}`);
    console.log(`Active Jobs: ${activeJobs}`);
    console.log(`Promoted Jobs: ${promotedJobs}`);
    console.log(`Blocked Jobs: ${blockedJobs}`);
    
    if (totalJobs > 0) {
      const sampleJobs = await Job.find().select("title status promoted moderationStatus isBlockedByAdmin").limit(3);
      console.log("\nSample Jobs:");
      sampleJobs.forEach(j => console.log(`  - ${j.title} - Status: ${j.status} - Promoted: ${j.promoted} - Moderation: ${j.moderationStatus}`));
    } else {
      console.log("⚠️  NO JOBS FOUND IN DATABASE!");
    }

    // Test 3: Check Promotion Requests
    console.log("\n=== TESTING PROMOTION REQUESTS ===");
    const totalPromoRequests = await PromotionRequest.countDocuments();
    const pendingPromoRequests = await PromotionRequest.countDocuments({ status: "pending" });
    
    console.log(`Total Promotion Requests: ${totalPromoRequests}`);
    console.log(`Pending Requests: ${pendingPromoRequests}`);
    
    if (totalPromoRequests > 0) {
      const sampleRequests = await PromotionRequest.find()
        .populate("jobId", "title")
        .populate("companyId", "name email")
        .limit(3);
      console.log("\nSample Promotion Requests:");
      sampleRequests.forEach(r => console.log(`  - Job: ${r.jobId?.title || "N/A"} - Company: ${r.companyId?.name || "N/A"} - Status: ${r.status}`));
    } else {
      console.log("⚠️  NO PROMOTION REQUESTS FOUND IN DATABASE!");
    }

    // Test 4: Check if admin exists
    console.log("\n=== CHECKING ADMIN ACCESS ===");
    const adminUser = await User.findOne({ role: "SUPER_ADMIN" });
    if (adminUser) {
      console.log(`✅ Admin found: ${adminUser.name} (${adminUser.email})`);
      console.log(`   Verified: ${adminUser.isVerified}`);
      console.log(`   Blocked: ${adminUser.isBlocked}`);
    } else {
      console.log("❌ NO SUPER_ADMIN USER FOUND!");
      console.log("   Run: node create-super-admin.js");
    }

    console.log("\n=== SUMMARY ===");
    if (totalUsers === 0) {
      console.log("❌ Database is EMPTY - No users found");
      console.log("   Solution: Run seed-sample-data.js or create real data");
    } else if (totalJobs === 0) {
      console.log("⚠️  Users exist but NO JOBS found");
      console.log("   Solution: Create jobs via company dashboard");
    } else {
      console.log("✅ Database has data");
      console.log(`   ${totalUsers} users, ${totalJobs} jobs, ${totalPromoRequests} promo requests`);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  }
};

testEndpoints();
