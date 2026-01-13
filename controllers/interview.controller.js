import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import { sendMail } from "../utils/mailer.js";
import { generateInterviewInviteTemplate, generateInterviewReminderTemplate, generateCompanyInterviewTemplate } from "../utils/emailTemplates.js";

/**
 * NOTE: This controller is deprecated in favor of webhook-based scheduling
 * See: backend/controllers/webhook.controller.js
 * 
 * The webhook solution creates real Zoom meetings and sends emails
 * without requiring OAuth setup.
 * 
 * All functions below are kept for reference but are no longer used.
 */

/**
 * DEPRECATED: Use webhook endpoint instead
 * GET company's interviews
 */
export const getCompanyInterviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { companyId: req.user.id };
    if (status) filter.status = status;

    const interviews = await Interview.find(filter)
      .populate("applicantId", "name email phone")
      .populate("jobId", "title location")
      .populate("applicationId", "status")
      .sort({ scheduledAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Interview.countDocuments(filter);

    res.json({
      interviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (err) {
    console.error("Get company interviews error:", err);
    res.status(500).json({ 
      message: "Failed to fetch interviews", 
      error: err.message 
    });
  }
};

/**
 * DEPRECATED: Use webhook endpoint instead
 * Get applicant's interviews
 */
export const getApplicantInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ applicantId: req.user.id })
      .populate("companyId", "name")
      .populate("jobId", "title location")
      .populate("applicationId", "status")
      .sort({ scheduledAt: -1 });

    res.json({ interviews });

  } catch (err) {
    console.error("Get applicant interviews error:", err);
    res.status(500).json({ 
      message: "Failed to fetch interviews", 
      error: err.message 
    });
  }
};

/**
 * DEPRECATED: Use webhook endpoint instead
 * Get interview details
 */
export const getInterviewDetails = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId)
      .populate("applicantId", "name email phone")
      .populate("companyId", "name")
      .populate("jobId", "title location description")
      .populate("applicationId", "status resumeSnapshot");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Check if user has access to this interview
    const hasAccess = interview.companyId._id.toString() === req.user.id || 
                     interview.applicantId._id.toString() === req.user.id;

    if (!hasAccess) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ interview });

  } catch (err) {
    console.error("Get interview details error:", err);
    res.status(500).json({ 
      message: "Failed to fetch interview details", 
      error: err.message 
    });
  }
};

/**
 * DEPRECATED: Use webhook endpoint instead
 * Send interview reminder
 */
export const sendInterviewReminder = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId)
      .populate("applicantId", "name email")
      .populate("jobId", "title")
      .populate("companyId", "name");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Verify ownership
    if (interview.companyId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Send reminder email
    const reminderContent = generateInterviewReminderTemplate({
      applicantName: interview.applicantId.name,
      companyName: interview.companyId.name,
      jobTitle: interview.jobId.title,
      interviewDate: interview.scheduledAt.toLocaleDateString(),
      interviewTime: interview.scheduledAt.toLocaleTimeString(),
      zoomJoinUrl: interview.zoomJoinUrl,
      zoomPassword: interview.zoomPassword
    });

    await sendMail(
      interview.applicantId.email,
      `Interview Reminder - ${interview.jobId.title}`,
      reminderContent
    );

    // Mark reminder as sent
    await Interview.findByIdAndUpdate(interviewId, { reminderSent: true });

    res.json({ message: "Interview reminder sent successfully" });

  } catch (err) {
    console.error("Send interview reminder error:", err);
    res.status(500).json({ 
      message: "Failed to send interview reminder", 
      error: err.message 
    });
  }
};

/*
 * DEPRECATED FUNCTIONS (No longer used - kept for reference)
 * 
 * The following functions were used for OAuth-based Zoom integration:
 * - scheduleInterview()
 * - updateInterview()
 * - cancelInterview()
 * - getZoomSDKToken()
 * 
 * These are now replaced by the webhook solution in webhook.controller.js
 * which creates real Zoom meetings without requiring OAuth setup.
 */
