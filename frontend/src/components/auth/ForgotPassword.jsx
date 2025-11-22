import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { forgotPassword, clearError } from '../../store/slices/authSlice'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm()

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-success-100">
              <CheckCircleIcon className="h-8 w-8 text-success-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent password reset instructions to{' '}
              <span className="font-medium">{getValues('email')}</span>
            </p>
          </div>

          <Card>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEmailSent(false)}
                  className="flex-1"
                >
                  Try again
                </Button>
                <Link to="/login" className="flex-1">
                  <Button variant="primary" className="w-full">
                    Back to login
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
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
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Forgot Password Form */}
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
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Send reset instructions
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

export default ForgotPassword