const nodemailer = require('nodemailer')

// Initialize transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service verification failed:', error)
  } else {
    console.log('✅ Email service ready')
  }
})

/**
 * Send OTP email
 */
const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const purpose_text = {
    registration: 'Registration',
    'forgot-password': 'Password Reset',
    verification: 'Email Verification'
  }

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'StockMaster'} <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `Your ${purpose_text[purpose] || 'Verification'} OTP - StockMaster`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; text-align: center; }
            .otp-box { background-color: #f0f4ff; border: 2px solid #2563eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .otp { font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e5e7eb; }
            .warning { color: #dc2626; font-size: 14px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 StockMaster</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your One-Time Password (OTP) for ${purpose_text[purpose] || 'email verification'} is:</p>
              <div class="otp-box">
                <div class="otp">${otp}</div>
              </div>
              <p>This OTP will expire in <strong>10 minutes</strong></p>
              <p class="warning">⚠️ Never share this OTP with anyone. We will never ask you for your OTP.</p>
            </div>
            <div class="footer">
              <p>If you didn't request this OTP, please ignore this email.</p>
              <p>&copy; 2025 StockMaster. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Your ${purpose_text[purpose] || 'verification'} OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nDo not share this OTP with anyone.`
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent to ${email}: ${info.messageId}`)
    return {
      success: true,
      messageId: info.messageId
    }
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error)
    throw new Error(`Email sending failed: ${error.message}`)
  }
}

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'StockMaster'} <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'Password Reset Link - StockMaster',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; }
            .button { background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 StockMaster</h1>
              <p>Password Reset</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to set a new password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>Or copy this link:</p>
              <p style="word-break: break-all; color: #666; font-size: 12px;">${resetLink}</p>
              <p style="color: #dc2626; font-size: 14px;">This link will expire in 1 hour.</p>
            </div>
            <div class="footer">
              <p>If you didn't request a password reset, please ignore this email.</p>
              <p>&copy; 2025 StockMaster. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Reset email sent to ${email}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error(`❌ Failed to send reset email to ${email}:`, error)
    throw new Error(`Email sending failed: ${error.message}`)
  }
}

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  transporter
}
