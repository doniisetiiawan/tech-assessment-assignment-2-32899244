import { MembersRepository } from '../features/members/infrastructure/api/members.repository'
import type { CurrentUser, Department, DashboardStats, Member, MemberDetail } from '../types'

const repo = new MembersRepository()

export async function getCurrentUser(): Promise<CurrentUser> {
  return repo.getCurrentUser()
}

export async function getDepartments(): Promise<Department[]> {
  return repo.getDepartments()
}

export async function getMembers(): Promise<{ data: Member[]; total: number }> {
  return repo.getMembers()
}

export async function getMemberStats(): Promise<DashboardStats> {
  return repo.getMemberStats()
}

export async function getMemberById(id: string): Promise<MemberDetail> {
  return repo.getMemberById(id)
}

export async function createMember(payload: any): Promise<MemberDetail> {
  return repo.createMember(payload)
}

export async function updateMember(id: string, payload: any): Promise<MemberDetail> {
  return repo.updateMember(id, payload)
}

export async function deleteMember(id: string): Promise<{ id: string; name: string }> {
  return repo.deleteMember(id)
}

export async function bulkDeleteMembers(
  memberIds: string[],
): Promise<{ deletedCount: number; deletedMembers: { id: string; name: string }[] }> {
  return repo.bulkDeleteMembers(memberIds)
}
