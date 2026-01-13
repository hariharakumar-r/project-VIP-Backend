import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import { createJob, getJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.get("/",auth, role(["APPLICANT", "COMPANY", "SUPER_ADMIN"]),getJobs);
router.post("/", auth, role(["COMPANY", "SUPER_ADMIN"]), createJob);

export default router;
