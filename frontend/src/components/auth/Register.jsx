import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { registerUser, clearError } from '../../store/slices/authSlice'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import Card from '../common/Card'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Package, ArrowLeft, Mail } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Register = () => {
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailVerified, setEmailVerified] = useState(searchParams.get('verified') === 'true')
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [otpLoading, setOtpLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      role: 'staff',
      email: email
    }
  })

  const password = watch('password')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (emailVerified && email) {
      setValue('email', email)
    }
  }, [emailVerified, email, setValue])

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setOtpLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          purpose: 'registration'
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('OTP sent to your email!')
        navigate(`/verify-otp?email=${encodeURIComponent(email)}&purpose=registration`)
      } else {
        toast.error(data.message || 'Failed to send OTP')
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  const onSubmit = async (data) => {
    const { confirmPassword, ...registerData } = data

    try {
      const result = await dispatch(registerUser(data)).unwrap()
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      toast.error(error || 'Registration failed')
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Back to Home */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Header */}
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
              Create Your Account
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Start managing your inventory today
            </p>
          </div>

          {/* Register Form */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 p-8 shadow-xl backdrop-blur-sm">
            {!emailVerified ? (
              /* Email Verification Step */
              <div className="space-y-6">
                <div className="text-center">
                  <Mail className="mx-auto h-12 w-12 text-primary-500 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Verify Your Email
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    We'll send a verification code to your email address
                  </p>
                </div>

                <div>
                  <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Button
                    type="button"
                    className="w-full"
                    isLoading={otpLoading}
                    disabled={otpLoading || !email}
                    onClick={handleSendOTP}
                  >
                    Start Verification
                  </Button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="w-full inline-flex justify-center items-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  Sign in instead
                </Link>
              </div>
            ) : (
              /* Full Registration Form */
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    Email Verified
                  </div>
                </div>

                <div>
                  <Input
                    label="Full Name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    required
                    error={errors.name?.message}
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    required
                    disabled
                    value={email}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Email verified
                  </p>
                </div>

                <div>
                  <Select
                    label="Role"
                    required
                    error={errors.role?.message}
                    disabled
                    {...register('role', {
                      required: 'Role is required',
                    })}
                  >
                    <option value="staff">Staff</option>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">New users join as Staff. Admin can change roles later.</p>
                </div>

                <div>
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      required
                      error={errors.password?.message}
                      {...register('password', {
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
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      required
                      error={errors.confirmPassword?.message}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === password || 'Passwords do not match',
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Create Account
                  </Button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="w-full inline-flex justify-center items-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  Sign in instead
                </Link>
              </form>
            )}
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register