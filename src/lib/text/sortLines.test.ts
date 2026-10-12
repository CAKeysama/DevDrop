import { describe, expect, it } from 'vitest'
import { sortLines, type SortOptions } from './sortLines'

const base: SortOptions = {
  order: 'asc',
  ignoreCase: true,
  ignoreAccents: false,
  numeric: true,
  removeDuplicates: false,
  skipEmpty: true,
  trimLines: true,
}
const sort = (text: string, options: Partial<SortOptions> = {}) => sortLines(text, { ...base, ...options })

describe('sortLines', () => {
  it('sorts in Portuguese order, with accents and the cedilla in their place', () => {
    expect(sort('z\nç\nc\né\ne').lines).toEqual(['c', 'ç', 'e', 'é', 'z'])
  })

  it('sorts by the letter, not by case', () => {
    expect(sort('banana\nAbacaxi\ncereja\nabacate').lines).toEqual(['abacate', 'Abacaxi', 'banana', 'cereja'])
  })

  it('sorts descending', () => {
    expect(sort('a\nc\nb', { order: 'desc' }).lines).toEqual(['c', 'b', 'a'])
  })

  it('puts numbers in natural order, or by characters when asked', () => {
    expect(sort('item 10\nitem 2\nitem 1').lines).toEqual(['item 1', 'item 2', 'item 10'])
    expect(sort('item 10\nitem 2\nitem 1', { numeric: false }).lines).toEqual(['item 1', 'item 10', 'item 2'])
  })

  it('removes duplicates, keeping the first one typed', () => {
    const result = sort('Casa\nbola\ncasa\nCASA', { removeDuplicates: true })
    expect(result.lines).toEqual(['bola', 'Casa'])
    expect(result.removed).toBe(2)
  })

  it('treats a different case or accent as a different line when told to', () => {
    expect(sort('casa\nCasa', { removeDuplicates: true, ignoreCase: false }).lines).toHaveLength(2)
    expect(sort('cafe\ncafé', { removeDuplicates: true }).lines).toHaveLength(2)
    expect(sort('cafe\ncafé', { removeDuplicates: true, ignoreAccents: true }).lines).toEqual(['cafe'])
  })

  it('drops blank lines and trims, both optional', () => {
    expect(sort('b\n\n  \na').lines).toEqual(['a', 'b'])
    expect(sort('b\n\na', { skipEmpty: false }).lines).toEqual(['', 'a', 'b'])
    expect(sort(' b\na', { trimLines: false }).lines).toEqual([' b', 'a'])
  })

  it('understands Windows line breaks and an empty text', () => {
    expect(sort('b\r\na').lines).toEqual(['a', 'b'])
    expect(sort('')).toEqual({ lines: [], removed: 0 })
  })

  it('is stable: equal lines keep the order they came in', () => {
    expect(sort('a1\nA2\na3\nB').lines.slice(0, 3)).toEqual(['a1', 'A2', 'a3'])
  })
})
