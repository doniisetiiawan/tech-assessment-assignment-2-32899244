import { MembersUseCase } from '../usecase/members.usecase'
import { MembersRepository } from '../infrastructure/api/members.repository'
import type { CurrentUser, DashboardStats, Department, Member, MemberDetail, AccountStatus, AccessLevel, EmploymentType } from '../../../types'

export class MembersController {
  private readonly usecase: MembersUseCase

  constructor(usecase?: MembersUseCase) {
    this.usecase = usecase || new MembersUseCase(new MembersRepository())
  }

  async getDashboardData(): Promise<{
    currentUser: CurrentUser
    departments: Department[]
    members: Member[]
    stats: DashboardStats
    total: number
  }> {
    return this.usecase.loadDashboard()
  }

  async createMember(payload: {
    name: string
    email: string
    jobTitle: string
    departmentId: string
    accountStatus: AccountStatus
    accessLevel: AccessLevel
    employmentType: EmploymentType
    bio: string
  }): Promise<MemberDetail> {
    return this.usecase.createNewMember(payload)
  }

  async updateMember(id: string, payload: any): Promise<MemberDetail> {
    return this.usecase.updateExistingMember(id, payload)
  }

  async deleteMember(id: string): Promise<{ id: string; name: string }> {
    return this.usecase.removeMember(id)
  }

  async bulkDeleteMembers(ids: string[]): Promise<{ deletedCount: number; deletedMembers: { id: string; name: string }[] }> {
    return this.usecase.removeMultipleMembers(ids)
  }

  async getMemberDetail(id: string): Promise<MemberDetail> {
    return this.usecase.getMemberDetail(id)
  }
}
