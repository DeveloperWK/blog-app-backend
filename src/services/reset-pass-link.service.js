import { configDotenv } from "dotenv";
import transporter from "../config/nodemailer.config.js";

configDotenv();
const resetPassLink = async (email, token) => {
  const link = `${process.env._CLIENT_URL}/auth/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env._SMTP_USERNAME,
    to: email,
    subject: "Password Reset Link",
    html: `
      <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Password Reset</title>

  <style>
    /* Reset styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: #f4f7fa;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333333;
      line-height: 1.6;
    }

    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .header {
      background-color: #4a90e2;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }

    .header h1 {
      font-size: 24px;
      margin: 0;
    }

    .content {
      padding: 30px 25px;
    }

    .content p {
      font-size: 16px;
    }

    .reset-button {
      display: inline-block;
      margin-top: 25px;
      padding: 14px 28px;
      background-color: #4a90e2;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
    }

    .button-wrapper {
      text-align: center;
      margin-top: 25px;
      margin-bottom: 25px;
    }

    .footer {
      background-color: #f1f5f9;
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #777777;
    }

    .footer a {
      color: #4a90e2;
      text-decoration: none;
    }

    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        margin: 20px auto;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header Section -->
    <section class="header">
      <h1>Reset Your Password</h1>
    </section>

    <!-- Content Section -->
    <section class="content">
      <p>Hi there,</p>
      <p>We received a request to reset the password for your account on <strong>CodeVerse — A Developer's Diary</strong>. If you made this request, please click the button below to reset your password:</p>

      <!-- Button Wrapper for Centering -->
      <div class="button-wrapper">
        <a href="${link}" class="reset-button" target="_blank">Reset Password</a>
      </div>

      <p>This link will expire in 10 minutes for security reasons. If you did not request a password reset, please ignore this email or contact support if you suspect any misuse.</p>
    </section>

    <!-- Footer Section -->
    <footer class="footer">
      Need help? Contact us at <a href="mailto:support@codeverse.dev">support@codeverse.dev</a><br/>
      &copy; 2025 CodeVerse — A Developer's Diary, All rights reserved.
    </footer>
  </div>
</body>
</html>

`,
  });
};

export default resetPassLink;
