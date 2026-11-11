import type { Member } from '../types'

export function exportMembersCSV(members: Member[], filename = 'members-export.csv') {
  const headers = [
    'Member ID',
    'Name',
    'Email',
    'Job Title',
    'Department',
    'Account Status',
    'Employment Type',
    'Joined Date',
  ]

  const rows = members.map((m) => [
    m.id,
    `"${m.name.replace(/"/g, '""')}"`,
    `"${m.email.replace(/"/g, '""')}"`,
    `"${m.jobTitle.replace(/"/g, '""')}"`,
    `"${m.department.name.replace(/"/g, '""')}"`,
    m.accountStatus,
    m.employmentType,
    m.joinedAt,
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
