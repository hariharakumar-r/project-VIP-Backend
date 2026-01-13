import jwt from "jsonwebtoken";

/**
 * WEBHOOK-BASED SOLUTION
 * 
 * This file is kept for reference/future use.
 * The current implementation uses webhook-based meeting scheduling
 * which generates mock Zoom meeting details without requiring OAuth.
 * 
 * See: backend/controllers/webhook.controller.js
 * See: backend/routes/webhook.routes.js
 */

/**
 * Generate Meeting SDK JWT signature for frontend (if needed in future)
 */
export const generateMeetingSDKJWT = ({ meetingNumber, role = 0 }) => {
  if (!process.env.ZOOM_SDK_KEY || !process.env.ZOOM_SDK_SECRET) {
    console.warn("⚠️ ZOOM_SDK_KEY or ZOOM_SDK_SECRET not set - SDK JWT generation will fail");
    return null;
  }

  const payload = {
    iss: process.env.ZOOM_SDK_KEY,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2), // 2 hours
    aud: "zoom",
    appKey: process.env.ZOOM_SDK_KEY,
    tokenExp: Math.floor(Date.now() / 1000) + (60 * 60 * 2),
    alg: "HS256"
  };

  return jwt.sign(payload, process.env.ZOOM_SDK_SECRET);
};

/**
 * DEPRECATED: OAuth-based Zoom API functions
 * 
 * These functions were used for Server-to-Server OAuth integration.
 * They are no longer used in the webhook solution.
 * 
 * If you want to implement real Zoom API integration in the future,
 * uncomment and use these functions.
 * 
 * Required .env variables:
 * - ZOOM_CLIENT_ID
 * - ZOOM_CLIENT_SECRET
 */

/*
// Uncomment below if implementing real Zoom API integration

import axios from "axios";

let cachedToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    console.log("Requesting Zoom access token...");
    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "client_credentials",
        client_id: process.env.ZOOM_CLIENT_ID,
        client_secret: process.env.ZOOM_CLIENT_SECRET,
      },
    });

    cachedToken = response.data.access_token;
    tokenExpiry = now + (response.data.expires_in - 60) * 1000;
    console.log("✓ Zoom access token obtained successfully");
    return cachedToken;
  } catch (err) {
    console.error("Zoom OAuth Error:", err.response?.data || err.message);
    throw new Error("Failed to get Zoom access token: " + (err.response?.data?.error || err.message));
  }
};

export const createZoomMeeting = async ({ topic, startTime, duration = 30, timezone = "Asia/Kolkata", ... }) => {
  // Implementation here
};

export const updateZoomMeeting = async (meetingId, updateData) => {
  // Implementation here
};

export const deleteZoomMeeting = async (meetingId) => {
  // Implementation here
};

export const getZoomMeeting = async (meetingId) => {
  // Implementation here
};
*/
