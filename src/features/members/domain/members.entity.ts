import type { AccountStatus, AccessLevel, EmploymentType, DepartmentMetrics } from '../../../types'

export class MemberEntity {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly avatar: string | null
  public readonly jobTitle: string
  public readonly department: {
    id: string
    name: string
    metrics?: DepartmentMetrics | null
  }
  public readonly accountStatus: AccountStatus
  public readonly accessLevel: AccessLevel
  public readonly employmentType: EmploymentType
  public readonly bio: string | null
  public readonly joinedAt: string

  constructor(
    id: string,
    name: string,
    email: string,
    avatar: string | null,
    jobTitle: string,
    department: {
      id: string
      name: string
      metrics?: DepartmentMetrics | null
    },
    accountStatus: AccountStatus,
    accessLevel: AccessLevel,
    employmentType: EmploymentType,
    bio: string | null,
    joinedAt: string,
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.avatar = avatar
    this.jobTitle = jobTitle
    this.department = department
    this.accountStatus = accountStatus
    this.accessLevel = accessLevel
    this.employmentType = employmentType
    this.bio = bio
    this.joinedAt = joinedAt
  }
}
