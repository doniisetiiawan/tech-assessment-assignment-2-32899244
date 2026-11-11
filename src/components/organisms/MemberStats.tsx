import React from 'react'
import { StatCard } from '../molecules/StatCard'
import type { DashboardStats } from '../../types'

interface MemberStatsProps {
  stats: DashboardStats | null
}

export const MemberStats: React.FC<MemberStatsProps> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <StatCard
        title="Total Members"
        value={stats.totalMembers}
        subtitle="Across all departments"
      />
      <StatCard
        title="Active Now"
        value={stats.activeNow}
        subtitle={`${stats.activePercentage}% live activity rate`}
      />
      <StatCard
        title="Departments"
        value={stats.departments}
        subtitle="Active internal teams"
      />
      <StatCard
        title="Pending / Expiring"
        value={`${stats.pendingInvites} / ${stats.expiringSoon}`}
        subtitle="Pending members & expiring accounts"
      />
    </div>
  )
}
