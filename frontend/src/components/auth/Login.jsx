import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { loginUser, clearError } from '../../store/slices/authSlice'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Package, ArrowLeft } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange'
  })

  // Watch form values for debugging
  const watchedValues = watch()
  console.log('Current form values:', watchedValues)

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

  const onSubmit = async (data) => {
    console.log('=== LOGIN FORM SUBMISSION START ===')
    console.log('Login form submitted with data:', data)
    console.log('Current form state:', { errors, watchedValues })
    try {
      const result = await dispatch(loginUser(data)).unwrap()
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error || 'Login failed')
    }
  }

  const handleFormSubmit = (e) => {
    console.log('Form submit event triggered')
    console.log('Event:', e)
    handleSubmit(onSubmit)(e)
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
              Welcome Back
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 p-8 shadow-xl backdrop-blur-sm">
            <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div>
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
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
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
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

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
                onClick={(e) => {
                  console.log('Login submit button clicked!')
                  console.log('Button event:', e)
                }}
              >
                Sign in
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            <Link
              to="/register"
              className="w-full inline-flex justify-center items-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              Create an account
            </Link>
          </form>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login