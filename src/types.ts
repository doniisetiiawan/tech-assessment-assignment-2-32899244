export type AccountStatus = 'active' | 'inactive' | 'suspended'
export type AccessLevel = 'full_workspace' | 'limited_workspace' | 'read_only'
export type EmploymentType =
  | 'full_time_permanent'
  | 'contract'
  | 'part_time'
  | 'temporary'
  | 'internship'
  | 'freelance'

export interface DepartmentMetrics {
  repositories: number
  deployments: number
}

export interface Department {
  id: string
  name: string
  metrics: DepartmentMetrics | null
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  jobTitle: string
  avatar: string | null
}

export interface Member {
  id: string
  name: string
  email: string
  avatar: string | null
  jobTitle: string
  department: {
    id: string
    name: string
    metrics?: DepartmentMetrics | null
  }
  accountStatus: AccountStatus
  accessLevel: AccessLevel
  employmentType: EmploymentType
  bio?: string | null
  joinedAt: string
}

export interface MemberDetail extends Member {
  bio: string | null
  department: {
    id: string
    name: string
    metrics?: DepartmentMetrics | null
  }
}

export interface DashboardStats {
  totalMembers: number
  activeNow: number
  departments: number
  pendingInvites: number
  newMembersThisMonth: number
  activePercentage: number
  expiringSoon: number
}

export interface ApiSuccessResponse<T> {
  success: true
  message?: string
  data: T
  meta?: {
    total?: number
  }
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
