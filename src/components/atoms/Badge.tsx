import React from 'react'
import type { AccountStatus, EmploymentType } from '../../types'

interface BadgeProps {
  status?: AccountStatus | string
  employmentType?: EmploymentType | string
  children?: React.ReactNode
  variant?: 'status' | 'employment' | 'default'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  employmentType,
  children,
  variant = 'default',
  className = '',
}) => {
  let bg = 'bg-slate-100 text-slate-700'
  let label = children

  if (variant === 'status' || status) {
    const s = status || children
    if (s === 'active') {
      bg = 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
      label = 'Active'
    } else if (s === 'inactive') {
      bg = 'bg-amber-50 text-amber-700 border border-amber-200/60'
      label = 'Inactive'
    } else if (s === 'suspended') {
      bg = 'bg-rose-50 text-rose-700 border border-rose-200/60'
      label = 'Suspended'
    }
  } else if (variant === 'employment' || employmentType) {
    bg = 'bg-indigo-50 text-indigo-700 border border-indigo-100'
    const et = employmentType || children
    if (et === 'full_time_permanent') label = 'Full-time Permanent'
    else if (et === 'contract') label = 'Contract'
    else if (et === 'part_time') label = 'Part-time'
    else if (et === 'temporary') label = 'Temporary'
    else if (et === 'internship') label = 'Internship'
    else if (et === 'freelance') label = 'Freelance'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${bg} ${className}`}
    >
      {label}
    </span>
  )
}
