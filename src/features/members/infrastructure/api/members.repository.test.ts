import { describe, it, expect } from 'vitest'
import { MembersRepository } from './members.repository'

describe('MembersRepository', () => {
  it('instantiates repository correctly', () => {
    const repo = new MembersRepository()
    expect(repo).toBeDefined()
    expect(repo.getMembers).toBeTypeOf('function')
  })
})
