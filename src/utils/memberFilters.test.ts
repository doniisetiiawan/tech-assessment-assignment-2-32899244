import { describe, it, expect } from 'vitest'
import { filterMembers } from './memberFilters'
import type { Member } from '../types'

const mockMembers: Member[] = [
  {
    id: 'MEM-2048',
    name: 'Sarah Jenkins',
    email: 'sarah@company.com',
    avatar: null,
    jobTitle: 'Frontend Engineer',
    department: { id: 'DEPT-001', name: 'Engineering' },
    accountStatus: 'active',
    accessLevel: 'full_workspace',
    employmentType: 'full_time_permanent',
    joinedAt: '2022-02-14T00:00:00Z',
  },
  {
    id: 'MEM-2049',
    name: 'Alex Rivera',
    email: 'alex@company.com',
    avatar: null,
    jobTitle: 'Product Designer',
    department: { id: 'DEPT-002', name: 'Design' },
    accountStatus: 'inactive',
    accessLevel: 'read_only',
    employmentType: 'contract',
    joinedAt: '2023-01-01T00:00:00Z',
  },
]

describe('memberFilters', () => {
  it('filters by search query', () => {
    const res = filterMembers(mockMembers, { search: 'sarah', departmentId: 'all', accountStatus: 'all', employmentType: 'all' })
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe('MEM-2048')
  })

  it('filters by department', () => {
    const res = filterMembers(mockMembers, { search: '', departmentId: 'DEPT-002', accountStatus: 'all', employmentType: 'all' })
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe('MEM-2049')
  })

  it('filters by account status', () => {
    const res = filterMembers(mockMembers, { search: '', departmentId: 'all', accountStatus: 'inactive', employmentType: 'all' })
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe('MEM-2049')
  })
})
