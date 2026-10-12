import { describe, expect, it } from 'vitest'
import { splitChips } from './chips'

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

describe('splitChips', () => {
  it('shows every chip of a small category, up to six', () => {
    for (const n of [0, 1, 4, 6]) expect(splitChips(range(n))).toEqual({ visible: range(n), hidden: 0 })
  })

  it('collapses a big category to four chips and counts the rest', () => {
    expect(splitChips(range(7))).toEqual({ visible: [0, 1, 2, 3], hidden: 3 })
    expect(splitChips(range(14))).toEqual({ visible: [0, 1, 2, 3], hidden: 10 })
  })
})
