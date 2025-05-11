import { configDotenv } from "dotenv";
import transporter from "../config/nodemailer.config.js";

configDotenv();
const sendLoginNotification = async (email, ipAddress, browser) => {
  await transporter.sendMail({
    from: process.env._SMTP_USERNAME,
    to: email,
    subject: "Login Activity Notification - CodeVerse — A Developer's Diary",
    html: `
   <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Login Activity Notification - CodeVerse — A Developer's Diary</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 20px; text-align: left;">
                <h2 style="color: #333333; margin-top: 0;">New Device Login Detected</h2>
                <p style="color: #555555;">Hi there,</p>
                <p style="color: #555555;">We noticed a new login to your account.</p>

                <table cellpadding="0" cellspacing="0" width="100%" style="margin-top: 15px; margin-bottom: 15px;">
                  <tr>
                    <td style="color: #333333; font-weight: bold;">IP Address:</td>
                    <td style="color: #555555;">${ipAddress}</td>
                  </tr>
                  <tr>
                    <td style="color: #333333; font-weight: bold;">Browser:</td>
                    <td style="color: #555555;">${browser}</td>
                  </tr>
                </table>

                <p style="color: #555555;">If this wasn't you, please secure your account immediately.</p>
                <p style="color: #999999; font-size: 12px;">This is an automated message. Please do not reply.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>


`,
  });
};

export default sendLoginNotification;
