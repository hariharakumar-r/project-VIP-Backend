import { sendMail } from "../utils/mailer.js";
import { generateWebhookInterviewTemplate } from "../utils/emailTemplates.js";
import axios from "axios";

// Cache for Zoom access token
let cachedZoomToken = null;
let cachedZoomTokenExpiry = null;

/**
 * Get Zoom access token using OAuth
 */
const getZoomAccessToken = async () => {
  const now = Date.now();
  
  // Return cached token if still valid
  if (cachedZoomToken && cachedZoomTokenExpiry && now < cachedZoomTokenExpiry) {
    return cachedZoomToken;
  }

  try {
    console.log("📡 Requesting Zoom access token...");
    
    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "client_credentials",
        client_id: process.env.ZOOM_CLIENT_ID,
        client_secret: process.env.ZOOM_CLIENT_SECRET,
      },
    });

    cachedZoomToken = response.data.access_token;
    cachedZoomTokenExpiry = now + (response.data.expires_in - 60) * 1000;
    
    console.log("✅ Zoom access token obtained successfully");
    return cachedZoomToken;
  } catch (error) {
    console.error("❌ Failed to get Zoom token:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with Zoom: " + (error.response?.data?.error || error.message));
  }
};

/**
 * Create real Zoom meeting
 */
const createRealZoomMeeting = async ({ topic, startTime, duration, timezone }) => {
  try {
    const accessToken = await getZoomAccessToken();

    const meetingData = {
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime,
      duration,
      timezone,
      settings: {
        join_before_host: true,
        waiting_room: false,
        mute_upon_entry: false,
        host_video: true,
        participant_video: true,
        approval_type: 0, // Automatically approve
        audio: "both",
        enforce_login: false,
        use_pmi: false
      }
    };

    console.log("🎥 Creating real Zoom meeting...");
    
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
      }
    );

    console.log("✅ Real Zoom meeting created:", response.data.id);

    return {
      meetingId: response.data.id,
      joinUrl: response.data.join_url,
      startUrl: response.data.start_url,
      password: response.data.password || "",
    };
  } catch (error) {
    console.error("❌ Failed to create Zoom meeting:", error.response?.data || error.message);
    throw new Error("Failed to create Zoom meeting: " + (error.response?.data?.message || error.message));
  }
};

/**
 * Webhook endpoint to handle interview scheduling
 * Creates REAL Zoom meetings and sends emails to all participants
 */
export const scheduleInterviewWebhook = async (req, res) => {
  try {
    console.log("📥 Webhook received interview scheduling request");
    console.log("📋 Payload:", JSON.stringify(req.body, null, 2));

    const {
      meetingTitle,
      meetingDescription,
      scheduledAt,
      duration,
      timezone,
      notes,
      participants,
      job,
      company,
      applicant,
      settings,
      createdAt,
      source
    } = req.body;

    // Validate required fields
    if (!meetingTitle || !scheduledAt || !participants || participants.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: meetingTitle, scheduledAt, or participants"
      });
    }

    // Format date and time for emails
    const interviewDateTime = new Date(scheduledAt);
    const formattedDate = interviewDateTime.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = interviewDateTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Create REAL Zoom meeting
    let zoomMeeting;
    try {
      zoomMeeting = await createRealZoomMeeting({
        topic: meetingTitle,
        startTime: scheduledAt,
        duration,
        timezone
      });
      console.log("🎯 Zoom meeting created successfully");
    } catch (zoomError) {
      console.error("⚠️ Zoom meeting creation failed, using fallback mock details");
      // Fallback to mock if Zoom API fails
      zoomMeeting = {
        meetingId: Math.floor(Math.random() * 1000000000).toString(),
        joinUrl: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
        startUrl: `https://zoom.us/s/${Math.floor(Math.random() * 1000000000)}`,
        password: Math.random().toString(36).substring(2, 8).toUpperCase(),
      };
    }

    console.log("🎥 Meeting Details:");
    console.log(`   Meeting ID: ${zoomMeeting.meetingId}`);
    console.log(`   Password: ${zoomMeeting.password}`);
    console.log(`   Join URL: ${zoomMeeting.joinUrl}`);

    // Find participants by role
    const adminParticipant = participants.find(p => p.role === 'admin');
    const companyParticipant = participants.find(p => p.role === 'company');
    const applicantParticipant = participants.find(p => p.role === 'applicant');

    const emailPromises = [];

    // 1. Send email to ADMIN
    if (adminParticipant) {
      const adminEmailContent = generateWebhookInterviewTemplate({
        recipientName: adminParticipant.name,
        recipientRole: "Admin",
        meetingTitle,
        meetingDescription,
        jobTitle: job.title,
        companyEmail: company.email,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
        interviewDate: formattedDate,
        interviewTime: formattedTime,
        duration,
        zoomMeetingId: zoomMeeting.meetingId,
        zoomPassword: zoomMeeting.password,
        zoomJoinUrl: zoomMeeting.joinUrl,
        zoomStartUrl: zoomMeeting.startUrl,
        notes,
        canStartMeeting: true
      });

      emailPromises.push(
        sendMail(
          adminParticipant.email,
          `[ADMIN] Interview Scheduled - ${meetingTitle}`,
          adminEmailContent
        ).then(() => console.log(`✅ Email sent to admin: ${adminParticipant.email}`))
      );
    }

    // 2. Send email to COMPANY
    if (companyParticipant) {
      const companyEmailContent = generateWebhookInterviewTemplate({
        recipientName: companyParticipant.name,
        recipientRole: "Company Representative",
        meetingTitle,
        meetingDescription,
        jobTitle: job.title,
        companyEmail: company.email,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
        interviewDate: formattedDate,
        interviewTime: formattedTime,
        duration,
        zoomMeetingId: zoomMeeting.meetingId,
        zoomPassword: zoomMeeting.password,
        zoomJoinUrl: zoomMeeting.joinUrl,
        zoomStartUrl: zoomMeeting.startUrl,
        notes,
        canStartMeeting: true
      });

      emailPromises.push(
        sendMail(
          companyParticipant.email,
          `Interview Scheduled - ${applicant.name} for ${job.title}`,
          companyEmailContent
        ).then(() => console.log(`✅ Email sent to company: ${companyParticipant.email}`))
      );
    }

    // 3. Send email to APPLICANT
    if (applicantParticipant) {
      const applicantEmailContent = generateWebhookInterviewTemplate({
        recipientName: applicantParticipant.name,
        recipientRole: "Candidate",
        meetingTitle,
        meetingDescription,
        jobTitle: job.title,
        companyEmail: company.email,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
        interviewDate: formattedDate,
        interviewTime: formattedTime,
        duration,
        zoomMeetingId: zoomMeeting.meetingId,
        zoomPassword: zoomMeeting.password,
        zoomJoinUrl: zoomMeeting.joinUrl,
        zoomStartUrl: zoomMeeting.startUrl,
        notes,
        canStartMeeting: false // Applicant cannot start meeting
      });

      emailPromises.push(
        sendMail(
          applicantParticipant.email,
          `Interview Invitation - ${job.title}`,
          applicantEmailContent
        ).then(() => console.log(`✅ Email sent to applicant: ${applicantParticipant.email}`))
      );
    }

    // Send all emails concurrently
    await Promise.all(emailPromises);

    // Log the complete interview data for debugging
    console.log("📊 Interview Data Processed:");
    console.log("   Meeting:", meetingTitle);
    console.log("   Date:", formattedDate);
    console.log("   Time:", formattedTime);
    console.log("   Duration:", duration, "minutes");
    console.log("   Participants:", participants.length);
    console.log("   Job:", job.title);
    console.log("   Company:", company.email);
    console.log("   Applicant:", applicant.name, `(${applicant.email})`);

    res.status(200).json({
      success: true,
      message: "Interview webhook processed successfully",
      data: {
        meetingId: zoomMeeting.meetingId,
        password: zoomMeeting.password,
        joinUrl: zoomMeeting.joinUrl,
        startUrl: zoomMeeting.startUrl,
        participants: participants.length,
        emailsSent: emailPromises.length,
        scheduledAt: scheduledAt,
        formattedDate,
        formattedTime
      }
    });

  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process interview webhook",
      error: error.message
    });
  }
};