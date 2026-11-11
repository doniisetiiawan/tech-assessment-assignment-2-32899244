import { describe, it, expect, vi } from 'vitest'
import { MembersController } from './members.controller'

describe('MembersController', () => {
  it('instantiates controller and calls usecase correctly', async () => {
    const mockUsecase: any = {
      loadDashboard: vi.fn().mockResolvedValue({ total: 5 }),
    }
    const controller = new MembersController(mockUsecase)
    const res = await controller.getDashboardData()
    expect(res.total).toBe(5)
    expect(mockUsecase.loadDashboard).toHaveBeenCalled()
  })
})
