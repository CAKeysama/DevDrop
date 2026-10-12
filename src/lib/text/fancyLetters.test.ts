import { describe, expect, it } from 'vitest'
import { applyStyle, fancyStyles } from './fancyLetters'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const style = (id: string) => fancyStyles.find((item) => item.id === id)!

describe('every style against the Unicode data', () => {
  it.each(fancyStyles.map((item) => [item.id, item] as const))('%s: every letter and digit maps to an assigned character', (_, item) => {
    for (const character of LETTERS + DIGITS) {
      const result = item.apply(character)
      // An unassigned code point is a hole in the alphabet: it would show as an empty box.
      expect(/\p{Cn}/u.test(result), `${item.id}: ${character} -> U+${result.codePointAt(0)!.toString(16)}`).toBe(false)
      // The combining marks keep the letter and add to it; the others replace it.
      if (!['strikethrough', 'underline'].includes(item.id)) expect([...result], `${item.id}: ${character}`).toHaveLength(1)
    }
  })

  it.each(fancyStyles.map((item) => [item.id, item] as const))('%s: two different letters never collide', (_, item) => {
    const results = [...LETTERS].map((character) => item.apply(character))
    // Small caps has no x, so it keeps the plain one; otherwise it would collide with nothing anyway.
    expect(new Set(results).size).toBe(results.length)
  })
})

describe('the gaps in the alphabets are filled from Letterlike Symbols', () => {
  it('italic h', () => expect(style('italic').apply('h')).toBe('ℎ'))
  it('script capitals and lowercase', () => {
    const script = style('script')
    expect(['B', 'E', 'F', 'H', 'I', 'L', 'M', 'R'].map((letter) => script.apply(letter))).toEqual(['ℬ', 'ℰ', 'ℱ', 'ℋ', 'ℐ', 'ℒ', 'ℳ', 'ℛ'])
    expect(['e', 'g', 'o'].map((letter) => script.apply(letter))).toEqual(['ℯ', 'ℊ', 'ℴ'])
  })
  it('fraktur and double-struck', () => {
    expect(['C', 'H', 'I', 'R', 'Z'].map((letter) => style('fraktur').apply(letter))).toEqual(['ℭ', 'ℌ', 'ℑ', 'ℜ', 'ℨ'])
    expect(['C', 'H', 'N', 'P', 'Q', 'R', 'Z'].map((letter) => style('double-struck').apply(letter))).toEqual(['ℂ', 'ℍ', 'ℕ', 'ℙ', 'ℚ', 'ℝ', 'ℤ'])
  })
})

describe('applyStyle', () => {
  it('styles letters and digits, leaving the rest alone', () => {
    expect(applyStyle('Ab 1!', style('bold'))).toBe('\u{1D400}\u{1D41B} \u{1D7CF}!')
  })

  it('keeps an accent on top of the styled letter', () => {
    const result = applyStyle('é', style('bold'))
    expect([...result]).toEqual(['\u{1D41E}', '́'])
  })

  it('keeps the accent in every style, including the ones that add a mark', () => {
    for (const item of fancyStyles) {
      const result = applyStyle('ã', item)
      expect(result, item.id).toContain('̃')
    }
    expect([...applyStyle('é', style('strikethrough'))]).toEqual(['e', '̶', '́'])
  })

  it('keeps a cedilla and a family emoji whole', () => {
    expect(applyStyle('ç', style('bold'))).toBe('\u{1D41C}̧')
    expect(applyStyle('👨‍👩‍👧', style('bold'))).toBe('👨‍👩‍👧')
  })

  it('leaves characters a style does not cover as they are', () => {
    expect(applyStyle('ação 🚀', style('italic'))).toContain('🚀')
    expect(applyStyle('1 2', style('italic'))).toBe('1 2')
  })

  it('circles digits, writes full width and small capitals', () => {
    expect(applyStyle('a1', style('circled'))).toBe('ⓐ①')
    expect(applyStyle('A 1', style('fullwidth'))).toBe('Ａ　１')
    expect(applyStyle('abc', style('small-caps'))).toBe('ᴀʙᴄ')
  })

  it('strikes and underlines every visible character, not the spaces', () => {
    expect(applyStyle('a b', style('strikethrough'))).toBe('a̶ b̶')
    expect(applyStyle('a b', style('underline'))).toBe('a̲ b̲')
  })

  it('returns an empty text for an empty input', () => {
    for (const item of fancyStyles) expect(applyStyle('', item)).toBe('')
  })
})
