import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Job from "./models/Job.js";
import PromotionRequest from "./models/PromotionRequest.js";

dotenv.config();

// ⚠️ WARNING: This script creates DUMMY DATA for testing purposes only
// ⚠️ DO NOT run this in production!
// ⚠️ To clean up dummy data, run: node clean-dummy-data.js

const seedSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    console.log("\n⚠️  WARNING: Creating dummy data for testing...");
    console.log("⚠️  This should NOT be used in production!");
    console.log("⚠️  To clean up, run: node clean-dummy-data.js\n");

    // Create sample companies
    const companies = [];
    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const company = await User.create({
        name: `Tech Company ${i}`,
        email: `company${i}@example.com`,
        password: hashedPassword,
        role: "COMPANY",
        isVerified: true,
        isBlocked: false
      });
      companies.push(company);
    }

    // Create sample applicants
    const applicants = [];
    for (let i = 1; i <= 15; i++) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const applicant = await User.create({
        name: `John Doe ${i}`,
        email: `applicant${i}@example.com`,
        password: hashedPassword,
        role: "APPLICANT",
        isVerified: true,
        isBlocked: i > 12 ? true : false // Block a few users for demo
      });
      applicants.push(applicant);
    }

    // Create sample jobs
    const jobs = [];
    const jobTitles = [
      "Frontend Developer",
      "Backend Developer", 
      "Full Stack Developer",
      "DevOps Engineer",
      "Data Scientist",
      "Product Manager",
      "UI/UX Designer",
      "Mobile Developer",
      "QA Engineer",
      "System Administrator"
    ];

    for (let i = 0; i < jobTitles.length; i++) {
      const company = companies[i % companies.length];
      const job = await Job.create({
        companyId: company._id,
        title: jobTitles[i],
        location: `City ${i + 1}`,
        jobType: i % 2 === 0 ? "Full-time" : "Part-time",
        skills: ["JavaScript", "React", "Node.js"],
        salary: `$${50000 + (i * 5000)} - $${70000 + (i * 5000)}`,
        description: `We are looking for a talented ${jobTitles[i]} to join our team.`,
        promoted: i < 3 ? true : false,
        status: "ACTIVE",
        moderationStatus: i > 7 ? "pending" : "approved",
        createdBy: company._id,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Random date in last 90 days
      });
      jobs.push(job);
    }

    // Create sample promotion requests
    for (let i = 0; i < 3; i++) {
      const job = jobs[i + 5]; // Use non-promoted jobs
      const company = companies[i % companies.length];
      
      await PromotionRequest.create({
        jobId: job._id,
        companyId: company._id,
        message: `Please promote our ${job.title} position for better visibility.`,
        status: "pending"
      });
    }

    console.log("Sample data created successfully!");
    console.log(`Created ${companies.length} companies`);
    console.log(`Created ${applicants.length} applicants`);
    console.log(`Created ${jobs.length} jobs`);
    console.log("Created 3 promotion requests");

  } catch (error) {
    console.error("Error creating sample data:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedSampleData();