import { describe, expect, it } from 'vitest'
import { secureRandomInt } from './random'

describe('secureRandomInt', () => {
  it('stays in range and covers it', () => {
    const seen = new Set<number>()
    for (let i = 0; i < 2000; i++) {
      const n = secureRandomInt(7)
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(7)
      seen.add(n)
    }
    expect(seen.size).toBe(7)
    expect(() => secureRandomInt(0)).toThrow()
  })
})
