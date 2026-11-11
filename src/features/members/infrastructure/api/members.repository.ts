import type { MembersRepositoryInterface } from '../../usecase/members.repository.interface'
import type { Member, MemberDetail, DashboardStats, Department, CurrentUser, ApiResponse } from '../../../../types'

const API_PREFIX = '/api/v1'

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>
  if (!json.success) {
    const error = new Error(json.message || 'API request failed')
    ;(error as any).status = res.status
    ;(error as any).errors = json.errors
    throw error
  }
  return json.data
}

export class MembersRepository implements MembersRepositoryInterface {
  async getCurrentUser(): Promise<CurrentUser> {
    const res = await fetch(`${API_PREFIX}/auth/me`)
    return handleResponse<CurrentUser>(res)
  }

  async getDepartments(): Promise<Department[]> {
    const res = await fetch(`${API_PREFIX}/departments`)
    return handleResponse<Department[]>(res)
  }

  async getMembers(): Promise<{ data: Member[]; total: number }> {
    const res = await fetch(`${API_PREFIX}/members`)
    const json = (await res.json()) as { success: boolean; data: Member[]; meta?: { total: number }; message?: string; errors?: any }
    if (!json.success) {
      const error = new Error(json.message || 'Failed to fetch members')
      ;(error as any).status = res.status
      ;(error as any).errors = json.errors
      throw error
    }
    return { data: json.data, total: json.meta?.total ?? json.data.length }
  }

  async getMemberStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_PREFIX}/members/stats`)
    return handleResponse<DashboardStats>(res)
  }

  async getMemberById(id: string): Promise<MemberDetail> {
    const res = await fetch(`${API_PREFIX}/members/${encodeURIComponent(id)}`)
    return handleResponse<MemberDetail>(res)
  }

  async createMember(payload: any): Promise<MemberDetail> {
    const res = await fetch(`${API_PREFIX}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return handleResponse<MemberDetail>(res)
  }

  async updateMember(id: string, payload: any): Promise<MemberDetail> {
    const res = await fetch(`${API_PREFIX}/members/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return handleResponse<MemberDetail>(res)
  }

  async deleteMember(id: string): Promise<{ id: string; name: string }> {
    const res = await fetch(`${API_PREFIX}/members/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    return handleResponse<{ id: string; name: string }>(res)
  }

  async bulkDeleteMembers(
    memberIds: string[],
  ): Promise<{ deletedCount: number; deletedMembers: { id: string; name: string }[] }> {
    const res = await fetch(`${API_PREFIX}/members/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberIds }),
    })
    return handleResponse<{ deletedCount: number; deletedMembers: { id: string; name: string }[] }>(res)
  }
}
