import React from 'react'
import { MemberForm } from '../components/organisms/MemberForm'
import type { Department, AccountStatus, AccessLevel, EmploymentType } from '../types'

interface AddMemberProps {
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
  loading?: boolean
  serverErrors?: Record<string, string[]>
}

export const AddMember: React.FC<AddMemberProps> = ({
  departments,
  onSubmit,
  onCancel,
  loading,
  serverErrors,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="mb-6 pb-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Member</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create a new member profile and assign workspace access and department.
          </p>
        </div>

        <MemberForm
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
