import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    applicationId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Application", 
      required: true 
    },
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Job", 
      required: true 
    },
    companyId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    applicantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    
    // Interview Details
    title: { type: String, required: true },
    description: String,
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 30 }, // in minutes
    timezone: { type: String, default: "Asia/Kolkata" },
    
    // Zoom Meeting Details
    zoomMeetingId: String,
    zoomJoinUrl: String,
    zoomStartUrl: String,
    zoomPassword: String,
    
    // Status
    status: {
      type: String,
      enum: ["SCHEDULED", "STARTED", "COMPLETED", "CANCELLED", "NO_SHOW"],
      default: "SCHEDULED"
    },
    
    // Email Notifications
    invitationSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    
    // Meeting Notes
    notes: String,
    feedback: String,
    
    // Metadata
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }
  },
  { timestamps: true }
);

// Index for efficient queries
interviewSchema.index({ applicationId: 1 });
interviewSchema.index({ companyId: 1, scheduledAt: 1 });
interviewSchema.index({ applicantId: 1, scheduledAt: 1 });

export default mongoose.model("Interview", interviewSchema);