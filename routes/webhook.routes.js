import express from "express";
import { scheduleInterviewWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// Webhook endpoint for scheduling interviews
router.post("/schedule-interview", scheduleInterviewWebhook);

export default router;