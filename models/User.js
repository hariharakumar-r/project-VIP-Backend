import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String, // Phone number field
    password: String,
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "COMPANY", "APPLICANT"],
    },
    picture: String, // Base64 or URL for user profile picture
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    otp: String, // For storing OTP
    otpExpiresAt: Date, // For storing OTP expiry timestamp
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
