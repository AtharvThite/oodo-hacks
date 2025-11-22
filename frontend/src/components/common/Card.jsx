import React from 'react'
import classNames from 'classnames'

const Card = ({ children, className = '', padding = true, ...props }) => {
  return (
    <div
      className={classNames(
        'bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card