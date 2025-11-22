const OTP = require('../models/OTP');
const { sendOTPEmail } = require('./emailService');

class OTPService {
  // Generate a 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to email
  static async sendOTP(email, purpose = 'registration', name = 'User') {
    try {
      // Check if there's a recent OTP (within 2 minutes)
      const recentOTP = await OTP.findOne({
        email,
        purpose,
        createdAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) }, // 2 minutes ago
        isVerified: false
      });

      if (recentOTP) {
        const timeDiff = Math.ceil((Date.now() - recentOTP.createdAt) / 1000);
        const waitTime = 120 - timeDiff;
        return {
          success: false,
          message: `OTP already sent. Please try again after ${waitTime} seconds.`,
          retryAfter: waitTime
        };
      }

      // Generate new OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY) || 10) * 60 * 1000);

      // Save OTP to database
      await OTP.create({
        email,
        otp,
        purpose,
        expiresAt
      });

      // Send email
      const emailResult = await sendOTPEmail(email, otp, name, purpose);

      if (emailResult.success) {
        return {
          success: true,
          message: 'OTP sent successfully',
          expiresIn: (parseInt(process.env.OTP_EXPIRY) || 10) * 60
        };
      } else {
        // Delete the OTP if email failed
        await OTP.deleteOne({ email, otp, purpose });
        return emailResult;
      }
    } catch (error) {
      console.error('OTP send error:', error);
      return { success: false, message: 'Failed to send OTP', error: error.message };
    }
  }

  // Verify OTP
  static async verifyOTP(email, otp, purpose = 'registration') {
    try {
      const otpRecord = await OTP.findOne({
        email,
        otp,
        purpose,
        isVerified: false
      });

      if (!otpRecord) {
        return { success: false, message: 'Invalid OTP' };
      }

      // Check if expired
      if (otpRecord.expiresAt < new Date()) {
        return { success: false, message: 'OTP has expired', expired: true };
      }

      // Check max attempts
      const maxAttempts = parseInt(process.env.MAX_OTP_ATTEMPTS) || 5;
      if (otpRecord.attempts >= maxAttempts) {
        return {
          success: false,
          message: 'Maximum verification attempts exceeded',
          maxAttemptsExceeded: true
        };
      }

      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      // Mark as verified
      otpRecord.isVerified = true;
      await otpRecord.save();

      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('OTP verify error:', error);
      return { success: false, message: 'Failed to verify OTP', error: error.message };
    }
  }

  // Check if OTP is already verified (for password reset)
  static async isOTPVerified(email, otp, purpose = 'registration') {
    try {
      const otpRecord = await OTP.findOne({
        email,
        otp,
        purpose,
        isVerified: true
      });

      if (!otpRecord) {
        return { success: false, message: 'OTP not verified or invalid' };
      }

      // Check if expired (even verified OTPs can expire)
      if (otpRecord.expiresAt < new Date()) {
        return { success: false, message: 'OTP has expired', expired: true };
      }

      return { success: true, message: 'OTP is verified' };
    } catch (error) {
      console.error('OTP check error:', error);
      return { success: false, message: 'Failed to check OTP', error: error.message };
    }
  }

  // Clean up expired OTPs (can be called by a cron job)
  static async cleanupExpiredOTPs() {
    try {
      const result = await OTP.deleteMany({ expiresAt: { $lt: new Date() } });
      console.log(`🧹 Cleaned up ${result.deletedCount} expired OTPs`);
      return result.deletedCount;
    } catch (error) {
      console.error('Cleanup error:', error);
      return 0;
    }
  }
}

module.exports = OTPService;