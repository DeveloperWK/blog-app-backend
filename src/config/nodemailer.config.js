import nodemailer from "nodemailer";
import {configDotenv} from "dotenv";

configDotenv();
const transporter = nodemailer.createTransport({
    service: 'smtp',
    auth: {
        user: process.env._SMTP_USERNAME,
        pass: process.env._SMTP_PASSWORD,
    },
    host: process.env._SMTP_HOST,
    port: Number(process.env._SMTP_PORT),
    secure: process.env._SMTP_SECURE === 'true',
});
export default transporter;