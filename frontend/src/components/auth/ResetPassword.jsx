import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { resetPassword, clearError } from '../../store/slices/authSlice'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Package, ArrowLeft } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: searchParams.get('email') || '',
      otp: searchParams.get('otp') || '',
    },
  })

  const password = watch('newPassword')

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onSubmit = async (data) => {
    try {
      await dispatch(resetPassword(data)).unwrap()
      toast.success('Password reset successful!')
      navigate('/login')
    } catch (error) {
      // Error is handled in the slice
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
          {/* Back to Login */}
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
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
              Reset Password
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Enter the OTP from your email and choose a new password
            </p>
          </div>

          {/* Reset Password Form */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 p-8 shadow-xl backdrop-blur-sm">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                required
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>

            <div>
              <Input
                label="OTP Code"
                type="text"
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                error={errors.otp?.message}
                {...register('otp', {
                  required: 'OTP is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'OTP must be 6 digits',
                  },
                })}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
                Reset Password
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword