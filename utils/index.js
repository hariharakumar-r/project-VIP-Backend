import { sendZoomInviteEmail } from "../services/emailService.js";

const recipient = {
  to: "applicant@example.com",
  name: "John Doe",
  otp: "123456",
  zoomLink: "https://zoom.us/j/1234567890?pwd=example",
};

sendZoomInviteEmail(recipient)
  .then(() => console.log("Email sent successfully"))
  .catch((err) => console.error("Failed to send email:", err));