import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import {
  getCompanyInterviews,
  getApplicantInterviews,
  getInterviewDetails,
  sendInterviewReminder
} from "../controllers/interview.controller.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Company routes - for viewing and managing interviews
router.get("/company", role(["COMPANY"]), getCompanyInterviews);
router.post("/:interviewId/reminder", role(["COMPANY"]), sendInterviewReminder);

// Applicant routes - for viewing their interviews
router.get("/applicant", role(["APPLICANT"]), getApplicantInterviews);

// Shared routes - both company and applicant can access
router.get("/:interviewId", getInterviewDetails);

/**
 * NOTE: Interview scheduling is now handled by webhook endpoint
 * POST /api/webhook/schedule-interview
 * 
 * Old routes (deprecated):
 * - POST /schedule/:applicationId (scheduleInterview)
 * - PUT /:interviewId (updateInterview)
 * - DELETE /:interviewId (cancelInterview)
 * - GET /:interviewId/zoom-token (getZoomSDKToken)
 */

export default router;