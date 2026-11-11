import { describe, it, expect } from 'vitest'
import { DepartmentEntity, UserEntity } from './department.entity'

describe('Department and User Entities', () => {
  it('creates department entity correctly', () => {
    const dept = new DepartmentEntity('DEPT-1', 'Engineering', { repositories: 10, deployments: 50 })
    expect(dept.name).toBe('Engineering')
    expect(dept.metrics?.repositories).toBe(10)
  })

  it('creates user entity correctly', () => {
    const user = new UserEntity('USR-1', 'Alex', 'alex@company.com', 'Architect', null)
    expect(user.name).toBe('Alex')
  })
})
