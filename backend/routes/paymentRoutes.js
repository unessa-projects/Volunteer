import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const router = express.Router();

// helper to convert UTC date to IST string dd-mm-yyyy
function formatDateToIST(date) {
  const istOffsetMs = 5.5 * 60 * 60 * 1000; // IST offset
  const istDate = new Date(date.getTime() + istOffsetMs);
  const day = String(istDate.getDate()).padStart(2, '0');
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const year = istDate.getFullYear();
  return `${day}-${month}-${year}`;
}

// ---------------------
// @route   GET /donations
// @desc    List donations, filtered by username (maps to refName in DB)
// ---------------------
router.get('/donations', async (req, res) => {
  try {
    const { username } = req.query;

    const filter = {};
    if (username) {
      // ✅ Match both refName (old records) and username (future-proof)
      filter.$or = [{ refName: username }, { username: username }];
    }

    const payments = await Payment.find(filter).sort({ createdAt: -1 }).lean();

    const formattedPayments = payments.map(payment => ({
      ...payment,
      formattedDate: formatDateToIST(payment.createdAt),
    }));

    res.status(200).json(formattedPayments);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ---------------------
// @route   POST /store-payment
// @desc    Save payment + update user donations
// ---------------------
router.post('/store-payment', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      name,
      email,
      phone,
      amount,
      orderId,
      paymentId,
      upiId,

      username, // 👈 frontend will always send username
    } = req.body;

    // Basic validation
    if (!name || !email || !amount || !orderId || !paymentId || !username) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    const istDate = new Date(Date.now() + (330 * 60 * 1000)); // IST date
    // 1. Save the payment (store refName = username for consistency)
    const newPayment = new Payment({
      refName: username, // ✅ always use refName in DB
      name,
      email,
      phone,
      amount: numericAmount,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      upiId,
      createdAt:istDate
    });

    await newPayment.save({ session });

    // 2. Update fundraiser's total amount
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $inc: { amount: numericAmount } },
      { new: true, session }
    );

    if (!updatedUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: 'Payment stored and user updated' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error storing payment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// router.post('/process-payment', async (req, res) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const {
//       name,
//       email,
//       phone,
//       address,
//       anonymous,
//       amount,
//       orderId,
//       paymentId,
//       razorpay_signature,
//       upiId,
//       referenceName,
//       username // OPTIONAL
//     } = req.body;

//     console.log("✅ PROCESS PAYMENT BODY:", req.body);

//     // 1️⃣ Required validation (NO username check)
//     if (!name || !email || !amount || !orderId || !paymentId || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields'
//       });
//     }
//    const finalRefName =
//   typeof referenceName === 'string' && referenceName.trim() !== ''
//     ? referenceName.trim()
//     : typeof username === 'string' && username.trim() !== ''
//       ? username.trim()
//       : null;

// console.log("🎯 FINAL REF NAME:", finalRefName);
// console.log("🎯 USERNAME:", username);
// console.log("🎯 REFERENCE NAME:", referenceName);


// console.log("🎯 FINAL REF NAME:", finalRefName);
//     const numericAmount = Number(amount);
//     if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid amount'
//       });
//     }

//     // 2️⃣ Razorpay signature verification
//     const body = `${orderId}|${paymentId}`;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest('hex');

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid signature'
//       });
//     }

//     // 3️⃣ Prevent duplicate payments
//     const existingPayment = await Payment.findOne(
//       { razorpay_payment_id: paymentId },
//       null,
//       { session }
//     );

//     if (existingPayment) {
//       await session.commitTransaction();
//       return res.status(200).json({
//         success: true,
//         message: 'Payment already processed'
//       });
//     }

//     const istDate = new Date(Date.now() + (330 * 60 * 1000));

//     // 4️⃣ Save payment (username OPTIONAL)
//     const payment = new Payment({
//       refName: finalRefName,
//       name,
//       email,
//       phone,
//       address,
//       anonymous: Boolean(anonymous),
//       amount: numericAmount,
//       razorpay_order_id: orderId,
//       razorpay_payment_id: paymentId,
//       upiId,
//       createdAt: istDate
//     });

//     await payment.save({ session });

//     // 5️⃣ Update user amount ONLY if username exists
//     if (finalRefName) {
//       const updatedUser = await User.findOneAndUpdate(
//         { username: finalRefName },
//         { $inc: { amount: numericAmount } },
//         { new: true, session }
//       );

//       if (!updatedUser) {
//         console.warn('⚠️ Username not found, skipping user update:', username);
//       }
//     }

//     // 6️⃣ Commit transaction
//     await session.commitTransaction();

//     return res.status(200).json({
//       success: true,
//       message: 'Payment verified and processed successfully'
//     });

//   } catch (error) {
//     console.error('🔥 PROCESS PAYMENT ERROR:', error.message);

//     try {
//       await session.abortTransaction();
//     } catch {}

//     return res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });

//   } finally {
//     session.endSession();
//   }
// });

router.post('/process-payment', async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      name,
      email,
      phone,
      address,
      anonymous,
      amount,
      orderId,
      paymentId,
      razorpay_signature,
      upiId,
      referenceName,
      username
    } = req.body;

    // 1️⃣ Validation
    if (!name || !email || !amount || !orderId || !paymentId || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const finalRefName =
      typeof referenceName === 'string' && referenceName.trim()
        ? referenceName.trim()
        : typeof username === 'string' && username.trim()
          ? username.trim()
          : null;

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // 2️⃣ Razorpay signature verification
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // 3️⃣ Duplicate check
    const existingPayment = await Payment.findOne(
      { razorpay_payment_id: paymentId },
      null,
      { session }
    );

    if (existingPayment) {
      await session.commitTransaction();
      return res.status(200).json({
        success: true,
        message: 'Payment already processed'
      });
    }

    // 🕒 IST DATE (HUMAN SAFE)
    const istDate = new Date(Date.now() + (330 * 60 * 1000));

    // 4️⃣ Save payment
    const payment = new Payment({
      refName: finalRefName,
      name,
      email,
      phone,
      address,
      anonymous: Boolean(anonymous),
      amount: numericAmount,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      upiId,
      createdAt: istDate
    });

    await payment.save({ session });

    // 5️⃣ Update user amount
    if (finalRefName) {
      await User.findOneAndUpdate(
        { username: finalRefName },
        { $inc: { amount: numericAmount } },
        { new: true, session }
      );
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: 'Payment verified and processed successfully'
    });

  } catch (error) {
    try { await session.abortTransaction(); } catch {}

    console.error('🔥 PROCESS PAYMENT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });

  } finally {
    session.endSession();
  }
});

export default router;

