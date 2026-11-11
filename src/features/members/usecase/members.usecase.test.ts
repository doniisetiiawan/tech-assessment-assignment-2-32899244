import { describe, it, expect, vi } from 'vitest'
import { MembersUseCase } from './members.usecase'
import type { MembersRepositoryInterface } from './members.repository.interface'

describe('MembersUseCase', () => {
  it('loads dashboard data correctly using repository', async () => {
    const mockRepo: MembersRepositoryInterface = {
      getCurrentUser: vi.fn().mockResolvedValue({ id: 'USR-1', name: 'Alex' }),
      getDepartments: vi.fn().mockResolvedValue([{ id: 'D1', name: 'Eng' }]),
      getMembers: vi.fn().mockResolvedValue({ data: [{ id: 'M1' }], total: 1 }),
      getMemberStats: vi.fn().mockResolvedValue({ totalMembers: 1 }),
      getMemberById: vi.fn(),
      createMember: vi.fn(),
      updateMember: vi.fn(),
      deleteMember: vi.fn(),
      bulkDeleteMembers: vi.fn(),
    }

    const usecase = new MembersUseCase(mockRepo)
    const result = await usecase.loadDashboard()

    expect(result.currentUser.name).toBe('Alex')
    expect(result.departments).toHaveLength(1)
    expect(result.members).toHaveLength(1)
    expect(result.stats.totalMembers).toBe(1)
  })
})
