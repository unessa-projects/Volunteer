import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path (backend/.env)
const envPath = path.join(__dirname, '../.env');
console.log('🔍 Loading .env from:', envPath);

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.log('❌ Error loading .env:', result.error);
} else {
  console.log('✅ .env loaded successfully');
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables');
  console.log('📋 Available variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  process.exit(1);
}

console.log('✅ MONGO_URI found:', MONGO_URI.substring(0, 25) + '...');

import User from '../models/User.js';
import { sendWhatsAppMessage } from '../services/whatsappService.js';
import { sendNotificationEmail } from '../services/emailService.js';

// Helper function to calculate date ranges
const getTargetDateRange = (daysAgo) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = new Date(today);
  startOfDay.setDate(today.getDate() - daysAgo);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1);
  return { startOfDay, endOfDay };
};

// --- Reminder Functions for Inactive Users (amount = 0) ---
const sendDay7Reminder = async () => {
  console.log("Checking: Day 7 Inactive Reminders...");
  const { startOfDay, endOfDay } = getTargetDateRange(7);
  const users = await User.find({
    amount: 0,
    generatedAt: { $gte: startOfDay, $lt: endOfDay }
  });
  
  console.log(`Found ${users.length} users for Day 7 reminder`);
  
  for (const user of users) {
    try {
      const message = `:clap: Well done on completing your first week, ${user.name}!\n\nRemember: Fundraising is about sharing stories that inspire action.\nStart with your first circle — friends, family, and college contacts.\n\n:bulb: Tip: Post on your WhatsApp Status & Instagram Stories with a short message like:\n"I'm fundraising with Unessa Foundation to support education for underprivileged children. Join me in making a difference!"\n\nYou can join the weekly induction meeting to revise and gain more insights on fundraising. Meeting link will on your Volunteer dashboard.`;
      await sendWhatsAppMessage(user.number, message);
      console.log(`✅ Sent Day 7 reminder to ${user.name}`);
    } catch (error) {
      console.error(`❌ Failed to send Day 7 reminder to ${user.name}:`, error);
    }
  }
  return users.length;
};

const sendDay14Reminder = async () => {
  console.log("Checking: Day 14 Inactive Reminders...");
  const { startOfDay, endOfDay } = getTargetDateRange(14);
  const users = await User.find({
    amount: 0,
    generatedAt: { $gte: startOfDay, $lt: endOfDay }
  });
  
  console.log(`Found ${users.length} users for Day 14 reminder`);
  
  for (const user of users) {
    try {
      const message = `Hey ${user.name}, you've reached the halfway mark of your internship! :checkered_flag:\n\nNow's a good time to:\n:white_check_mark: Review your progress\n:white_check_mark: Reconnect with friends who showed interest but haven't donated\n:white_check_mark: Set a mini-goal for the next 7 days\n\nYou're working towards amazing rewards (Certificate, Stipend, LinkedIn recommendation & more :medal:).\nLet's push forward — you've got this! :muscle:`;
      await sendWhatsAppMessage(user.number, message);
      console.log(`✅ Sent Day 14 reminder to ${user.name}`);
    } catch (error) {
      console.error(`❌ Failed to send Day 14 reminder to ${user.name}:`, error);
    }
  }
  return users.length;
};

const sendDay21Reminder = async () => {
  console.log("Checking: Day 21 Inactive Reminders...");
  const { startOfDay, endOfDay } = getTargetDateRange(21);
  const users = await User.find({
    amount: 0,
    generatedAt: { $gte: startOfDay, $lt: endOfDay }
  });
  
  console.log(`Found ${users.length} users for Day 21 reminder`);
  
  for (const user of users) {
    try {
      const message = `Hi ${user.name}, welcome to Week 3! :star2:\n\nThis week, focus on expanding beyond your close circle — share your story on LinkedIn, Instagram, or college groups.\n\n:bulb: Reminder: The more visibility you create, the closer you get to ICON level rewards :fire:\n\nKeep shining — you're not just raising funds, you're inspiring change! :blue_heart:`;
      await sendWhatsAppMessage(user.number, message);
      console.log(`✅ Sent Day 21 reminder to ${user.name}`);
    } catch (error) {
      console.error(`❌ Failed to send Day 21 reminder to ${user.name}:`, error);
    }
  }
  return users.length;
};

const sendDay28Reminder = async () => {
  console.log("Checking: Day 28 Inactive Reminders...");
  const { startOfDay, endOfDay } = getTargetDateRange(28);
  const users = await User.find({
    amount: 0,
    generatedAt: { $gte: startOfDay, $lt: endOfDay }
  });
  
  console.log(`Found ${users.length} users for Day 28 reminder`);
  
  for (const user of users) {
    try {
      const message = `Hi ${user.name}, just few days to go in your fundraising internship! :rocket:\n\nNow's the time for a strong finish:\n:point_right: Send a thank-you message to existing donors.\n:point_right: Follow up with pending contacts.\n:point_right: Share a final "countdown" update on your social media.\n\nRemember, every rupee raised goes directly to support children's education :books:\nLet's end this on a high note :gem:`;
      await sendWhatsAppMessage(user.number, message);
      console.log(`✅ Sent Day 28 reminder to ${user.name}`);
    } catch (error) {
      console.error(`❌ Failed to send Day 28 reminder to ${user.name}:`, error);
    }
  }
  return users.length;
};

// --- Notification for Internship Completion ---
const sendDay30CompletionMessage = async () => {
  console.log("Checking: Day 30 Completion Messages...");
  const { startOfDay, endOfDay } = getTargetDateRange(30);
  const users = await User.find({
    generatedAt: { $gte: startOfDay, $lt: endOfDay }
  });
  
  console.log(`Found ${users.length} users for Day 30 completion message`);
  
  for (const user of users) {
    try {
      const message = `:tada: Congratulations ${user.name}! :tada:\n\nYou've successfully completed your 30-day Fundraising Internship with Unessa Foundation.\n\nYour dedication has created real impact :blue_heart:.\nYou will be receiving your Certificate of Completion, along with rewards based on your performance tier within 30 days of internship completion:\n:sparkles: VIBE / MOMENTUM / CATALYST / ICON\n\nWe're proud of you — you've proven that one person can truly transform lives. :earth_africa:`;
      await sendWhatsAppMessage(user.number, message);
      console.log(`✅ Sent Day 30 completion message to ${user.name}`);
    } catch (error) {
      console.error(`❌ Failed to send Day 30 completion message to ${user.name}:`, error);
    }
  }
  return users.length;
};

// --- Weekly Update for Active Fundraisers (amount > 0) ---
const sendWeeklyActiveUpdate = async () => {
  console.log("Checking: Weekly Active Fundraiser Updates...");
  let totalSent = 0;
  
  // Check for users at day 7, 14, 21, and 28
  for (const week of [7, 14, 21, 28]) {
    const { startOfDay, endOfDay } = getTargetDateRange(week);
    const users = await User.find({
      amount: { $gt: 0 }, // Find users who HAVE raised funds
      generatedAt: { $gte: startOfDay, $lt: endOfDay }
    });
    
    console.log(`Found ${users.length} active users for week ${week}`);
    
    for (const user of users) {
      try {
        const message = `:star2: Hi ${user.name},\n\nCongratulations! :tada: You've successfully raised ₹${user.amount} in funds till now :clap: — an incredible contribution that makes a real difference.\n\nYour effort and commitment are truly inspiring. :muscle: Let's keep the momentum going and strive for even more impact together! :raised_hands::sparkles:\n\nGrateful for your support :sparkling_heart:`;
        await sendWhatsAppMessage(user.number, message);
        console.log(`✅ Sent week ${week} active update to ${user.name}`);
        totalSent++;
      } catch (error) {
        console.error(`❌ Failed to send week ${week} active update to ${user.name}:`, error);
      }
    }
  }
  return totalSent;
};

// --- Main Execution Function ---
const run = async () => {
  const summary = {
    startTime: new Date(),
    notificationsSent: {},
    error: null,
  };
  
  try {
    console.log("🚀 Starting daily notification cron job...");
    console.log("📊 Environment check:");
    console.log("   - MONGO_URI:", MONGO_URI.substring(0, 25) + '...');
    console.log("   - ADMIN_EMAIL:", process.env.ADMIN_EMAIL || 'NOT FOUND');
    console.log("   - Current time:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
    
    console.log("🔌 Connecting to database...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Database connected. Starting notification checks...");
    
    // Execute all notification functions
    summary.notificationsSent.day7Inactive = await sendDay7Reminder();
    summary.notificationsSent.day14Inactive = await sendDay14Reminder();
    summary.notificationsSent.day21Inactive = await sendDay21Reminder();
    summary.notificationsSent.day28Inactive = await sendDay28Reminder();
    summary.notificationsSent.day30Completion = await sendDay30CompletionMessage();
    summary.notificationsSent.weeklyActive = await sendWeeklyActiveUpdate();
    
    console.log("✅ All notification checks completed successfully");
    
  } catch (err) {
    console.error("❌ An error occurred during the cron job:", err);
    summary.error = err;
    throw err;
  } finally {
    console.log("🔌 Disconnecting from database...");
    await mongoose.disconnect();
    console.log("✅ Database disconnected");
    
    const duration = (new Date() - summary.startTime) / 1000;
    console.log(`⏱️  Total execution time: ${duration.toFixed(2)} seconds`);
    
    // Send summary email
    try {
      if (summary.error) {
        const errorHtml = `
          <h1>❌ Unessa Daily Notification Cron Job FAILED</h1>
          <p>The job failed at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.</p>
          <p><b>Error:</b></p>
          <pre>${summary.error.stack}</pre>
          <p><b>Duration:</b> ${duration.toFixed(2)} seconds</p>
        `;
        await sendNotificationEmail('❌ CRON JOB FAILED: Daily Notifications', errorHtml);
        console.log("✅ Error notification email sent");
      } else {
        const successHtml = `
          <h1>✅ Unessa Daily Notification Cron Job Succeeded</h1>
          <p>The job completed successfully at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.</p>
          <p><b>Total duration:</b> ${duration.toFixed(2)} seconds.</p>
          <h3>📊 Summary of Notifications Sent:</h3>
          <ul>
            <li>Day 7 Inactive Reminders: <strong>${summary.notificationsSent.day7Inactive}</strong></li>
            <li>Day 14 Inactive Reminders: <strong>${summary.notificationsSent.day14Inactive}</strong></li>
            <li>Day 21 Inactive Reminders: <strong>${summary.notificationsSent.day21Inactive}</strong></li>
            <li>Day 28 Inactive Reminders: <strong>${summary.notificationsSent.day28Inactive}</strong></li>
            <li>Day 30 Completion Messages: <strong>${summary.notificationsSent.day30Completion}</strong></li>
            <li>Weekly Active Updates: <strong>${summary.notificationsSent.weeklyActive}</strong></li>
          </ul>
          <p><b>Total notifications sent:</b> <strong>${
            Object.values(summary.notificationsSent).reduce((a, b) => a + b, 0)
          }</strong></p>
        `;
        await sendNotificationEmail('✅ Cron Job Success: Daily Notifications', successHtml);
        console.log("✅ Success notification email sent");
      }
    } catch (emailError) {
      console.error("❌ Failed to send notification email:", emailError);
    }
  }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
run().catch(err => {
  console.error("❌ Top-level execution error in cron job script:", err);
  process.exit(1);
});
