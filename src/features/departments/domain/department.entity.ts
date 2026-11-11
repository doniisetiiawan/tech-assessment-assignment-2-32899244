export class DepartmentEntity {
  public readonly id: string
  public readonly name: string
  public readonly metrics: { repositories: number; deployments: number } | null

  constructor(
    id: string,
    name: string,
    metrics: { repositories: number; deployments: number } | null,
  ) {
    this.id = id
    this.name = name
    this.metrics = metrics
  }
}

export class UserEntity {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly jobTitle: string
  public readonly avatar: string | null

  constructor(
    id: string,
    name: string,
    email: string,
    jobTitle: string,
    avatar: string | null,
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.jobTitle = jobTitle
    this.avatar = avatar
  }
}
