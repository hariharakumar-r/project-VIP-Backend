export const generateEmailTemplate = ({ name, otp, zoomLink }) => `
<!doctype html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #007BFF;
    }
    .content {
      margin-bottom: 20px;
    }
    .content p {
      margin: 10px 0;
    }
    .zoom-link {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 15px;
      background-color: #007BFF;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 0.9em;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Our Company</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Your One-Time Password (OTP) is:</p>
      <h2>${otp}</h2>
      <p>Please use this OTP to complete your verification process.</p>
      <p>Additionally, here is your Zoom meeting invite link:</p>
      <a href="${zoomLink}" class="zoom-link">Join Zoom Meeting</a>
    </div>
    <div class="footer">
      <p>Thank you,</p>
      <p>The Company Team</p>
    </div>
  </div>
</body>
</html>
`;

export const generateOtpEmailTemplate = ({ name, otp }) => `
<!doctype html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #007BFF;
    }
    .content {
      margin-bottom: 20px;
    }
    .content p {
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 0.9em;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>OTP Verification</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Your One-Time Password (OTP) is:</p>
      <h2>${otp}</h2>
      <p>Please use this OTP to complete your verification process.</p>
    </div>
    <div class="footer">
      <p>Thank you,</p>
      <p>The Company Team</p>
    </div>
  </div>
</body>
</html>
`;

export const generateInterviewInviteTemplate = ({ 
  applicantName, 
  companyName, 
  jobTitle, 
  interviewDate, 
  interviewTime, 
  duration, 
  zoomJoinUrl, 
  zoomPassword, 
  interviewerName,
  notes 
}) => `
<!doctype html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 650px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    .interview-details {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    .detail-row {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
    }
    .detail-label {
      font-weight: 600;
      color: #495057;
      min-width: 120px;
      margin-right: 15px;
    }
    .detail-value {
      color: #2c3e50;
      flex: 1;
    }
    .zoom-section {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      color: white;
      padding: 25px;
      margin: 25px 0;
      border-radius: 8px;
      text-align: center;
    }
    .zoom-section h3 {
      margin: 0 0 15px 0;
      font-size: 20px;
    }
    .zoom-link {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      margin: 10px 0;
      transition: background-color 0.3s ease;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    .zoom-link:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
    .password-info {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
    }
    .notes-section {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .notes-section h4 {
      margin: 0 0 10px 0;
      color: #856404;
    }
    .preparation-tips {
      background-color: #e8f5e8;
      border: 1px solid #c3e6c3;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .preparation-tips h4 {
      margin: 0 0 15px 0;
      color: #155724;
    }
    .preparation-tips ul {
      margin: 0;
      padding-left: 20px;
    }
    .preparation-tips li {
      margin-bottom: 8px;
      color: #155724;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 25px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 5px 0;
      color: #6c757d;
    }
    .contact-info {
      background-color: #f1f3f4;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      text-align: center;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Interview Invitation</h1>
      <p>You're invited for an interview at ${companyName}</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Dear <strong>${applicantName}</strong>,
      </div>
      
      <p>Congratulations! We are pleased to invite you for an interview for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
      
      <div class="interview-details">
        <h3 style="margin-top: 0; color: #495057;">📅 Interview Details</h3>
        <div class="detail-row">
          <span class="detail-label">📍 Position:</span>
          <span class="detail-value">${jobTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">🏢 Company:</span>
          <span class="detail-value">${companyName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">📅 Date:</span>
          <span class="detail-value">${interviewDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⏰ Time:</span>
          <span class="detail-value">${interviewTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⏱️ Duration:</span>
          <span class="detail-value">${duration} minutes</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">👤 Interviewer:</span>
          <span class="detail-value">${interviewerName}</span>
        </div>
      </div>

      <div class="zoom-section">
        <h3>🎥 Join via Zoom</h3>
        <p>Click the button below to join the interview at the scheduled time:</p>
        <a href="${zoomJoinUrl}" class="zoom-link">Join Zoom Meeting</a>
        
        ${zoomPassword ? `
        <div class="password-info">
          <strong>Meeting Password:</strong> <span class="highlight">${zoomPassword}</span>
        </div>
        ` : ''}
        
        <p style="font-size: 14px; margin-top: 15px; opacity: 0.9;">
          💡 <strong>Tip:</strong> Test your audio and video before the interview
        </p>
      </div>

      ${notes ? `
      <div class="notes-section">
        <h4>📝 Additional Notes</h4>
        <p>${notes}</p>
      </div>
      ` : ''}

      <div class="preparation-tips">
        <h4>🚀 Interview Preparation Tips</h4>
        <ul>
          <li>Test your internet connection and Zoom setup 15 minutes before the interview</li>
          <li>Ensure you're in a quiet, well-lit environment</li>
          <li>Have your resume and any relevant documents ready</li>
          <li>Prepare questions about the role and company</li>
          <li>Join the meeting 2-3 minutes early</li>
        </ul>
      </div>

      <div class="contact-info">
        <p><strong>Need to reschedule or have questions?</strong></p>
        <p>Please contact us as soon as possible.</p>
      </div>

      <p>We look forward to speaking with you and learning more about your qualifications for this position.</p>
    </div>

    <div class="footer">
      <p><strong>Best regards,</strong></p>
      <p><strong>${interviewerName}</strong></p>
      <p>${companyName} - Talent Acquisition Team</p>
      <p style="font-size: 12px; margin-top: 15px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
`;

export const generateInterviewReminderTemplate = ({ 
  applicantName, 
  companyName, 
  jobTitle, 
  interviewDate, 
  interviewTime, 
  zoomJoinUrl, 
  zoomPassword 
}) => `
<!doctype html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      padding: 25px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .reminder-box {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .zoom-link {
      display: inline-block;
      background-color: #2196F3;
      color: white;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      margin: 15px 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Interview Reminder</h1>
    </div>
    
    <div class="content">
      <p>Dear <strong>${applicantName}</strong>,</p>
      
      <div class="reminder-box">
        <h3>🚨 Your interview is coming up!</h3>
        <p><strong>${jobTitle}</strong> at <strong>${companyName}</strong></p>
        <p><strong>📅 ${interviewDate} at ${interviewTime}</strong></p>
      </div>

      <p>This is a friendly reminder about your upcoming interview. Please make sure you're ready to join on time.</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="${zoomJoinUrl}" class="zoom-link">Join Zoom Meeting</a>
        ${zoomPassword ? `<p><strong>Password:</strong> ${zoomPassword}</p>` : ''}
      </div>

      <p>Good luck with your interview!</p>
    </div>

    <div class="footer">
      <p><strong>Best regards,</strong></p>
      <p><strong>${companyName}</strong> Team</p>
    </div>
  </div>
</body>
</html>
`;


export const generateCompanyInterviewTemplate = ({ 
  interviewerName,
  companyName,
  applicantName, 
  applicantEmail,
  jobTitle, 
  interviewDate, 
  interviewTime, 
  duration, 
  zoomStartUrl,
  zoomJoinUrl,
  zoomMeetingId,
  zoomPassword, 
  notes 
}) => `
<!doctype html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 650px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    .interview-details {
      background-color: #f8f9fa;
      border-left: 4px solid #2ecc71;
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    .detail-row {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
    }
    .detail-label {
      font-weight: 600;
      color: #495057;
      min-width: 140px;
      margin-right: 15px;
    }
    .detail-value {
      color: #2c3e50;
      flex: 1;
    }
    .zoom-section {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
      padding: 25px;
      margin: 25px 0;
      border-radius: 8px;
      text-align: center;
    }
    .zoom-section h3 {
      margin: 0 0 15px 0;
      font-size: 20px;
    }
    .start-link {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.95);
      color: #e74c3c;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 700;
      margin: 10px 0;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    .start-link:hover {
      background-color: white;
      transform: scale(1.05);
    }
    .meeting-info {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
      text-align: left;
    }
    .meeting-info p {
      margin: 8px 0;
    }
    .applicant-section {
      background-color: #e8f4fd;
      border: 1px solid #bee5eb;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .applicant-section h4 {
      margin: 0 0 15px 0;
      color: #0c5460;
    }
    .notes-section {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .notes-section h4 {
      margin: 0 0 10px 0;
      color: #856404;
    }
    .tips-section {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .tips-section h4 {
      margin: 0 0 15px 0;
      color: #495057;
    }
    .tips-section ul {
      margin: 0;
      padding-left: 20px;
    }
    .tips-section li {
      margin-bottom: 8px;
      color: #6c757d;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 25px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 5px 0;
      color: #6c757d;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: 600;
    }
    .important-note {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .important-note p {
      margin: 0;
      color: #721c24;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 Interview Scheduled</h1>
      <p>You have a new interview scheduled</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Dear <strong>${interviewerName}</strong>,
      </div>
      
      <p>An interview has been scheduled for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
      
      <div class="applicant-section">
        <h4>👤 Applicant Details</h4>
        <div class="detail-row">
          <span class="detail-label">Name:</span>
          <span class="detail-value"><strong>${applicantName}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${applicantEmail}</span>
        </div>
      </div>

      <div class="interview-details">
        <h3 style="margin-top: 0; color: #495057;">📅 Interview Details</h3>
        <div class="detail-row">
          <span class="detail-label">📍 Position:</span>
          <span class="detail-value">${jobTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">📅 Date:</span>
          <span class="detail-value">${interviewDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⏰ Time:</span>
          <span class="detail-value">${interviewTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⏱️ Duration:</span>
          <span class="detail-value">${duration} minutes</span>
        </div>
      </div>

      <div class="zoom-section">
        <h3>🎥 Start the Interview</h3>
        <p>Click the button below to <strong>START</strong> the meeting as host:</p>
        <a href="${zoomStartUrl}" class="start-link">🚀 START MEETING (Host)</a>
        
        <div class="meeting-info">
          <p><strong>Meeting ID:</strong> ${zoomMeetingId}</p>
          <p><strong>Password:</strong> <span class="highlight">${zoomPassword}</span></p>
          <p><strong>Join URL (for reference):</strong></p>
          <p style="font-size: 12px; word-break: break-all;">${zoomJoinUrl}</p>
        </div>
      </div>

      <div class="important-note">
        <p>⚠️ Use the START MEETING button above to begin the interview as the host.</p>
        <p>The applicant has received the JOIN link separately.</p>
      </div>

      ${notes ? `
      <div class="notes-section">
        <h4>📝 Interview Notes</h4>
        <p>${notes}</p>
      </div>
      ` : ''}

      <div class="tips-section">
        <h4>💡 Interview Tips</h4>
        <ul>
          <li>Start the meeting 2-3 minutes before the scheduled time</li>
          <li>Test your audio and video before the interview</li>
          <li>Have the applicant's resume ready for reference</li>
          <li>Prepare your interview questions in advance</li>
          <li>Ensure you're in a quiet, professional environment</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>Best regards,</strong></p>
      <p>Job Portal - Interview Management System</p>
      <p style="font-size: 12px; margin-top: 15px;">
        This is an automated message from the Job Portal system.
      </p>
    </div>
  </div>
</body>
</html>
`;

export const generateWebhookInterviewTemplate = ({ 
  recipientName,
  recipientRole,
  meetingTitle,
  meetingDescription,
  jobTitle,
  companyEmail,
  applicantName,
  applicantEmail,
  interviewDate, 
  interviewTime, 
  duration, 
  zoomMeetingId,
  zoomPassword,
  zoomJoinUrl,
  zoomStartUrl,
  notes,
  canStartMeeting = false
}) => `
<!doctype html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 650px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: ${recipientRole === 'Admin' ? 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' : 
                   recipientRole === 'Company Representative' ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' : 
                   'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'};
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .role-badge {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.2);
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 10px;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    .meeting-details {
      background-color: #f8f9fa;
      border-left: 4px solid ${recipientRole === 'Admin' ? '#9b59b6' : 
                                recipientRole === 'Company Representative' ? '#2ecc71' : '#3498db'};
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    .detail-row {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
    }
    .detail-label {
      font-weight: 600;
      color: #495057;
      min-width: 140px;
      margin-right: 15px;
    }
    .detail-value {
      color: #2c3e50;
      flex: 1;
    }
    .zoom-section {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
      padding: 25px;
      margin: 25px 0;
      border-radius: 8px;
      text-align: center;
    }
    .zoom-section h3 {
      margin: 0 0 15px 0;
      font-size: 20px;
    }
    .zoom-button {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.95);
      color: #e74c3c;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 700;
      margin: 10px 5px;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    .zoom-button:hover {
      background-color: white;
      transform: scale(1.05);
    }
    .meeting-info {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
      text-align: left;
    }
    .meeting-info p {
      margin: 8px 0;
    }
    .participants-section {
      background-color: #e8f4fd;
      border: 1px solid #bee5eb;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .participants-section h4 {
      margin: 0 0 15px 0;
      color: #0c5460;
    }
    .participant {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #dee2e6;
    }
    .participant:last-child {
      border-bottom: none;
    }
    .notes-section {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .notes-section h4 {
      margin: 0 0 10px 0;
      color: #856404;
    }
    .important-note {
      background-color: ${canStartMeeting ? '#d4edda' : '#f8d7da'};
      border: 1px solid ${canStartMeeting ? '#c3e6cb' : '#f5c6cb'};
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .important-note p {
      margin: 0;
      color: ${canStartMeeting ? '#155724' : '#721c24'};
      font-weight: 600;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 25px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 5px 0;
      color: #6c757d;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: 600;
    }
    .webhook-badge {
      background-color: #17a2b8;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Interview Scheduled</h1>
      <p>Webhook-based meeting coordination</p>
      <div class="role-badge">${recipientRole}</div>
    </div>
    
    <div class="content">
      <div class="greeting">
        Dear <strong>${recipientName}</strong>,
      </div>
      
      <p>An interview has been scheduled via our webhook system. All participants will receive meeting details.</p>
      
      <div class="participants-section">
        <h4>👥 Meeting Participants</h4>
        <div class="participant">
          <span><strong>Admin:</strong> dummydumdum005@gmail.com</span>
          <span class="webhook-badge">Can Start</span>
        </div>
        <div class="participant">
          <span><strong>Company:</strong> ${companyEmail}</span>
          <span class="webhook-badge">Can Start</span>
        </div>
        <div class="participant">
          <span><strong>Applicant:</strong> ${applicantName} (${applicantEmail})</span>
          <span class="webhook-badge">Participant</span>
        </div>
      </div>

      <div class="meeting-details">
        <h3 style="margin-top: 0; color: #495057;">📅 Meeting Details</h3>
        <div class="detail-row">
          <span class="detail-label">📍 Position:</span>
          <span class="detail-value">${jobTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">👤 Candidate:</span>
          <span class="detail-value">${applicantName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">📅 Date:</span>
          <span class="detail-value">${interviewDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⏰ Time:</span>
          <span class="detail-value">${interviewTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⏱️ Duration:</span>
          <span class="detail-value">${duration} minutes</span>
        </div>
      </div>

      <div class="zoom-section">
        <h3>🎥 Zoom Meeting Access</h3>
        <p>Meeting can be started by Admin or Company Representative</p>
        
        ${canStartMeeting ? `
        <a href="${zoomStartUrl}" class="zoom-button">🚀 START MEETING</a>
        ` : ''}
        
        <a href="${zoomJoinUrl}" class="zoom-button">📹 JOIN MEETING</a>
        
        <div class="meeting-info">
          <p><strong>Meeting ID:</strong> ${zoomMeetingId}</p>
          <p><strong>Password:</strong> <span class="highlight">${zoomPassword}</span></p>
          <p><strong>Direct Join URL:</strong></p>
          <p style="font-size: 12px; word-break: break-all;">${zoomJoinUrl}</p>
        </div>
      </div>

      <div class="important-note">
        ${canStartMeeting ? `
        <p>✅ You can START this meeting as ${recipientRole}</p>
        <p>The meeting can begin without admin presence</p>
        ` : `
        <p>📋 You will join as a participant</p>
        <p>Admin or Company can start the meeting</p>
        `}
      </div>

      ${notes ? `
      <div class="notes-section">
        <h4>📝 Additional Notes</h4>
        <p>${notes}</p>
      </div>
      ` : ''}

      ${meetingDescription ? `
      <div class="notes-section">
        <h4>📋 Meeting Description</h4>
        <p>${meetingDescription}</p>
      </div>
      ` : ''}

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #495057;">💡 Meeting Guidelines</h4>
        <ul style="margin: 0; padding-left: 20px; color: #6c757d;">
          <li>All three participants (Admin, Company, Applicant) are included</li>
          <li>Meeting can start without admin - Company can host</li>
          <li>Join 2-3 minutes before scheduled time</li>
          <li>Test your audio/video beforehand</li>
          <li>Have relevant documents ready</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>Best regards,</strong></p>
      <p>Job Portal - Webhook Interview System</p>
      <p style="font-size: 12px; margin-top: 15px;">
        This meeting was scheduled via webhook. All participants have been notified.
      </p>
    </div>
  </div>
</body>
</html>
`;