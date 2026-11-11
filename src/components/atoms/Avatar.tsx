import React from 'react'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/)
    if (parts.length >= 2) {
      return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
    }
    return str.slice(0, 2).toUpperCase()
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  }[size]

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover bg-slate-200 ${sizeClasses} ${className}`}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
