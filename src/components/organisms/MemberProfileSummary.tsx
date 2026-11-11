import React from 'react'
import { Avatar } from '../atoms/Avatar'
import { Badge } from '../atoms/Badge'
import type { MemberDetail } from '../../types'

interface MemberProfileSummaryProps {
  member: MemberDetail
  onCopyId: (id: string) => void
}

export const MemberProfileSummary: React.FC<MemberProfileSummaryProps> = ({ member, onCopyId }) => {
  const metrics = member.department?.metrics

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <Avatar src={member.avatar} name={member.name} size="lg" />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
              <Badge variant="status" status={member.accountStatus} />
              <Badge variant="employment" employmentType={member.employmentType} />
            </div>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{member.jobTitle}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span>{member.email}</span>
              <span>•</span>
              <button
                onClick={() => onCopyId(member.id)}
                className="text-indigo-600 hover:underline font-mono font-medium"
              >
                ID: {member.id}
              </button>
              <span>•</span>
              <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Metrics (Belonging to Department per spec §6) */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Department Repositories ({member.department?.name || 'Unassigned'})
          </span>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {metrics ? metrics.repositories : 'N/A'}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Synced from department repository registry</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Department Deployments ({member.department?.name || 'Unassigned'})
          </span>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {metrics ? metrics.deployments.toLocaleString() : 'N/A'}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Synced from CI/CD deployment pipeline</p>
        </div>
      </div>
    </div>
  )
}
