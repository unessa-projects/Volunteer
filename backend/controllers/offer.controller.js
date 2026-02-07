import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import playwright from "playwright";
import User from "../models/User.js";
import nodemailer from "nodemailer";
// import sgMail from "@sendgrid/mail";
import { sendEmail } from "../services/emailService.js";
     


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- START: NEW HELPER FUNCTION ---
// This function reads an image file and converts it to a Base64 string
const imageToBase64 = (filePath) => {
  try {
    const file = fs.readFileSync(filePath);
    const mimeType =
      path.extname(filePath) === ".png" ? "image/png" : "image/jpeg";
    return `data:${mimeType};base64,${Buffer.from(file).toString("base64")}`;
  } catch (error) {
    console.error(`Error reading image file at ${filePath}:`, error);
    return ""; // Return an empty string if an image can't be found
  }
};
// --- END: NEW HELPER FUNCTION ---

export const generateAndSendOffer = async (req, res) => {
  let browser;

  try {
    const { userId, email, name } = req.body;

    // Validate required fields
    if (!userId || !email || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch full user from DB
    const user = await User.findById(userId || req.body._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Generating offer for:", { userId, name, email });

    const date = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // 1️⃣ Load HTML template
    const templatePath = path.join(__dirname, "../templates/offer.html");
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({ message: "Offer template not found" });
    }

    const offerContent = fs.readFileSync(templatePath, "utf8");

    // --- START: MODIFIED HTML PROCESSING ---
    // Define paths to the images in your 'public' folder
    const logoPath = path.join(__dirname, "../public/logo.png");
    const signaturePath = path.join(__dirname, "../public/image001.png");
    const footerPath = path.join(__dirname, "../public/footer.png");

    // Convert the images to Base64
    const logoBase64 = imageToBase64(logoPath);
    const signatureBase64 = imageToBase64(signaturePath);
    const footerBase64 = imageToBase64(footerPath);

    // Replace the old URLs in the HTML with the new Base64 data
    const processedHtml = offerContent
      .replace(/{{name}}/g, name)
      .replace(/{{date}}/g, date)
      .replace("https://api.donate.unessafoundation.org/logo.png", logoBase64)
      .replace(
        "https://api.donate.unessafoundation.org/image001.png",
        signatureBase64
      )
      .replace(
        "https://api.donate.unessafoundation.org/footer.png",
        footerBase64
      );
    // --- END: MODIFIED HTML PROCESSING ---

    // 2️⃣ Generate PDF using Playwright
    browser = await playwright.chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Add these args for stability
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Set content with more lenient options
    try {
      await page.setContent(processedHtml, {
        waitUntil: "domcontentloaded", // Changed from networkidle
        timeout: 60000, // Increased timeout
      });
    } catch (err) {
      console.error("Error setting HTML content:", err);
      // Try without waitUntil as fallback
      await page.setContent(processedHtml);
    }

    let pdfBuffer;
    try {
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
        timeout: 60000, // Add timeout to PDF generation too
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      return res
        .status(500)
        .json({ message: "PDF generation failed", error: err.message });
    }

    // // 3️⃣ Send email using SendGrid (primary method)
    // if (!process.env.SENDGRID_API_KEY || !process.env.MAIL_FROM) {
    //   return res.status(500).json({
    //     success: false,
    //     message: "SendGrid API Key or MAIL_FROM not configured",
    //   });
    // }

    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   const transporter = nodemailer.createTransport({
  host: process.env.ZEPTO_SMTP_HOST,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.ZEPTO_SMTP_USER,
    pass: process.env.ZEPTO_SMTP_PASS,
  },
});
    const msg = {
      to: email,
      from: {
        // email: process.env.ZEPTO_MAIL_FROM, // must be verified in SendGrid
        address: process.env.ZEPTO_MAIL_FROM, // must be verified in SendGrid
        name: "HR Team",
      },
      subject: `Your Offer Letter - ${name}`,
      text: `Dear ${name},\n\nPlease find your official offer letter attached.\n\nBest regards,\nHR Team`,
      html: `<p>Dear ${name},</p>
             <p>😄 Congratulations! Please find your official offer letter attached.</p>
             <p>Best regards,<br/>HR Team</p>`,
      attachments: [
        {
          filename: `Offer_Letter_${name.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer.toString("base64"),
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    };

    // await sgMail.send(msg);
    // console.log(":e-mail: Offer letter sent successfully to:", email);
await sendEmail({
      to: email,
      subject: `Your Completion Certificate - ${name}`,
      text: `Dear ${name},\n\nCongratulations! 🎉\nPlease find attached your official internship completion certificate.\n\nBest regards,\nUnessa Foundation`,
      html: `<p>Dear ${name},</p>
             <p>🎉 Congratulations on completing your internship!</p>
             <p>Please find your official Offer letter attached.</p>
             <p>Best regards,<br/>Unessa Foundation</p>`,
      attachments: [
        {
          filename: `Certificate_${name.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer, // Nodemailer handles Buffers directly
          contentType: "application/pdf",
        },
      ],
    });

    // ✅ Update user flag
    await User.findOneAndUpdate({ email }, { certificateSent: true });

    res.status(200).json({
      success: true,
      message: "Offer generated and sent successfully",
    });

  } catch (error) {
    console.error("❌ Error in generateAndSendCertificate:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate and send certificate",
      error: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};