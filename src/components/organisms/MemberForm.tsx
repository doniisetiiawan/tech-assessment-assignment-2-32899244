import React, { useState } from 'react'
import { Input } from '../atoms/Input'
import { Select } from '../atoms/Select'
import { Button } from '../atoms/Button'
import type { Department, MemberDetail, AccountStatus, AccessLevel, EmploymentType } from '../../types'

interface MemberFormProps {
  initialData?: MemberDetail | null
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

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'full_time_permanent', label: 'Full-time Permanent' },
  { value: 'contract', label: 'Contract' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
]

const ACCOUNT_STATUS_OPTIONS = [
  { value: 'active:full_workspace', label: 'Active – Full Workspace Access' },
  { value: 'active:limited_workspace', label: 'Active – Limited Workspace Access' },
  { value: 'active:read_only', label: 'Active – Read Only Access' },
  { value: 'inactive:read_only', label: 'Inactive – Pending Activation' },
  { value: 'suspended:read_only', label: 'Suspended – Account Locked' },
]

export const MemberForm: React.FC<MemberFormProps> = ({
  initialData,
  departments,
  onSubmit,
  onCancel,
  loading = false,
  serverErrors = {},
}) => {
  const [name, setName] = useState(initialData?.name || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '')
  const [departmentId, setDepartmentId] = useState(
    initialData?.department?.id || departments[0]?.id || '',
  )
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    initialData?.employmentType || 'full_time_permanent',
  )
  const [accountStatusCombo, setAccountStatusCombo] = useState<string>(() => {
    if (initialData) {
      return `${initialData.accountStatus}:${initialData.accessLevel}`
    }
    return 'active:full_workspace'
  })
  const [bio, setBio] = useState(initialData?.bio || '')
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

  const departmentOptions = departments.map((d) => ({ value: d.id, label: d.name }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Full name is required.'
    if (!email.trim()) errs.email = 'Work email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format.'
    if (!jobTitle.trim()) errs.jobTitle = 'Job title is required.'
    if (!departmentId) errs.departmentId = 'Department is required.'

    if (Object.keys(errs).length > 0) {
      setClientErrors(errs)
      return
    }
    setClientErrors({})

    const [accountStatus, accessLevel] = accountStatusCombo.split(':') as [
      AccountStatus,
      AccessLevel,
    ]

    await onSubmit({
      name,
      email,
      jobTitle,
      departmentId,
      accountStatus,
      accessLevel,
      employmentType,
      bio,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="e.g. Sarah Jenkins"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={clientErrors.name || serverErrors.name?.[0]}
        />
        <Input
          label="Work Email"
          type="email"
          placeholder="e.g. sarah.jenkins@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={clientErrors.email || serverErrors.email?.[0]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Job Title"
          placeholder="e.g. Staff Frontend Engineer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          error={clientErrors.jobTitle || serverErrors.jobTitle?.[0]}
        />
        <Select
          label="Department"
          options={departmentOptions}
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          error={clientErrors.departmentId || serverErrors.departmentId?.[0]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Select
          label="Account Status & Access Level"
          options={ACCOUNT_STATUS_OPTIONS}
          value={accountStatusCombo}
          onChange={(e) => setAccountStatusCombo(e.target.value)}
        />
        <Select
          label="Employment Type"
          options={EMPLOYMENT_TYPE_OPTIONS}
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Bio & Administrative Notes
        </label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Optional notes or biography..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Member'}
        </Button>
      </div>
    </form>
  )
}
