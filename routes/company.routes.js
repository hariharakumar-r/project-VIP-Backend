import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
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

router.post("/profile", createOrUpdateCompanyProfile);
router.get("/profile", getCompanyProfile);
router.delete("/profile", deleteCompanyProfile);

// User profile info routes
router.get("/user-info", getUserProfileInfo);
router.patch("/user-phone", updateUserPhone);

// Job CRUD routes
router.post("/job", createJobPost);
router.get("/job/:jobId", getJobPostById);
router.put("/job/:jobId", updateJobPost);
router.delete("/job/:jobId", deleteJobPost);
router.get("/my-posts", getMyPosts);

router.get("/applicants/:jobId", getApplicantsByJob);
router.patch("/application/:applicationId/status", updateApplicationStatus);
router.post("/application/:applicationId/interview", scheduleInterview);
router.patch("/job/:jobId/promote", promoteJobPost);

export default router;
