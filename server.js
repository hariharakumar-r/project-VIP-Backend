import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import bcrypt from "bcryptjs";
// const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5174","http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.options('/*', cors());

// Add this before your API routes
app.get("/", (req, res) => {
  res.send("🚀 API is running on /api/* endpoints!");
});

// Add health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

// Diagnostic endpoint for debugging
app.get("/api/debug/applicants/:jobId", async (req, res) => {
  try {
    const Application = (await import("./models/Application.js")).default;
    const Applicant = (await import("./models/Applicant.js")).default;
    const { jobId } = req.params;
    
    const applications = await Application.find({ jobId }).populate("applicantId");
    const applicantProfiles = await Applicant.find({});
    
    res.json({
      jobId,
      applicationsCount: applications.length,
      applications: applications.map(a => ({
        _id: a._id,
        applicantId: a.applicantId?._id,
        applicantName: a.applicantId?.name,
        status: a.status
      })),
      totalApplicantProfiles: applicantProfiles.length,
      applicantProfiles: applicantProfiles.map(p => ({
        _id: p._id,
        userId: p.userId,
        skills: p.skills
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/company", (await import("./routes/company.routes.js")).default);
app.use(
  "/api/applicant",
  (await import("./routes/applicant.routes.js")).default
);
app.use("/api/auth", (await import("./routes/auth.routes.js")).default);
app.use("/api/jobs", (await import("./routes/job.routes.js")).default);
app.use("/api/admin", (await import("./routes/admin.routes.js")).default);
app.use("/api/interviews", (await import("./routes/interview.routes.js")).default);
app.use("/api/webhook", (await import("./routes/webhook.routes.js")).default);

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 API is running on http://localhost:${process.env.PORT || 3000}`)
);


