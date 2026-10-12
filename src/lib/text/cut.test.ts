import { describe, expect, it } from 'vitest'
import { cutText, parseCount, type CutOptions } from './cut'

const base: CutOptions = { unit: 'characters', mode: 'first', count: 5, from: 1, to: 5, perLine: false, ellipsis: false }
const cut = (text: string, options: Partial<CutOptions> = {}) => cutText(text, { ...base, ...options })

describe('parseCount', () => {
  it('accepts whole numbers from 1 up, with spaces around', () => {
    expect(parseCount('10')).toBe(10)
    expect(parseCount(' 3 ')).toBe(3)
  })

  it('refuses everything else', () => {
    for (const value of ['', '0', '-2', '1.5', '1,5', 'abc', '2e3', '99999999999999999999']) expect(parseCount(value), value).toBeNull()
  })
})

describe('cutText by characters', () => {
  it('keeps the first N, the last N, or a range', () => {
    expect(cut('Olá, mundo!').output).toBe('Olá, ')
    expect(cut('Olá, mundo!', { mode: 'last', count: 6 }).output).toBe('mundo!')
    expect(cut('Olá, mundo!', { mode: 'range', from: 6, to: 10 }).output).toBe('mundo')
  })

  it('counts a visible character as one: emoji and accents stay whole', () => {
    expect(cut('🚀👨‍👩‍👧xyz', { count: 2 }).output).toBe('🚀👨‍👩‍👧')
    expect(cut('éa', { count: 1 }).output).toBe('é')
  })

  it('reports how many were kept out of how many', () => {
    expect(cut('Olá, mundo!')).toMatchObject({ kept: 5, total: 11 })
  })

  it('keeps the whole text when it is shorter than the count', () => {
    expect(cut('oi', { count: 50 })).toMatchObject({ output: 'oi', kept: 2, total: 2 })
    expect(cut('oi', { mode: 'last', count: 50 }).output).toBe('oi')
  })

  it('returns nothing when the range starts after the end', () => {
    expect(cut('abc', { mode: 'range', from: 10, to: 12 }).output).toBe('')
  })
})

describe('cutText by words', () => {
  it('keeps words, joined by one space', () => {
    expect(cut('um  dois\ntrês quatro', { unit: 'words', count: 3 }).output).toBe('um dois três')
    expect(cut('um dois três quatro', { unit: 'words', mode: 'last', count: 2 }).output).toBe('três quatro')
    expect(cut('um dois três quatro', { unit: 'words', mode: 'range', from: 2, to: 3 }).output).toBe('dois três')
  })
})

describe('ellipsis', () => {
  it('marks only the sides where something was cut', () => {
    expect(cut('abcdefghij', { ellipsis: true }).output).toBe('abcde…')
    expect(cut('abcdefghij', { mode: 'last', count: 3, ellipsis: true }).output).toBe('…hij')
    expect(cut('abcdefghij', { mode: 'range', from: 3, to: 5, ellipsis: true }).output).toBe('…cde…')
    expect(cut('abcdefghij', { mode: 'range', from: 1, to: 10, ellipsis: true }).output).toBe('abcdefghij')
  })

  it('adds nothing when nothing was cut', () => {
    expect(cut('abc', { ellipsis: true }).output).toBe('abc')
  })
})

describe('cutText per line', () => {
  it('cuts each line on its own and keeps the line breaks', () => {
    expect(cut('abcdefg\nhijklmn\nxy', { count: 3, perLine: true }).output).toBe('abc\nhij\nxy')
  })

  it('sums what was kept across the lines', () => {
    expect(cut('abcdefg\nhijklmn', { count: 3, perLine: true })).toMatchObject({ kept: 6, total: 14 })
  })

  it('cuts across lines when not per line, counting the line break as a character', () => {
    expect(cut('abc\ndef', { count: 5 }).output).toBe('abc\nd')
  })
})

describe('cutText errors', () => {
  it('asks for a valid number', () => {
    expect(cut('abc', { count: null }).error).toMatch(/número inteiro/)
    expect(cut('abc', { mode: 'range', from: null }).error).toMatch(/número inteiro/)
  })

  it('refuses a range that ends before it starts', () => {
    expect(cut('abc', { mode: 'range', from: 5, to: 2 }).error).toMatch(/início não pode ser maior/)
  })

  it('handles an empty text', () => {
    expect(cut('')).toEqual({ output: '', kept: 0, total: 0 })
  })
})
