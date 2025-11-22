import React from 'react'
import classNames from 'classnames'

const Badge = ({ children, variant = 'gray', size = 'medium', className = '' }) => {
  const variantClasses = {
    gray: 'bg-gray-100 text-gray-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-danger-100 text-danger-800',
    primary: 'bg-primary-100 text-primary-800'
  }
  
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-0.5 text-xs',
    large: 'px-3 py-1 text-sm'
  }

  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge