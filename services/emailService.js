import { sendMail } from "../utils/mailer.js";
import { generateEmailTemplate } from "../utils/emailTemplates.js";

export const sendZoomInviteEmail = async ({ to, name, otp, zoomLink }) => {
  const subject = "Your Zoom Meeting Invite and OTP";
  const htmlContent = generateEmailTemplate({ name, otp, zoomLink });

  await sendMail(to, subject, htmlContent);
};