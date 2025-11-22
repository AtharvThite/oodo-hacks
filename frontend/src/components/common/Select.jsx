import React from 'react'
import classNames from 'classnames'

const Select = ({
  label,
  error,
  helperText,
  className = '',
  id,
  required = false,
  children,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={classNames(
          'block w-full rounded-md shadow-sm sm:text-sm',
          error
            ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-danger-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default Select