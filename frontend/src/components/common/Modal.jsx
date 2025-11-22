import React from 'react'
import ReactModal from 'react-modal'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Button from './Button'

// Set app element for accessibility
if (typeof window !== 'undefined') {
  ReactModal.setAppElement('#root')
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
}) => {
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl'
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
      closeTimeoutMS={200}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {title}
        </h3>
        {showCloseButton && (
          <Button
            variant="secondary"
            size="small"
            onClick={onClose}
            icon={XMarkIcon}
            className="!p-2"
          />
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </ReactModal>
  )
}

export default Modal