import React from 'react'
import classNames from 'classnames'
import LoadingSpinner from './LoadingSpinner'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200'
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-gray-900',
    success: 'bg-success-600 hover:bg-success-700 focus:ring-success-500 text-white',
    danger: 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500 text-white',
    warning: 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500 text-white',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500'
  }
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }

  const isDisabled = disabled || isLoading

  return (
    <button
      className={classNames(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="small" className="mr-2" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  )
}

export default Button