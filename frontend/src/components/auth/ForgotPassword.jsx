import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { forgotPassword, clearError } from '../../store/slices/authSlice'
import authService from '../../store/services/authService'
import OTPInput from '../common/OTPInput'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { Package, ArrowLeft, CheckCircle } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const ForgotPassword = () => {
  const [step, setStep] = useState('email') // 'email', 'otp', 'reset'
  const [email, setEmail] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [isOTPLoading, setIsOTPLoading] = useState(false)
  const [otpError, setOTPError] = useState(null)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm()

  // Timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && step === 'otp' && email) {
      setCanResend(true)
    }
  }, [timeLeft, step, email])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  
  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsOTPLoading(true)
    setOTPError(null)

    try {
      const result = await authService.forgotPassword(email)
      if (result.success) {
        setStep('otp')
        setTimeLeft(result.expiresIn || 600)
        setCanResend(false)
        toast.success('OTP sent to your email')
      } else {
        setOTPError(result.message)
      }
    } catch (err) {
      setOTPError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setIsOTPLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (otp) => {
    if (!otp || otp.length !== 6) return

    setIsOTPLoading(true)
    setOTPError(null)

    try {
      const result = await authService.verifyOTP(email, otp, 'forgot-password')
      if (result.success) {
        setStep('reset')
        setValue('otp', otp)
        toast.success('OTP verified! Now set your new password.')
      } else {
        setOTPError(result.message)
      }
    } catch (err) {
      setOTPError(err.response?.data?.message || 'Failed to verify OTP')
    } finally {
      setIsOTPLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (data) => {
    setPasswordErrors({})

    if (data.newPassword !== data.confirmPassword) {
      setPasswordErrors({
        confirmPassword: 'Passwords do not match'
      })
      return
    }

    setIsOTPLoading(true)
    setOTPError(null)

    try {
      const result = await authService.resetPassword(
        email,
        data.otp,
        data.newPassword
      )

      if (result.success) {
        toast.success('Password reset successfully! Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setOTPError(result.message)
      }
    } catch (err) {
      setOTPError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setIsOTPLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setIsOTPLoading(true)
    setOTPError(null)

    try {
      const result = await authService.resendOTP(email, 'forgot-password')
      if (result.success) {
        setTimeLeft(result.expiresIn || 600)
        setCanResend(false)
        toast.success('OTP resent to your email')
      } else {
        setOTPError(result.message)
      }
    } catch (err) {
      setOTPError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setIsOTPLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      await dispatch(forgotPassword(data.email)).unwrap()
      setIsEmailSent(true)
      toast.success('Reset instructions sent to your email!')
    } catch (error) {
      // Error is handled in the slice
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 dark:bg-green-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/30 mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Check your email
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                We've sent password reset instructions to
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{getValues('email')}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 p-8 shadow-xl backdrop-blur-sm">
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEmailSent(false)}
                  className="w-full"
                >
                  Try again
                </Button>
                <Link to="/login" className="block">
                  <Button variant="primary" className="w-full">
                    Back to login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/50">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-slate-900 dark:text-white">StockMaster</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Inventory Management</div>
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Forgot Password?
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Enter your email and we'll send you reset instructions
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 p-8 shadow-xl backdrop-blur-sm">
            {step === 'email' && (
              <form className="space-y-6" onSubmit={handleSendOTP}>
                <div>
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setOTPError(null)
                    }}
                    error={otpError}
                    required
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isOTPLoading}
                    disabled={isOTPLoading || !email}
                  >
                    Send Reset OTP
                  </Button>
                </div>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Remember your password? Sign in
                  </Link>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <OTPInput
                  onComplete={handleVerifyOTP}
                  isLoading={isOTPLoading}
                  error={otpError}
                  onResend={handleResendOTP}
                  canResend={canResend}
                  timeLeft={timeLeft}
                />
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Wrong email?{' '}
                    <button
                      onClick={() => {
                        setStep('email')
                        setEmail('')
                        setOTPError(null)
                      }}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      Use different email
                    </button>
                  </p>
                </div>
              </div>
            )}

            {step === 'reset' && (
              <form className="space-y-6" onSubmit={handleSubmit(handleResetPassword)}>
                {otpError && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-700 dark:text-red-200">{otpError}</p>
                  </div>
                )}

                <div>
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    required
                    error={errors.newPassword?.message}
                    {...register('newPassword', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain uppercase, lowercase, and number',
                      },
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                    required
                    error={errors.confirmPassword?.message || passwordErrors.confirmPassword}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                    })}
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isOTPLoading}
                    disabled={isOTPLoading}
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword