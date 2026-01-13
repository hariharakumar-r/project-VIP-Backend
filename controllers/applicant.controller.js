import Applicant from "../models/Applicant.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

export const createOrUpdateProfile = async (req, res) => {
  try {
    const { name, picture, phone, location, bio, photo, skills, experience, education } = req.body;

    // Update user info (name and picture)
    if (name || picture) {
      await User.findByIdAndUpdate(req.user.id, { name, picture });
    }

    // Update applicant profile (including photo)
    const profile = await Applicant.findOneAndUpdate(
      { userId: req.user.id },
      { 
        userId: req.user.id, 
        phone, 
        location, 
        bio, 
        photo, // Store photo in applicant profile
        skills, 
        experience, 
        education 
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

export const getProfile = async (req, res) => {
  try {
    // Get user info
    const user = await User.findById(req.user.id).select("-password");
    
    // Get applicant profile
    const applicantProfile = await Applicant.findOne({ userId: req.user.id });

    // Combine both
    const profile = {
      ...user.toObject(),
      ...applicantProfile?.toObject(),
    };

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile", error: err.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    await Applicant.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete profile", error: err.message });
  }
};

export const applyJob = async (req, res) => {
  const { jobId, resumeSnapshot } = req.body;

  try {
    const alreadyApplied = await Application.findOne({
      jobId,
      applicantId: req.user.id,
    });

    if (alreadyApplied)
      return res.status(400).json({ message: "Already applied" });

    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
      resumeSnapshot,
    });

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Failed to apply for job", error: err.message });
  }
};

export const myApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      applicantId: req.user.id,
    }).populate("jobId");

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to get applications", error: err.message });
  }
};

export const saveResume = async (req, res) => {
  try {
    const { resumeData } = req.body;

    const profile = await Applicant.findOneAndUpdate(
      { userId: req.user.id },
      { resume: resumeData }, // Assuming `resume` is a field in the Applicant model
      { new: true }
    );

    res.json({ message: "Resume saved successfully", profile });
  } catch (err) {
    res.status(500).json({ message: "Failed to save resume", error: err.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const profile = await Applicant.findOne({ userId: req.user.id }, "resume");
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resume", error: err.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}, "name companyName description industry website location");
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch companies", error: err.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({ message: "No photo provided" });
    }

    // Validate that photo is a base64 string
    if (!photo.startsWith("data:image")) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    // Update applicant profile with photo
    const profile = await Applicant.findOneAndUpdate(
      { userId: req.user.id },
      { photo },
      { upsert: true, new: true }
    );

    res.json({ message: "Photo uploaded successfully", profile });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload photo", error: err.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const profile = await Applicant.findOneAndUpdate(
      { userId: req.user.id },
      { photo: null },
      { new: true }
    );

    res.json({ message: "Photo deleted successfully", profile });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete photo", error: err.message });
  }
};
