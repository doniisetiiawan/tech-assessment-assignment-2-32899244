import type { Member, MemberDetail, DashboardStats, Department, CurrentUser } from '../../../../types'

export type MemberDto = Member
export type MemberDetailDto = MemberDetail
export type DashboardStatsDto = DashboardStats
export type DepartmentDto = Department
export type CurrentUserDto = CurrentUser

export interface CreateMemberRequestDto {
  name: string
  email: string
  jobTitle: string
  departmentId: string
  accountStatus?: string
  accessLevel?: string
  employmentType?: string
  bio?: string
  avatar?: string | null
}

export interface UpdateMemberRequestDto extends Partial<CreateMemberRequestDto> {}
