import type { Member } from '../types'

export interface FilterOptions {
  search: string
  departmentId: string
  accountStatus: string
  employmentType: string
}

export function filterMembers(members: Member[], filters: FilterOptions): Member[] {
  const query = filters.search.toLowerCase().trim()
  return members.filter((m) => {
    // Search match: name, email, jobTitle
    if (query) {
      const matchName = m.name.toLowerCase().includes(query)
      const matchEmail = m.email.toLowerCase().includes(query)
      const matchJob = m.jobTitle.toLowerCase().includes(query)
      if (!matchName && !matchEmail && !matchJob) return false
    }

    // Department filter
    if (filters.departmentId && filters.departmentId !== 'all') {
      if (m.department.id !== filters.departmentId) return false
    }

    // Account Status filter
    if (filters.accountStatus && filters.accountStatus !== 'all') {
      if (m.accountStatus !== filters.accountStatus) return false
    }

    // Employment Type filter
    if (filters.employmentType && filters.employmentType !== 'all') {
      if (m.employmentType !== filters.employmentType) return false
    }

    return true
  })
}
