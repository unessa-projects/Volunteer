// test-zeptomail.js - Run this separately
import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

console.log('\n🧪 ===========================================');
console.log('🧪 ZEPTOMAIL DIRECT TEST');
console.log('🧪 ===========================================\n');

console.log('🔍 Checking environment variables:');
console.log('ZEPTO_SMTP_PASS exists?', !!process.env.ZEPTO_SMTP_PASS);
console.log('ZEPTO_SMTP_PASS length:', process.env.ZEPTO_SMTP_PASS?.length || 0);
console.log('ZEPTO_MAIL_FROM:', process.env.ZEPTO_MAIL_FROM);
console.log('SENDGRID_API_KEY exists?', !!process.env.SENDGRID_API_KEY);

async function testZeptoMail() {
  try {
    console.log('\n📧 Creating ZeptoMail transporter...');
    
    const transporter = nodemailer.createTransport({
      host: process.env.ZEPTO_SMTP_HOST || 'smtp.zeptomail.in',
      port: parseInt(process.env.ZEPTO_SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.ZEPTO_SMTP_USER || 'emailapikey',
        pass: process.env.ZEPTO_SMTP_PASS,
      },
    });

    console.log('✅ Transporter created');
    console.log('🔐 Verifying connection...');
    
    await transporter.verify();
    console.log('✅ SMTP connection verified!');

    console.log('\n✉️ Sending test email...');
    
    const result = await transporter.sendMail({
      from: `"ZeptoMail Test" <${process.env.ZEPTO_MAIL_FROM}>`,
      to: 'kirtanvyas9916@gmail.com',
      subject: '🧪 ZEPTOMAIL DIRECT TEST - Please check headers',
      text: 'If you receive this, ZeptoMail is working! Please check email headers to confirm it comes from ZeptoMail.',
      html: '<p>If you receive this, <strong>ZeptoMail is working!</strong></p><p>Please check email headers to confirm it comes from <code>smtp.zeptomail.in</code> not SendGrid.</p>'
    });

    console.log('\n🎉 ===========================================');
    console.log('🎉 TEST EMAIL SENT SUCCESSFULLY!');
    console.log('🎉 ===========================================');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    console.log('🎉 ===========================================\n');

  } catch (error) {
    console.error('\n❌ ===========================================');
    console.error('❌ ZEPTOMAIL TEST FAILED:');
    console.error('❌ ===========================================');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Full error:', error);
    console.error('❌ ===========================================\n');
  }
}

testZeptoMail();