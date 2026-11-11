import React, { useState, useMemo } from 'react'
import { MemberStats } from '../components/organisms/MemberStats'
import { MembersTable } from '../components/organisms/MembersTable'
import { SearchBar } from '../components/molecules/SearchBar'
import { Select } from '../components/atoms/Select'
import { Button } from '../components/atoms/Button'
import { filterMembers } from '../utils/memberFilters'
import { exportMembersCSV } from '../utils/exportCSV'
import type { Member, DashboardStats, Department } from '../types'

interface MembersDirectoryProps {
  members: Member[]
  stats: DashboardStats | null
  departments: Department[]
  onAddMemberClick: () => void
  onEditMember: (member: Member) => void
  onDeleteMember: (member: Member) => void
  onBulkDelete: (ids: string[]) => void
}

export const MembersDirectory: React.FC<MembersDirectoryProps> = ({
  members,
  stats,
  departments,
  onAddMemberClick,
  onEditMember,
  onDeleteMember,
  onBulkDelete,
}) => {
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('all')
  const [accountStatus, setAccountStatus] = useState('all')
  const [employmentType, setEmploymentType] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filteredMembers = useMemo(() => {
    return filterMembers(members, { search, departmentId, accountStatus, employmentType })
  }, [members, search, departmentId, accountStatus, employmentType])

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ]

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ]

  const employmentOptions = [
    { value: 'all', label: 'All Employment Types' },
    { value: 'full_time_permanent', label: 'Full-time Permanent' },
    { value: 'contract', label: 'Contract' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' },
  ]

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredMembers.map((m) => m.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
  }

  const handleExport = () => {
    exportMembersCSV(filteredMembers)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Statistics */}
      <MemberStats stats={stats} />

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Members Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage organization members, departments, access levels, and bulk actions.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedIds.length > 0 && (
            <Button variant="danger" onClick={() => onBulkDelete(selectedIds)}>
              Delete Selected ({selectedIds.length})
            </Button>
          )}
          <Button variant="outline" onClick={handleExport}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={onAddMemberClick}>
            + Add Member
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <Select
          options={departmentOptions}
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        />
        <Select
          options={statusOptions}
          value={accountStatus}
          onChange={(e) => setAccountStatus(e.target.value)}
        />
        <Select
          options={employmentOptions}
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
        />
      </div>

      {/* Table */}
      <MembersTable
        members={filteredMembers}
        selectedIds={selectedIds}
        onSelectOne={handleSelectOne}
        onSelectAll={handleSelectAll}
        onEdit={onEditMember}
        onDelete={onDeleteMember}
        onCopyId={handleCopyId}
      />
    </div>
  )
}
