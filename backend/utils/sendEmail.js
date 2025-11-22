const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
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
const sendOTPEmail = async (email, otp, name = 'User') => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"StockMaster" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Password Reset OTP - StockMaster',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">StockMaster - Password Reset</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p>Hello ${name},</p>
            <p>You have requested to reset your password. Please use the following OTP to reset your password:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; letter-spacing: 2px;">${otp}</span>
            </div>
            <p><strong>This OTP is valid for 10 minutes only.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #666;">
              This is an automated email from StockMaster. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send OTP email' };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name, tempPassword) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"StockMaster" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Welcome to StockMaster - Account Created',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Welcome to StockMaster!</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p>Hello ${name},</p>
            <p>Your StockMaster account has been created successfully. Here are your login details:</p>
            <div style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            </div>
            <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.FRONTEND_URL}/login" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Login to StockMaster</a>
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #666;">
              This is an automated email from StockMaster. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send welcome email' };
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};