const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // In development, log email config (without password)
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_EMAIL,
      hasPassword: !!process.env.SMTP_PASSWORD
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp, name = 'User', purpose = 'registration') => {
  try {
    const transporter = createTransporter();

    let subject = 'StockMaster - Email Verification';
    let greeting = 'Welcome to StockMaster!';

    if (purpose === 'forgot-password') {
      subject = 'StockMaster - Password Reset';
      greeting = 'Password Reset Request';
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'StockMaster'}" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0; font-size: 28px;">🔐 StockMaster</h1>
              <h2 style="color: #34495e; margin: 10px 0; font-size: 20px;">${greeting}</h2>
            </div>

            <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px;">Hello ${name},</p>

              ${purpose === 'registration'
                ? '<p style="margin: 0 0 20px 0; color: #555;">Please verify your email address to complete your StockMaster registration.</p>'
                : '<p style="margin: 0 0 20px 0; color: #555;">You have requested to reset your password. Please use the following OTP to reset your password.</p>'
              }

              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #3498db; color: white; padding: 15px 30px; border-radius: 8px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 3px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>

              <div style="background-color: #f39c12; color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; text-align: center;">
                  <strong>⚠️ This OTP is valid for ${process.env.OTP_EXPIRY || 10} minutes only</strong>
                </p>
              </div>

              <p style="margin: 20px 0 0 0; color: #7f8c8d; font-size: 14px; text-align: center;">
                If you didn't request this ${purpose === 'registration' ? 'verification' : 'password reset'}, please ignore this email.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">

            <div style="text-align: center; color: #95a5a6; font-size: 12px;">
              <p style="margin: 0;">This is an automated email from StockMaster Inventory Management System.</p>
              <p style="margin: 5px 0;">Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  GMAIL AUTHENTICATION ERROR ⚠️');
      console.error('Gmail requires an App-Specific Password for third-party apps.');
      console.error('Steps to fix:');
      console.error('1. Go to: https://myaccount.google.com/apppasswords');
      console.error('2. Enable 2-Step Verification if not already enabled');
      console.error('3. Generate an App Password for "Mail"');
      console.error('4. Update SMTP_PASSWORD in .env with the 16-character code\n');
    }
    
    // In development, log OTP to console as fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 DEVELOPMENT MODE - OTP for', email, ':', otp);
      console.log('⚠️  Use this OTP since email delivery failed\n');
    }
    
    return { success: false, message: 'Failed to send OTP email', error: error.message };
  }
};

module.exports = {
  sendOTPEmail
};