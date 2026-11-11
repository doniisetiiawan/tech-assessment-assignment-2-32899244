import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  trendUp?: boolean
  icon?: React.ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendUp,
  icon,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {icon && (
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-3xl font-bold tracking-tight text-slate-900">{value}</div>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
}
