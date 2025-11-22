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

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <span className="text-primary-600 font-bold text-xl">SM</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP from your email and choose a new password.
          </p>
        </div>

        {/* Reset Password Form */}
        <Card>
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
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
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
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
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
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Back to login
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword