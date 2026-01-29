import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load the .env that lives inside backend/
dotenv.config({ path: path.join(__dirname, "../.env") });



const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Get the admin email from environment variables
const adminEmail = process.env.ADMIN_EMAIL;

/**
 * Sends a notification email to the system administrator.
 * @param {string} subject The subject of the email.
 * @param {string} htmlBody The HTML content of the email.
 */
export const sendNotificationEmail = async (subject, htmlBody) => {
  if (!adminEmail) {
    console.error("ADMIN_EMAIL is not configured in .env file. Cannot send notification email.");
    return;
  }

  const mailOptions = {
    from: `"Unessa Foundation Bot" <${process.env.MAIL_FROM}>`,
    to: adminEmail,
    subject: subject,
    html: htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent successfully to ${adminEmail}.`);
  } catch (error) {
    console.error(`Failed to send notification email to ${adminEmail}:`, error);
  }
};
