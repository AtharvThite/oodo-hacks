const crypto = require('crypto')
const OTP = require('../models/OTP')
const { sendOTPEmail } = require('./emailService')

/**
 * Generate random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP to email
 */
const sendOTP = async (email, purpose = 'registration') => {
  try {
    // Check if recent OTP exists (avoid spam)
    const recentOTP = await OTP.findOne({
      email: email.toLowerCase(),
      purpose,
      createdAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) } // Last 2 minutes
    })

    if (recentOTP && !recentOTP.isVerified) {
      return {
        success: false,
        message: 'OTP already sent. Please try again after 2 minutes.',
        retryAfter: 120
      }
    }

    // Generate new OTP
    const otp = generateOTP()
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY) || 10

    // Save OTP to database
    const otpRecord = await OTP.findOneAndUpdate(
      { email: email.toLowerCase(), purpose },
      {
        otp,
        email: email.toLowerCase(),
        purpose,
        isVerified: false,
        attempts: 0,
        expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000)
      },
      { upsert: true, new: true }
    )

    // Send email
    await sendOTPEmail(email, otp, purpose)

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresIn: expiryMinutes * 60, // seconds
      email: email // Return for verification step
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    throw new Error(`Failed to send OTP: ${error.message}`)
  }
}

/**
 * Verify OTP
 */
const verifyOTP = async (email, otp, purpose = 'registration') => {
  try {
    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose,
      isVerified: false
    })

    if (!otpRecord) {
      return {
        success: false,
        message: 'No OTP found. Please request a new one.',
        attempts: 0
      }
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.',
        expired: true
      }
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return {
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.',
        maxAttemptsExceeded: true
      }
    }

    // Verify OTP
    if (otpRecord.otp !== otp.toString()) {
      otpRecord.attempts += 1
      await otpRecord.save()
      return {
        success: false,
        message: `Invalid OTP. ${otpRecord.maxAttempts - otpRecord.attempts} attempts remaining.`,
        attempts: otpRecord.attempts,
        remainingAttempts: otpRecord.maxAttempts - otpRecord.attempts
      }
    }

    // Mark as verified
    otpRecord.isVerified = true
    await otpRecord.save()

    return {
      success: true,
      message: 'OTP verified successfully',
      email: email.toLowerCase()
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw new Error(`Failed to verify OTP: ${error.message}`)
  }
}

/**
 * Check if email is verified (for registration flow)
 */
const isEmailVerified = async (email, purpose = 'registration') => {
  try {
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose,
      isVerified: true
    })
    return Boolean(otpRecord)
  } catch (error) {
    console.error('Error checking email verification:', error)
    return false
  }
}

/**
 * Clear OTP after successful registration
 */
const clearOTP = async (email, purpose = 'registration') => {
  try {
    await OTP.deleteOne({
      email: email.toLowerCase(),
      purpose
    })
    return true
  } catch (error) {
    console.error('Error clearing OTP:', error)
    return false
  }
}

/**
 * Resend OTP (if expired or lost)
 */
const resendOTP = async (email, purpose = 'registration') => {
  try {
    // Delete old OTP
    await OTP.deleteOne({
      email: email.toLowerCase(),
      purpose
    })

    // Send new OTP
    return await sendOTP(email, purpose)
  } catch (error) {
    console.error('Error resending OTP:', error)
    throw new Error(`Failed to resend OTP: ${error.message}`)
  }
}

module.exports = {
  generateOTP,
  sendOTP,
  verifyOTP,
  isEmailVerified,
  clearOTP,
  resendOTP
}
