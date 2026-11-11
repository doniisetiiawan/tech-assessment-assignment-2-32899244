import type { MembersRepositoryInterface } from './members.repository.interface'
import type { Member, MemberDetail, DashboardStats, Department, CurrentUser } from '../../../types'

export class MembersUseCase {
  private readonly repo: MembersRepositoryInterface

  constructor(repo: MembersRepositoryInterface) {
    this.repo = repo
  }

  async loadDashboard(): Promise<{
    currentUser: CurrentUser
    departments: Department[]
    members: Member[]
    stats: DashboardStats
    total: number
  }> {
    const [currentUser, departments, membersRes, stats] = await Promise.all([
      this.repo.getCurrentUser(),
      this.repo.getDepartments(),
      this.repo.getMembers(),
      this.repo.getMemberStats(),
    ])

    return {
      currentUser,
      departments,
      members: membersRes.data,
      total: membersRes.total,
      stats,
    }
  }

  async getMemberDetail(id: string): Promise<MemberDetail> {
    return this.repo.getMemberById(id)
  }

  async createNewMember(payload: any): Promise<MemberDetail> {
    return this.repo.createMember(payload)
  }

  async updateExistingMember(id: string, payload: any): Promise<MemberDetail> {
    return this.repo.updateMember(id, payload)
  }

  async removeMember(id: string): Promise<{ id: string; name: string }> {
    return this.repo.deleteMember(id)
  }

  async removeMultipleMembers(ids: string[]): Promise<{ deletedCount: number; deletedMembers: { id: string; name: string }[] }> {
    return this.repo.bulkDeleteMembers(ids)
  }
}
