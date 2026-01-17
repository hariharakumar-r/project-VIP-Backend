import Applicant from "../models/Applicant.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

export const createOrUpdateProfile = async (req, res) => {
  try {
    const { 
      name, 
      picture, 
      phone, 
      location, 
      bio, 
      photo, 
      skills, 
      experience, 
      education,
      // New educational fields
      tenthPercentage,
      twelfthPercentage,
      collegeName,
      schoolName,
      cgpa,
      degree,
      documents,
      resume
    } = req.body;

    // Update user info (name and picture)
    if (name || picture) {
      await User.findByIdAndUpdate(req.user.id, { name, picture });
    }

    // Prepare update data with proper handling of empty values
    const updateData = { 
      userId: req.user.id, 
      phone: phone || null, 
      location: location || null, 
      bio: bio || null, 
      photo: photo || null, // Store photo in applicant profile
      skills: skills || [], 
      experience: experience || null, 
      education: education || null,
      // New educational fields - handle empty strings and convert to proper types
      tenthPercentage: tenthPercentage && tenthPercentage !== "" ? parseFloat(tenthPercentage) : null,
      twelfthPercentage: twelfthPercentage && twelfthPercentage !== "" ? parseFloat(twelfthPercentage) : null,
      collegeName: collegeName || null,
      schoolName: schoolName || null,
      cgpa: cgpa && cgpa !== "" ? parseFloat(cgpa) : null,
      degree: degree || null,
      documents: documents || null,
      resume: resume || null
    };

    // Remove undefined values to prevent overwriting existing data with undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update applicant profile (including photo and new educational fields)
    const profile = await Applicant.findOneAndUpdate(
      { userId: req.user.id },
      updateData,
      { upsert: true, new: true }
    );

    res.json(profile);
  } catch (err) {
    console.error("Profile update error:", err);
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
    console.error("Get profile error:", err);
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
    })
    .populate({
      path: "jobId",
      populate: {
        path: "companyId",
        select: "name companyName"
      }
    })
    .sort({ createdAt: -1 }); // Sort by newest first

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

export const uploadDocuments = async (req, res) => {
  try {
    const { documents } = req.body;

    if (!documents) {
      return res.status(400).json({ message: "No documents provided" });
    }

    // Validate that documents is a base64 PDF string
    if (!documents.startsWith("data:application/pdf")) {
      return res.status(400).json({ message: "Invalid document format. Only PDF files are allowed." });
    }

    // Update applicant profile with documents
    const profile = await Applicant.findOneAndUpdate(
      { userId: req.user.id },
      { documents },
      { upsert: true, new: true }
    );

    res.json({ message: "Documents uploaded successfully", profile });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload documents", error: err.message });
  }
};

export const deleteDocuments = async (req, res) => {
  try {
    const profile = await Applicant.findOneAndUpdate(
      { userId: req.user.id },
      { documents: null },
      { new: true }
    );

    res.json({ message: "Documents deleted successfully", profile });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete documents", error: err.message });
  }
};
