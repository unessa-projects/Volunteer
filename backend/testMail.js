import "dotenv/config";
import nodemailer from "nodemailer";

async function testMail() {
  try {
    // 🔍 sanity check
    console.log("SMTP USER:", process.env.ZEPTO_SMTP_USER);
    console.log("SMTP PASS:", process.env.ZEPTO_SMTP_PASS ? "LOADED" : "MISSING");
    console.log("FROM:", process.env.ZEPTO_MAIL_FROM);

    const transporter = nodemailer.createTransport({
      host: process.env.ZEPTO_SMTP_HOST, // smtp.zeptomail.in
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.ZEPTO_SMTP_USER, // emailapikey
        pass: process.env.ZEPTO_SMTP_PASS, // LIVE key
      },
    });

    const info = await transporter.sendMail({
      from: `"UNESSA Foundation" <${process.env.ZEPTO_MAIL_FROM}>`, // MUST be verified
      to: "yourgmail@gmail.com", // test inbox
      replyTo: process.env.ZEPTO_MAIL_FROM,
      subject: "ZeptoMail LIVE Mode Test",
      text: "This is a LIVE SMTP test from local machine.",
      html: `
        <h3>ZeptoMail LIVE Test</h3>
        <p>If you received this, LIVE mode is working correctly.</p>
      `,
    });

    console.log("✅ SMTP ACCEPTED");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ LIVE TEST FAILED");
    console.error("Error message:", err.message);
    console.error("Full error:", err);
  }
}

testMail();
