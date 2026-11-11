import React from 'react'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const cbId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          ref={ref}
          id={cbId}
          className={`h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={cbId} className="text-sm text-slate-700 cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
