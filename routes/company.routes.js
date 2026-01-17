import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import checkBlocked from "../middlewares/checkBlocked.js";
import {
  createOrUpdateCompanyProfile,
  getCompanyProfile,
  getCompanyProfileById,
  deleteCompanyProfile,
  getApplicantsByJob,
  updateApplicationStatus,
  scheduleInterview,
  promoteJobPost,
  getMyPosts,
  createJobPost,
  updateJobPost,
  deleteJobPost,
  getJobPostById,
  getUserProfileInfo,
  updateUserPhone
} from "../controllers/company.controller.js";

const router = express.Router();

// Public route - allow all authenticated users to view company profiles
router.get("/view/:userId", auth, getCompanyProfileById);

// Company-only routes
router.use(auth, role(["COMPANY"]));

// Read-only routes (allowed for blocked users)
router.get("/profile", getCompanyProfile);
router.get("/user-info", getUserProfileInfo);
router.get("/job/:jobId", getJobPostById);
router.get("/my-posts", getMyPosts);
router.get("/applicants/:jobId", getApplicantsByJob);

// Write routes (blocked users cannot access)
router.post("/profile", checkBlocked, createOrUpdateCompanyProfile);
router.delete("/profile", checkBlocked, deleteCompanyProfile);
router.patch("/user-phone", checkBlocked, updateUserPhone);
router.post("/job", checkBlocked, createJobPost);
router.put("/job/:jobId", checkBlocked, updateJobPost);
router.delete("/job/:jobId", checkBlocked, deleteJobPost);
router.patch("/application/:applicationId/status", checkBlocked, updateApplicationStatus);
router.post("/application/:applicationId/interview", checkBlocked, scheduleInterview);
router.patch("/job/:jobId/promote", checkBlocked, promoteJobPost);

export default router;
