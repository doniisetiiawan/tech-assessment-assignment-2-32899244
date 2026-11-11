import React from 'react'
import { Avatar } from '../atoms/Avatar'
import type { CurrentUser } from '../../types'

interface TopNavigationProps {
  currentUser: CurrentUser | null
  activeTab: 'directory' | 'add'
  onTabChange: (tab: 'directory' | 'add') => void
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentUser,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">
              MM
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Members Hub</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('directory')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'directory'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Directory
            </button>
            <button
              onClick={() => onTabChange('add')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'add'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Add Member
            </button>
          </nav>
        </div>

        {currentUser && (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500">{currentUser.jobTitle}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
