import mongoose from "mongoose";

export default mongoose.model(
  "Company",
  new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    companyName: String, // Keep for backward compatibility
    description: String,
    industry: String,
    website: String,
    location: String,
    logo: String, // Base64 encoded logo/image
    role: String, // Company role/position (e.g., "HR Manager", "Recruiter")
  }, { timestamps: true })
);
