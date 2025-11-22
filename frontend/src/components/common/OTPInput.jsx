import React, { useState, useRef, useEffect } from 'react'
import Button from './Button'
import Card from './Card'

const OTPInput = ({ 
  length = 6, 
  onComplete, 
  isLoading = false,
  error = null,
  onResend,
  canResend = false,
  timeLeft = 0
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const inputs = useRef([])

  const handleChange = (value, index) => {
    if (isNaN(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < length - 1) {
      inputs.current[index + 1].focus()
    }

    // Check if all digits are filled
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''))
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputs.current[index - 1].focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1].focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputs.current[index + 1].focus()
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Enter OTP</h3>
          <p className="text-sm text-gray-600 mt-1">
            {timeLeft > 0 ? `Expires in ${timeLeft}s` : 'OTP expires in 10 minutes'}
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value.slice(-1), index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                error
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-primary-500'
              }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Didn't receive the code?</p>
          <button
            onClick={onResend}
            disabled={!canResend || isLoading}
            className={`text-sm font-medium mt-2 ${
              canResend && !isLoading
                ? 'text-primary-600 hover:text-primary-700 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {canResend ? 'Resend OTP' : `Resend in ${timeLeft}s`}
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="button"
          onClick={() => onComplete(otp.join(''))}
          disabled={isLoading || otp.some(digit => digit === '')}
          isLoading={isLoading}
          className="w-full"
        >
          Verify OTP
        </Button>
      </div>
    </Card>
  )
}

export default OTPInput
