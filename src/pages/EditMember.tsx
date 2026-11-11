import React from 'react'
import { MemberProfileSummary } from '../components/organisms/MemberProfileSummary'
import { MemberForm } from '../components/organisms/MemberForm'
import { Button } from '../components/atoms/Button'
import type { Department, MemberDetail, AccountStatus, AccessLevel, EmploymentType } from '../types'

interface EditMemberProps {
  member: MemberDetail
  departments: Department[]
  onSubmit: (formData: {
    name: string
    email: string
    jobTitle: string
    departmentId: string
    accountStatus: AccountStatus
    accessLevel: AccessLevel
    employmentType: EmploymentType
    bio: string
  }) => Promise<void>
  onCancel: () => void
  onCopyId: (id: string) => void
  loading?: boolean
  serverErrors?: Record<string, string[]>
}

export const EditMember: React.FC<EditMemberProps> = ({
  member,
  departments,
  onSubmit,
  onCancel,
  onCopyId,
  loading,
  serverErrors,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onCancel}>
          ← Back to Directory
        </Button>
      </div>

      {/* Profile Summary Card (showing department metrics per spec §6 & §8) */}
      <MemberProfileSummary member={member} onCopyId={onCopyId} />

      {/* Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="mb-6 pb-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Member Profile</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Update personal details, job title, department assignment, or workspace access.
          </p>
        </div>

        <MemberForm
          initialData={member}
          departments={departments}
          onSubmit={onSubmit}
          onCancel={onCancel}
          loading={loading}
          serverErrors={serverErrors}
        />
      </div>
    </div>
  )
}
