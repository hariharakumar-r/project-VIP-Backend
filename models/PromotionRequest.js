import mongoose from "mongoose";

export default mongoose.model(
  "PromotionRequest",
  new mongoose.Schema(
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
      message: String,
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      rejectionReason: String
    },
    { timestamps: true }
  )
);
