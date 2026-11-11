import React from 'react'
import { Button } from '../atoms/Button'

interface SuccessModalProps {
  title: string
  message: string
  memberName?: string
  memberId?: string
  onPrimary: () => void
  primaryText?: string
  onSecondary?: () => void
  secondaryText?: string
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  title,
  message,
  memberName,
  memberId,
  onPrimary,
  primaryText = 'Back to Dashboard',
  onSecondary,
  secondaryText,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{message}</p>

        {(memberName || memberId) && (
          <div className="bg-slate-50 rounded-xl p-3 mb-6 border border-slate-200/60 text-left">
            {memberName && (
              <p className="text-sm font-semibold text-slate-900">Name: {memberName}</p>
            )}
            {memberId && (
              <p className="text-xs font-mono text-indigo-600 mt-0.5">ID: {memberId}</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onSecondary && secondaryText && (
            <Button variant="outline" onClick={onSecondary} className="w-full sm:w-auto">
              {secondaryText}
            </Button>
          )}
          <Button variant="primary" onClick={onPrimary} className="w-full sm:w-auto">
            {primaryText}
          </Button>
        </div>
      </div>
    </div>
  )
}
