import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import playwright from "playwright";
import User from "../models/User.js";
import nodemailer from "nodemailer";

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

// Check certificate status
export const getCertificateStatus = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      certificateSent: user.CertificateSent,
    });
  } catch (error) {
    console.error(":x: Error in getCertificateStatus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check certificate status",
      error: error.message,
    });
  }
};

export const generateAndSendCertificate = async (req, res) => {
  let browser;

  try {
    const { email, name } = req.body;
    
    // Validate required fields
    if (!email || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // :white_check_mark: Fetch user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format function for pretty dates
    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    const startDate = user.generatedAt || new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);
    const issueDate = new Date();

    const templatePath = path.join(__dirname, "../templates/certificate.html");
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({ message: "Certificate template not found" });
    }

    const certContent = fs.readFileSync(templatePath, "utf8");

    // Convert images to Base64
    const logoPath = path.join(__dirname, "../public/logo.png");
    const signaturePath = path.join(__dirname, "../public/image001.png");
    const footerPath = path.join(__dirname, "../public/footer.png");

    const logoBase64 = imageToBase64(logoPath);
    const signatureBase64 = imageToBase64(signaturePath);
    const footerBase64 = imageToBase64(footerPath);

    // Replace placeholders
    let processedHtml = certContent
      .replace(/{{name}}/g, name)
      .replace(/{{date}}/g, formatDate(issueDate))
      .replace(/{{startDate}}/g, formatDate(startDate))
      .replace(/{{endDate}}/g, formatDate(endDate))
      .replace(/{{logo}}/g, logoBase64)
      .replace(/{{signature}}/g, signatureBase64)
      .replace(/{{footer}}/g, footerBase64);

    // Generate PDF
    browser = await playwright.chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.setContent(processedHtml, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    } catch (err) {
      console.error("Error setting HTML content:", err);
      await page.setContent(processedHtml);
    }

    let pdfBuffer;
    try {
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
        timeout: 60000,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      return res.status(500).json({ 
        message: "PDF generation failed", 
        error: err.message 
      });
    }

    // :three: Send email using ZeptoMail
    if (!process.env.ZEPTO_SMTP_PASS || !process.env.ZEPTO_MAIL_FROM) {
      return res.status(500).json({
        success: false,
        message: "ZeptoMail credentials not configured",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.ZEPTO_SMTP_HOST || "smtp.zeptomail.in",
      port: parseInt(process.env.ZEPTO_SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.ZEPTO_SMTP_USER || "emailapikey",
        pass: process.env.ZEPTO_SMTP_PASS,
      },
    });

    const msg = {
      to: email,
      from: {
        address: process.env.ZEPTO_MAIL_FROM,
        name: "Unessa Foundation",
      },
      subject: `Your Completion Certificate - ${name}`,
      text: `Dear ${name},\n\nCongratulations! 🎉\nPlease find attached your official internship completion certificate.\n\nBest regards,\nUnessa Foundation`,
      html: `<p>Dear ${name},</p>
             <p>🎉 Congratulations on completing your internship!</p>
             <p>Please find your official completion certificate attached.</p>
             <p>Best regards,<br/>Unessa Foundation</p>`,
      attachments: [
        {
          content: pdfBuffer,
          filename: `Certificate_${name.replace(/\s+/g, "_")}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    try {
      await transporter.sendMail(msg);
      console.log("✅ Certificate sent successfully to:", email);
      
      // :white_check_mark: Update user flag
      await User.findOneAndUpdate({ email }, { certificateSent: true });
      
      res.status(200).json({
        success: true,
        message: "Certificate generated and sent successfully",
      });
    } catch (mailError) {
      console.error("❌ Email failed:", mailError.message);
      res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: mailError.message,
      });
    }
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