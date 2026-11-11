import { describe, it, expect } from 'vitest'
import { validateEmail } from './validateEmail'

describe('validateEmail', () => {
  it('validates email correctly', () => {
    expect(validateEmail('sarah@company.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
  })
})
