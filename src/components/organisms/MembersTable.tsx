import React from 'react'
import { Avatar } from '../atoms/Avatar'
import { Badge } from '../atoms/Badge'
import { Checkbox } from '../atoms/Checkbox'
import type { Member } from '../../types'

interface MembersTableProps {
  members: Member[]
  selectedIds: string[]
  onSelectOne: (id: string) => void
  onSelectAll: (checked: boolean) => void
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
  onCopyId: (id: string) => void
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  selectedIds,
  onSelectOne,
  onSelectAll,
  onEdit,
  onDelete,
  onCopyId,
}) => {
  const allSelected = members.length > 0 && members.every((m) => selectedIds.includes(m.id))
  const someSelected = members.some((m) => selectedIds.includes(m.id)) && !allSelected

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 pl-4 pr-3 w-10">
                <Checkbox
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="py-3.5 px-3">Member</th>
              <th className="py-3.5 px-3">Job Title</th>
              <th className="py-3.5 px-3">Department</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Employment Type</th>
              <th className="py-3.5 pl-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {members.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No members found matching your filters.
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const isSelected = selectedIds.includes(member.id)
                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <td className="py-4 pl-4 pr-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onSelectOne(member.id)}
                      />
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={member.avatar} name={member.name} size="sm" />
                        <div>
                          <button
                            onClick={() => onEdit(member)}
                            className="font-semibold text-slate-900 hover:text-indigo-600 text-left transition-colors"
                          >
                            {member.name}
                          </button>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{member.email}</span>
                            <span>•</span>
                            <button
                              onClick={() => onCopyId(member.id)}
                              className="text-indigo-600 hover:underline font-mono"
                              title="Copy ID"
                            >
                              {member.id}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-700 font-medium">{member.jobTitle}</td>
                    <td className="py-4 px-3 text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {member.department?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <Badge variant="status" status={member.accountStatus} />
                    </td>
                    <td className="py-4 px-3">
                      <Badge variant="employment" employmentType={member.employmentType} />
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(member)}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(member)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
