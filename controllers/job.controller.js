import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, companyId: req.user.id });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to create job", error: err.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ 
      status: "ACTIVE",
      moderationStatus: "approved",
      isBlockedByAdmin: { $ne: true }
    })
      .populate("companyId", "name companyName email logo description industry website location")
      .populate("createdBy", "name email")
      .sort({ promoted: -1, createdAt: -1 }); // Promoted jobs first, then by creation date
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};
