import nodemailer from "nodemailer";
import { generateOtpEmailTemplate } from "./emailTemplates.js";

export const sendMail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent, // Use HTML content for the email body
  });
};

export const sendOtpVerificationEmail = async ({ to, name, otp }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Replace with your email service
    auth: {
      user: process.env.EMAIL_USER, // Replace with your email
      pass: process.env.EMAIL_PASS, // Replace with your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Replace with your email
    to,
    subject: 'Your OTP Verification Code',
    html: generateOtpEmailTemplate({ name, otp }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP verification email sent successfully.');
  } catch (error) {
    console.error('Error sending OTP verification email:', error);
  }
};