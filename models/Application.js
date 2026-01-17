import mongoose from "mongoose";

export default mongoose.model(
  "Application",
  new mongoose.Schema(
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
      },
      applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      resumeSnapshot: Object,
      status: { 
        type: String, 
        default: "APPLIED",
        enum: ["APPLIED", "SHORTLISTED", "REJECTED", "ACCEPTED", "INTERVIEW_SCHEDULED"]
      },
      interview: {
        zoomLink: String,
        scheduledAt: Date,
      },
    },
    { timestamps: true }
  )
);
