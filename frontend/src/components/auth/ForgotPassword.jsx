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
import { Package, ArrowLeft, CheckCircle } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)
  const { theme } = useTheme()

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

export default ForgotPassword