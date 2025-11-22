import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import authService from '../../store/services/authService'
import OTPInput from '../common/OTPInput'
import Card from '../common/Card'
import Input from '../common/Input'
import Button from '../common/Button'

const OTPVerification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [step, setStep] = useState(email ? 'otp' : 'email') // 'email' or 'otp'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [canResend, setCanResend] = useState(false)

  // Timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && step === 'otp' && email) {
      setCanResend(true)
    }
  }, [timeLeft, step, email])

  // Send OTP when email is entered
  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.sendOTP(email, 'registration')
      if (result.success) {
        setStep('otp')
        setTimeLeft(result.expiresIn || 600)
        setCanResend(false)
        toast.success('OTP sent to your email')
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  // Verify OTP
  const handleVerifyOTP = async (otp) => {
    if (!otp || otp.length !== 6) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.verifyOTP(email, otp, 'registration')
      if (result.success) {
        toast.success('Email verified successfully!')
        // Navigate to registration with email pre-filled
        navigate('/register', { state: { email, verified: true } })
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.resendOTP(email, 'registration')
      if (result.success) {
        setTimeLeft(result.expiresIn || 600)
        setCanResend(false)
        toast.success('OTP resent to your email')
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>
          <p className="mt-2 text-gray-600">
            {step === 'email'
              ? 'Enter your email to get started'
              : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {step === 'email' ? (
          // Email Input Step
          <Card className="p-6">
            <form onSubmit={handleSendOTP} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                error={error}
                required
              />

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!email}
                className="w-full"
              >
                Send OTP
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          </Card>
        ) : (
          // OTP Verification Step
          <div className="space-y-4">
            <OTPInput
              onComplete={handleVerifyOTP}
              isLoading={isLoading}
              error={error}
              onResend={handleResendOTP}
              canResend={canResend}
              timeLeft={timeLeft}
            />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Wrong email?{' '}
                <button
                  onClick={() => {
                    setStep('email')
                    setEmail('')
                    setError(null)
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Change email
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OTPVerification
