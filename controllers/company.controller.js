import Company from "../models/Company.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import PromotionRequest from "../models/PromotionRequest.js";
import User from "../models/User.js";
import Applicant from "../models/Applicant.js";
import { sendMail } from "../utils/mailer.js";

export const createOrUpdateCompanyProfile = async (req, res) => {
  try {
    const { name, description, industry, website, location, logo, role } = req.body;

    const profile = await Company.findOneAndUpdate(
      { userId: req.user.id },
      { 
        userId: req.user.id, 
        name, 
        companyName: name, // Keep in sync
        description, 
        industry, 
        website, 
        location, 
        logo, 
        role 
      },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create/update profile", error: err.message });
  }
};

export const getCompanyProfile = async (req, res) => {
  try {
    const profile = await Company.findOne({ userId: req.user.id });
    
    // If no profile exists, return a basic profile structure
    if (!profile) {
      return res.json({
        userId: req.user.id,
        name: "",
        companyName: "",
        description: "",
        industry: "",
        website: "",
        location: "",
        logo: "",
        role: ""
      });
    }
    
    res.json(profile);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get profile", error: err.message });
  }
};

export const getCompanyProfileById = async (req, res) => {
  try {
    const profile = await Company.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: "Company profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get profile", error: err.message });
  }
};

export const deleteCompanyProfile = async (req, res) => {
  try {
    await Company.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Company profile deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete profile", error: err.message });
  }
};

export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // First, get all applications for this job
    const applications = await Application.find({ jobId })
      .populate({
        path: "applicantId",
        select: "name email phone",
        model: "User"
      })
      .lean();

    if (!applications || applications.length === 0) {
      return res.json([]);
    }

    // Then enrich each application with applicant profile data
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        try {
          // Check if applicantId exists and has _id
          if (!app.applicantId || !app.applicantId._id) {
            console.warn("Application has no applicantId:", app._id);
            return {
              _id: app._id,
              applicantId: app.applicantId || {},
              jobId: app.jobId,
              status: app.status,
              resumeSnapshot: app.resumeSnapshot,
              interview: app.interview,
              createdAt: app.createdAt,
              updatedAt: app.updatedAt,
              applicantProfile: {}
            };
          }

          // Fetch applicant profile
          const applicantProfile = await Applicant.findOne({ 
            userId: app.applicantId._id 
          }).lean();
          
          return {
            _id: app._id,
            applicantId: app.applicantId,
            jobId: app.jobId,
            status: app.status,
            resumeSnapshot: app.resumeSnapshot,
            interview: app.interview,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
            applicantProfile: applicantProfile ? {
              resume: applicantProfile.resume,
              skills: applicantProfile.skills || [],
              experience: applicantProfile.experience,
              education: applicantProfile.education,
              bio: applicantProfile.bio,
              phone: applicantProfile.phone,
              location: applicantProfile.location,
              photo: applicantProfile.photo,
              // New educational fields
              tenthPercentage: applicantProfile.tenthPercentage,
              twelfthPercentage: applicantProfile.twelfthPercentage,
              collegeName: applicantProfile.collegeName,
              schoolName: applicantProfile.schoolName,
              cgpa: applicantProfile.cgpa,
              degree: applicantProfile.degree,
              documents: applicantProfile.documents
            } : {}
          };
        } catch (profileErr) {
          console.error("Error fetching applicant profile:", profileErr.message);
          // Return application without profile data if there's an error
          return {
            _id: app._id,
            applicantId: app.applicantId || {},
            jobId: app.jobId,
            status: app.status,
            resumeSnapshot: app.resumeSnapshot,
            interview: app.interview,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
            applicantProfile: {}
          };
        }
      })
    );

    res.json(enrichedApplications);
  } catch (err) {
    console.error("getApplicantsByJob error:", err);
    res.status(500).json({ 
      message: "Failed to get applicants", 
      error: err.message 
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const app = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status },
      { new: true }
    );

    res.json(app);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update application status", error: err.message });
  }
};

export const scheduleInterview = async (req, res) => {
  // Redirect to new interview controller
  res.status(301).json({ 
    message: "This endpoint has been moved. Please use /api/interviews/schedule/:applicationId",
    newEndpoint: `/api/interviews/schedule/${req.params.applicationId}`
  });
};

export const promoteJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job and verify it belongs to the company
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job post not found" });
    }

    // Check if job belongs to this company (using companyId)
    if (job.companyId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized - job does not belong to your company" });
    }

    // Create a promotion request instead of directly promoting
    const existingRequest = await PromotionRequest.findOne({ jobId, status: "pending" });
    if (existingRequest) {
      return res.status(400).json({ message: "Promotion request already pending for this job" });
    }

    const promoRequest = await PromotionRequest.create({
      jobId,
      companyId: req.user.id,
      message: req.body.message || ""
    });

    res.json({ message: "Promotion request submitted successfully", promoRequest });
  } catch (err) {
    res.status(500).json({ message: "Failed to request promotion", error: err.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job posts", error: err.message });
  }
};
// Job CRUD operations
export const createJobPost = async (req, res) => {
  try {
    const { title, location, jobType, skills, salary, description } = req.body;
    
    const job = await Job.create({
      companyId: req.user.id,
      title,
      location,
      jobType,
      skills,
      salary,
      description,
      createdBy: req.user.id
    });
    
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to create job post", error: err.message });
  }
};

export const updateJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { title, location, jobType, skills, salary, description, status } = req.body;
    
    // Verify job belongs to this company
    const job = await Job.findOne({ _id: jobId, companyId: req.user.id });
    if (!job) {
      return res.status(404).json({ message: "Job post not found or unauthorized" });
    }
    
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { title, location, jobType, skills, salary, description, status },
      { new: true }
    );
    
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Failed to update job post", error: err.message });
  }
};

export const deleteJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Verify job belongs to this company
    const job = await Job.findOne({ _id: jobId, companyId: req.user.id });
    if (!job) {
      return res.status(404).json({ message: "Job post not found or unauthorized" });
    }
    
    await Job.findByIdAndDelete(jobId);
    res.json({ message: "Job post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job post", error: err.message });
  }
};

export const getJobPostById = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Verify job belongs to this company
    const job = await Job.findOne({ _id: jobId, companyId: req.user.id });
    if (!job) {
      return res.status(404).json({ message: "Job post not found or unauthorized" });
    }
    
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job post", error: err.message });
  }
};
// Get user profile info for promotion requests
export const getUserProfileInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const company = await Company.findOne({ userId: req.user.id });
    
    const profileInfo = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyName: company?.name || company?.companyName,
      companyInfo: company
    };
    
    res.json(profileInfo);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile info", error: err.message });
  }
};

// Update user phone number
export const updateUserPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { phone },
      { new: true }
    ).select("-password");
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update phone number", error: err.message });
  }
};