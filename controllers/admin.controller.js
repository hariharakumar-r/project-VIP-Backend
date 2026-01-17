import User from "../models/User.js";
import Job from "../models/Job.js";
import PromotionRequest from "../models/PromotionRequest.js";

import Application from "../models/Application.js";
import Interview from "../models/Interview.js";
import Company from "../models/Company.js";
import Applicant from "../models/Applicant.js";

// DASHBOARD STATISTICS
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // ===== TOTAL COUNTS =====
    const totalUsers = await User.countDocuments();
    const totalCompanies = await User.countDocuments({ role: "COMPANY" });
    const totalApplicants = await User.countDocuments({ role: "APPLICANT" });
    const totalAdmins = await User.countDocuments({ role: "SUPER_ADMIN" });
    const totalJobPosts = await Job.countDocuments();
    const activeJobPosts = await Job.countDocuments({ 
      status: "ACTIVE", 
      moderationStatus: "approved",
      isBlockedByAdmin: { $ne: true }
    });
    const totalApplications = await Application.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const totalPromoRequests = await PromotionRequest.countDocuments();
    const totalCompanyProfiles = await Company.countDocuments();
    const totalApplicantProfiles = await Applicant.countDocuments();
    
    // ===== THIS MONTH COUNTS =====
    const newUsersThisMonth = await User.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });
    const newJobPostsThisMonth = await Job.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });
    const newApplicationsThisMonth = await Application.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });
    const newInterviewsThisMonth = await Interview.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });
    const newRegistrationsThisMonth = await User.countDocuments({ 
      createdAt: { $gte: startOfMonth },
      role: { $in: ["APPLICANT", "COMPANY"] }
    });
    
    // ===== THIS WEEK COUNTS =====
    const newUsersThisWeek = await User.countDocuments({ 
      createdAt: { $gte: startOfWeek } 
    });
    const newApplicationsThisWeek = await Application.countDocuments({ 
      createdAt: { $gte: startOfWeek } 
    });
    
    // ===== TODAY COUNTS =====
    const newUsersToday = await User.countDocuments({ 
      createdAt: { $gte: startOfToday } 
    });
    const newApplicationsToday = await Application.countDocuments({ 
      createdAt: { $gte: startOfToday } 
    });
    
    // ===== MODERATION & BLOCKING =====
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const blockedPosts = await Job.countDocuments({ isBlockedByAdmin: true });
    const pendingPosts = await Job.countDocuments({ moderationStatus: "pending" });
    const rejectedPosts = await Job.countDocuments({ moderationStatus: "rejected" });
    const pendingPromoRequests = await PromotionRequest.countDocuments({ status: "pending" });
    const approvedPromoRequests = await PromotionRequest.countDocuments({ status: "approved" });
    const rejectedPromoRequests = await PromotionRequest.countDocuments({ status: "rejected" });
    
    // ===== APPLICATION STATISTICS =====
    const appliedApplications = await Application.countDocuments({ status: "APPLIED" });
    const shortlistedApplications = await Application.countDocuments({ status: "SHORTLISTED" });
    const rejectedApplications = await Application.countDocuments({ status: "REJECTED" });
    const hiredApplications = await Application.countDocuments({ status: "HIRED" });
    
    // ===== INTERVIEW STATISTICS =====
    const scheduledInterviews = await Interview.countDocuments({ status: "SCHEDULED" });
    const completedInterviews = await Interview.countDocuments({ status: "COMPLETED" });
    const cancelledInterviews = await Interview.countDocuments({ status: "CANCELLED" });
    const upcomingInterviews = await Interview.countDocuments({ 
      status: "SCHEDULED",
      scheduledAt: { $gte: new Date() }
    });
    
    // ===== JOB STATISTICS =====
    const promotedJobs = await Job.countDocuments({ promoted: true });
    const fullTimeJobs = await Job.countDocuments({ jobType: "Full-time" });
    const partTimeJobs = await Job.countDocuments({ jobType: "Part-time" });
    const contractJobs = await Job.countDocuments({ jobType: "Contract" });
    
    // ===== VERIFICATION STATUS =====
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });
    
    // ===== MONTHLY DATA FOR CHARTS (last 6 months) =====
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthUsers = await User.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      const monthJobs = await Job.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      const monthApplications = await Application.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      const monthInterviews = await Interview.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      
      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        users: monthUsers,
        jobs: monthJobs,
        applications: monthApplications,
        interviews: monthInterviews
      });
    }
    
    // ===== TOP STATISTICS =====
    // Most active companies (by job posts)
    const topCompanies = await Job.aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: "$createdBy", jobCount: { $sum: 1 } } },
      { $sort: { jobCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "company" } },
      { $unwind: "$company" },
      { $project: { name: "$company.name", email: "$company.email", jobCount: 1 } }
    ]);
    
    // Most applied jobs
    const topJobs = await Application.aggregate([
      { $group: { _id: "$jobId", applicationCount: { $sum: 1 } } },
      { $sort: { applicationCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: "jobs", localField: "_id", foreignField: "_id", as: "job" } },
      { $unwind: "$job" },
      { $project: { title: "$job.title", location: "$job.location", applicationCount: 1 } }
    ]);
    
    // Recent activity (last 10 actions)
    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentJobs = await Job.find()
      .select("title status createdAt")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentApplications = await Application.find()
      .select("status createdAt")
      .populate("jobId", "title")
      .populate("applicantId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);
    
    // ===== RESPONSE =====
    res.json({
      totals: {
        users: totalUsers,
        companies: totalCompanies,
        applicants: totalApplicants,
        admins: totalAdmins,
        jobPosts: totalJobPosts,
        activeJobPosts,
        applications: totalApplications,
        interviews: totalInterviews,
        promoRequests: totalPromoRequests,
        companyProfiles: totalCompanyProfiles,
        applicantProfiles: totalApplicantProfiles
      },
      thisMonth: {
        newUsers: newUsersThisMonth,
        newJobPosts: newJobPostsThisMonth,
        newApplications: newApplicationsThisMonth,
        newInterviews: newInterviewsThisMonth,
        newRegistrations: newRegistrationsThisMonth
      },
      thisWeek: {
        newUsers: newUsersThisWeek,
        newApplications: newApplicationsThisWeek
      },
      today: {
        newUsers: newUsersToday,
        newApplications: newApplicationsToday
      },
      moderation: {
        blockedUsers,
        blockedPosts,
        pendingPosts,
        rejectedPosts,
        pendingPromoRequests,
        approvedPromoRequests,
        rejectedPromoRequests
      },
      applications: {
        total: totalApplications,
        applied: appliedApplications,
        shortlisted: shortlistedApplications,
        rejected: rejectedApplications,
        hired: hiredApplications
      },
      interviews: {
        total: totalInterviews,
        scheduled: scheduledInterviews,
        completed: completedInterviews,
        cancelled: cancelledInterviews,
        upcoming: upcomingInterviews
      },
      jobs: {
        total: totalJobPosts,
        active: activeJobPosts,
        promoted: promotedJobs,
        fullTime: fullTimeJobs,
        partTime: partTimeJobs,
        contract: contractJobs
      },
      verification: {
        verified: verifiedUsers,
        unverified: unverifiedUsers
      },
      charts: {
        monthlyData,
        userDistribution: {
          applicants: totalApplicants,
          companies: totalCompanies,
          admins: totalAdmins
        }
      },
      topStats: {
        topCompanies,
        topJobs
      },
      recentActivity: {
        users: recentUsers,
        jobs: recentJobs,
        applications: recentApplications
      }
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard statistics", error: err.message });
  }
};

// PROFILE
export const getProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.userId).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const admin = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select("-password");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

// JOB POSTS - CRUD
export const createJobPost = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.userId });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to create job", error: err.message });
  }
};

export const getJobPosts = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.userId }).populate("createdBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

export const myPosts = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.userId }).populate("createdBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job", error: err.message });
  }
};

export const updateJobPost = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to update job", error: err.message });
  }
};

export const deleteJobPost = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job", error: err.message });
  }
};

export const addPromotionalJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, promoted: true, createdBy: req.userId });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to add promotional job", error: err.message });
  }
};

export const getPromoRequests = async (req, res) => {
  try {
    const promoJobs = await Job.find({ promoted: true, moderationStatus: "pending" }).populate("createdBy", "name email");
    res.json(promoJobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch promotional job requests", error: err.message });
  }
};

// USERS - CRUD & MODERATION
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    res.json({ message: "User blocked", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to block user", error: err.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    res.json({ message: "User unblocked", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to unblock user", error: err.message });
  }
};

// POSTS MODERATION
export const moderatePost = async (req, res) => {
  try {
    const { postId, status, isBlockedByAdmin } = req.body; // status: "approved", "rejected", "pending"
    
    const updateData = { moderationStatus: status };
    if (typeof isBlockedByAdmin === 'boolean') {
      updateData.isBlockedByAdmin = isBlockedByAdmin;
    }
    
    const job = await Job.findByIdAndUpdate(postId, updateData, { new: true });
    if (!job) return res.status(404).json({ message: "Post not found" });
    
    res.json({ message: `Post ${status}`, job });
  } catch (err) {
    res.status(500).json({ message: "Failed to moderate post", error: err.message });
  }
};

export const getPendingPosts = async (req, res) => {
  try {
    const posts = await Job.find({ moderationStatus: "pending" }).populate("createdBy", "name email");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending posts", error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Job.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts", error: err.message });
  }
};

export const blockPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const job = await Job.findByIdAndUpdate(
      postId, 
      { isBlockedByAdmin: true, moderationStatus: "rejected" }, 
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post blocked successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to block post", error: err.message });
  }
};

export const unblockPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const job = await Job.findByIdAndUpdate(
      postId, 
      { isBlockedByAdmin: false, moderationStatus: "approved" }, 
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post unblocked successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to unblock post", error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const job = await Job.findByIdAndDelete(postId);
    if (!job) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post", error: err.message });
  }
};


// PROMOTION REQUESTS
export const submitPromotionRequest = async (req, res) => {
  try {
    const { jobId, message, contactPhone } = req.body;
    
    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    // Get company ID from the job or from the authenticated user
    const companyId = job.createdBy || req.userId;
    
    // Check if promotion request already exists for this job
    const existingRequest = await PromotionRequest.findOne({ 
      jobId, 
      status: "pending" 
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: "A pending promotion request already exists for this job" });
    }
    
    // Check if job is already promoted
    if (job.promoted) {
      return res.status(400).json({ message: "This job is already promoted" });
    }
    
    const promoRequest = await PromotionRequest.create({
      jobId,
      companyId,
      message,
      contactPhone
    });
    
    res.status(201).json({ 
      message: "Promotion request submitted successfully",
      request: promoRequest 
    });
  } catch (err) {
    console.error("Submit promotion request error:", err);
    res.status(500).json({ message: "Failed to submit promotion request", error: err.message });
  }
};

export const getPromotionRequests = async (req, res) => {
  try {
    const requests = await PromotionRequest.find()
      .populate("jobId", "title description salary location jobType")
      .populate("companyId", "name email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch promotion requests", error: err.message });
  }
};

export const updatePromotionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, rejectionReason } = req.body;
    
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
    }
    
    const promoRequest = await PromotionRequest.findById(requestId).populate("jobId");
    
    if (!promoRequest) {
      return res.status(404).json({ message: "Promotion request not found" });
    }
    
    // Update the promotion request status
    promoRequest.status = status;
    if (rejectionReason) {
      promoRequest.rejectionReason = rejectionReason;
    }
    await promoRequest.save();
    
    // If approved, update the job's promoted status
    if (status === "approved" && promoRequest.jobId) {
      await Job.findByIdAndUpdate(promoRequest.jobId._id, { 
        promoted: true,
        moderationStatus: "approved" // Ensure it's approved for visibility
      });
    }
    
    res.json({ 
      message: `Promotion request ${status}`,
      request: promoRequest 
    });
  } catch (err) {
    console.error("Update promotion request error:", err);
    res.status(500).json({ message: "Failed to update promotion request", error: err.message });
  }
};
