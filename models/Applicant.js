import mongoose from "mongoose";

export default mongoose.model(
  "Applicant",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    phone: String,
    location: String,
    bio: String,
    photo: String, // Base64 encoded photo or URL
    skills: [String],
    experience: String,
    education: String,
    resume: String, // URL to resume PDF
    // New educational fields
    tenthPercentage: Number,
    twelfthPercentage: Number,
    collegeName: String,
    schoolName: String,
    cgpa: Number,
    degree: String,
    documents: String, // Base64 encoded PDF documents
  }, { timestamps: true })
);
