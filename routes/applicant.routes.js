import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import checkBlocked from "../middlewares/checkBlocked.js";
import {
  createOrUpdateProfile,
  getProfile,
  deleteProfile,
  uploadPhoto,
  deletePhoto,
  applyJob,
  myApplications,
  saveResume,
  getResume,
  getCompanies,
  uploadDocuments,
  deleteDocuments,
} from "../controllers/applicant.controller.js";

const router = express.Router();

router.use(auth, role(["APPLICANT"]));

// Read-only routes (allowed for blocked users)
router.get("/profile", getProfile);
router.get("/applications", myApplications);
router.get("/resume", getResume);
router.get("/companies", getCompanies);

// Write routes (blocked users cannot access)
router.post("/profile", checkBlocked, createOrUpdateProfile);
router.delete("/profile", checkBlocked, deleteProfile);
router.post("/photo", checkBlocked, uploadPhoto);
router.delete("/photo", checkBlocked, deletePhoto);
router.post("/documents", checkBlocked, uploadDocuments);
router.delete("/documents", checkBlocked, deleteDocuments);
router.post("/apply", checkBlocked, applyJob);
router.post("/resume", checkBlocked, saveResume);

export default router;
