import mongoose from "mongoose";

export default mongoose.model(
  "Job",
  new mongoose.Schema(
    {
      companyId: mongoose.Schema.Types.ObjectId,
      title: String,
      location: String,
      jobType: String,
      skills: [String],
      salary: String,
      description: String,
      promoted: { type: Boolean, default: false },
      status: { type: String, default: "ACTIVE" },
      moderationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
  )
);
