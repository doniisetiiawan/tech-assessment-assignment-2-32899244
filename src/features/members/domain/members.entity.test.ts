import { describe, it, expect } from 'vitest'
import { MemberEntity } from './members.entity'

describe('MemberEntity', () => {
  it('instantiates member entity correctly', () => {
    const entity = new MemberEntity(
      'MEM-1',
      'Sarah',
      'sarah@company.com',
      null,
      'Engineer',
      { id: 'DEPT-1', name: 'Engineering' },
      'active',
      'full_workspace',
      'full_time_permanent',
      null,
      '2022-01-01',
    )
    expect(entity.id).toBe('MEM-1')
    expect(entity.email).toBe('sarah@company.com')
  })
})
