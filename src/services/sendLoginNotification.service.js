import transporter from "../config/nodemailer.config.js";
import {configDotenv} from "dotenv";

configDotenv();
const sendLoginNotification = async (email, ipAddress, deviceInfo, browser) => {
    await transporter.sendMail({
        from: process.env._SMTP_USERNAME,
        to: email,
        subject: 'Login Activity Notification',
        html: `
   <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Login Activity Notification</title>
  </head>
  <body>
  <p>Hi there,</p>
   <h2>New Device Login Detected</h2>
    <p><b>IP Address:</b> ${ipAddress}</p>
    <p><b>Device:</b> ${deviceInfo}</p>
    <p><b>Browser</b> ${browser}</p>
    <p>If this wasn't you, please secure your account immediately.</p>
</body>

`,
    });
};

export default sendLoginNotification;
