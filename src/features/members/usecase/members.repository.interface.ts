import type { Member, MemberDetail, DashboardStats, Department, CurrentUser } from '../../../types'

export interface MembersRepositoryInterface {
  getCurrentUser(): Promise<CurrentUser>
  getDepartments(): Promise<Department[]>
  getMembers(): Promise<{ data: Member[]; total: number }>
  getMemberStats(): Promise<DashboardStats>
  getMemberById(id: string): Promise<MemberDetail>
  createMember(payload: any): Promise<MemberDetail>
  updateMember(id: string, payload: any): Promise<MemberDetail>
  deleteMember(id: string): Promise<{ id: string; name: string }>
  bulkDeleteMembers(memberIds: string[]): Promise<{ deletedCount: number; deletedMembers: { id: string; name: string }[] }>
}
