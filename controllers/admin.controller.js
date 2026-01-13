import User from "../models/User.js";
import Job from "../models/Job.js";
import PromotionRequest from "../models/PromotionRequest.js";

// PROFILE
export const getProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.userId).select("-password");
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
    const { postId, status } = req.body; // status: "approved", "rejected", "pending"
    const job = await Job.findByIdAndUpdate(postId, { moderationStatus: status }, { new: true });
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


// PROMOTION REQUESTS
export const submitPromotionRequest = async (req, res) => {
  try {
    const { jobId, message } = req.body;
    
    // Verify job exists and belongs to a company
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    // Check if promotion request already exists
    const existingRequest = await PromotionRequest.findOne({ jobId, status: "pending" });
    if (existingRequest) {
      return res.status(400).json({ message: "Promotion request already pending for this job" });
    }
    
    const promoRequest = await PromotionRequest.create({
      jobId,
      companyId: job.companyId,
      message
    });
    
    res.status(201).json(promoRequest);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit promotion request", error: err.message });
  }
};

export const getPromotionRequests = async (req, res) => {
  try {
    const requests = await PromotionRequest.find({ status: "pending" })
      .populate("jobId", "title description salary")
      .populate("companyId", "name");
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
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const promoRequest = await PromotionRequest.findByIdAndUpdate(
      requestId,
      { status, rejectionReason },
      { new: true }
    ).populate("jobId");
    
    if (!promoRequest) {
      return res.status(404).json({ message: "Promotion request not found" });
    }
    
    // If approved, update the job's promoted status
    if (status === "approved") {
      await Job.findByIdAndUpdate(promoRequest.jobId._id, { promoted: true });
    }
    
    res.json(promoRequest);
  } catch (err) {
    res.status(500).json({ message: "Failed to update promotion request", error: err.message });
  }
};
