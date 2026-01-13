import { sendZoomInviteEmail } from "./services/emailService.js";
import { generateOTP } from "./utils/otp.js";

// Test the email system
const testEmail = async () => {
  try {
    const testData = {
      to: "test@example.com", // Replace with your email for testing
      name: "Test User",
      otp: generateOTP(),
      zoomLink: "https://zoom.us/j/1234567890?pwd=example"
    };

    console.log("Sending test email with data:", testData);
    await sendZoomInviteEmail(testData);
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

testEmail();