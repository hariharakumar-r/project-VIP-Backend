import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
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
} from "../controllers/applicant.controller.js";

const router = express.Router();

router.use(auth, role(["APPLICANT"]));

router.post("/profile", createOrUpdateProfile);
router.get("/profile", getProfile);
router.delete("/profile", deleteProfile);

router.post("/photo", uploadPhoto);
router.delete("/photo", deletePhoto);

router.post("/apply", applyJob);
router.get("/applications", myApplications);

router.post("/resume", saveResume);
router.get("/resume", getResume);

router.get("/companies", getCompanies);

export default router;
