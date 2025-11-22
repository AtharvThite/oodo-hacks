const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['registration', 'forgot-password', 'email-verification'],
    default: 'registration'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: parseInt(process.env.MAX_OTP_ATTEMPTS) || 5
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + parseInt(process.env.OTP_EXPIRY || 10) * 60 * 1000),
    index: { expireAfterSeconds: 0 } // TTL index
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
})

// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Pre-save: Validate attempts
otpSchema.pre('save', function(next) {
  if (this.attempts > this.maxAttempts) {
    const err = new Error('Maximum OTP attempts exceeded. Please request a new OTP.')
    err.statusCode = 429
    next(err)
  } else {
    next()
  }
})

module.exports = mongoose.model('OTP', otpSchema)
