import transporter from "../config/nodemailer.config.js";
import {configDotenv} from "dotenv";

configDotenv();
const userWelcomeMail = async (email, name) => {
    const date = new Date().getFullYear()
    await transporter.sendMail({
        from: process.env._SMTP_USERNAME,
        to: email,
        subject: 'Welcome to Our Blog Platform',
        html: `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our Blog</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    h1 {
      color: #333333;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #555555;
      line-height: 1.6;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999999;
      margin-top: 20px;
    }
    @media (max-width: 600px) {
      .container {
        margin: 10px;
        padding: 20px;
      }
      h1 {
        font-size: 20px;
      }
      p {
        font-size: 14px;
      }
      .button {
        font-size: 14px;
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>Welcome to [Your Blog Name]!</h1>
    <p>Hi ${name},</p>
    <p>We're thrilled to have you join our community! 🎉 <br>
    Dive into amazing articles, share your thoughts, and be part of a growing family of passionate readers and writers.</p>
    <p>If you ever have any questions, feel free to reach out. We're here for you!</p>
    <a href="[Your Website URL]" class="button">Visit Our Blog</a>
    <div class="footer">
      &copy; ${date} [Your Blog Name]. All rights reserved.
    </div>
  </div>

</body>
</html>
`,
    });

}
export default userWelcomeMail;