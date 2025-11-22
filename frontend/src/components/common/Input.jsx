import React from 'react'
import classNames from 'classnames'

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  id,
  required = false,
  onChange,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  const handleChange = (e) => {
    console.log(`Input ${inputId} changed:`, e.target.value)
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={classNames(
          'block w-full rounded-lg border shadow-sm sm:text-sm px-3 py-2 transition-colors',
          'bg-white dark:bg-slate-700 text-slate-900 dark:text-white',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          error
            ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500'
        )}
        onChange={handleChange}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input