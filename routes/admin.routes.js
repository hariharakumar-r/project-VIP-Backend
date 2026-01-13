import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import {
  // Profile
  getProfile,
  updateProfile,
  // Job Posts
  createJobPost,
  getJobPosts,
  getJobById,
  updateJobPost,
  deleteJobPost,
  addPromotionalJob,
  getPromoRequests,
  // Users
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  // Posts Moderation
  moderatePost,
  getPendingPosts,
  // Company Routes
  myPosts,
  // Promotion Requests
  submitPromotionRequest,
  getPromotionRequests,
  updatePromotionRequest
} from "../controllers/admin.controller.js";

const router = express.Router();

// Profile Routes
router.get("/profile", auth, role(["SUPER_ADMIN"]), getProfile);
router.patch("/profile", auth, role(["SUPER_ADMIN"]), updateProfile);

// Job Posts Routes
router.post("/job", auth, role(["SUPER_ADMIN"]), createJobPost);
router.get("/jobs", auth, role(["SUPER_ADMIN"]), getJobPosts);
router.get("/job/:id", auth, role(["SUPER_ADMIN"]), getJobById);
router.patch("/job/:id", auth, role(["SUPER_ADMIN"]), updateJobPost);
router.delete("/job/:id", auth, role(["SUPER_ADMIN"]), deleteJobPost);
router.post("/promo-job", auth, role(["SUPER_ADMIN"]), addPromotionalJob);
router.get("/promo-requests", auth, role(["SUPER_ADMIN"]), getPromoRequests);

// Users Routes
router.get("/users", auth, role(["SUPER_ADMIN"]), getUsers);
router.get("/user/:id", auth, role(["SUPER_ADMIN"]), getUserById);
router.patch("/user/:id", auth, role(["SUPER_ADMIN"]), updateUser);
router.delete("/user/:id", auth, role(["SUPER_ADMIN"]), deleteUser);
router.patch("/block-user/:id", auth, role(["SUPER_ADMIN"]), blockUser);
router.patch("/unblock-user/:id", auth, role(["SUPER_ADMIN"]), unblockUser);

// Posts Moderation Routes
router.get("/pending-posts", auth, role(["SUPER_ADMIN"]), getPendingPosts);
router.patch("/moderate-post", auth, role(["SUPER_ADMIN"]), moderatePost);

// Promotion Request Routes
router.post("/promo-request", auth, submitPromotionRequest);
router.get("/promo-requests", auth, role(["SUPER_ADMIN"]), getPromotionRequests);
router.patch("/promo-request/:requestId", auth, role(["SUPER_ADMIN"]), updatePromotionRequest);

router.get("/my-posts", auth, role(["SUPER_ADMIN"]), myPosts);

export default router;
