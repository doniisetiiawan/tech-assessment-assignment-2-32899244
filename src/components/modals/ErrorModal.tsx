import React from 'react'
import { Button } from '../atoms/Button'

interface ErrorModalProps {
  title?: string
  message: string
  onClose: () => void
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  title = 'An error occurred',
  message,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>

        <Button variant="primary" onClick={onClose} className="w-full">
          Dismiss
        </Button>
      </div>
    </div>
  )
}
