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
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={classNames(
          'block w-full rounded-md border shadow-sm sm:text-sm px-3 py-2',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        )}
        onChange={handleChange}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input