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
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={classNames(
          'block w-full rounded-lg shadow-sm sm:text-sm px-3 py-2 transition-colors',
          'bg-white dark:bg-slate-700 text-slate-900 dark:text-white',
          'border',
          error
            ? 'border-danger-300 dark:border-danger-700 focus:border-danger-500 focus:ring-danger-500'
            : 'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500'
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  )
}

export default Select