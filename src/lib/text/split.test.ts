import { describe, expect, it } from 'vitest'
import { splitText, type SplitOptions } from './split'

const base: SplitOptions = { separator: 'comma', custom: '', trim: true, skipEmpty: true }

describe('splitText', () => {
  it('splits by each ready-made separator', () => {
    expect(splitText('a,b,c', base).parts).toEqual(['a', 'b', 'c'])
    expect(splitText('a;b', { ...base, separator: 'semicolon' }).parts).toEqual(['a', 'b'])
    expect(splitText('a b c', { ...base, separator: 'space' }).parts).toEqual(['a', 'b', 'c'])
    expect(splitText('a\tb', { ...base, separator: 'tab' }).parts).toEqual(['a', 'b'])
    expect(splitText('a|b', { ...base, separator: 'pipe' }).parts).toEqual(['a', 'b'])
  })

  it('splits by a custom separator of any length, with escapes', () => {
    expect(splitText('a -- b -- c', { ...base, separator: 'custom', custom: '--' }).parts).toEqual(['a', 'b', 'c'])
    expect(splitText('a\nb\nc', { ...base, separator: 'custom', custom: '\\n' }).parts).toEqual(['a', 'b', 'c'])
  })

  it('trims each part and drops the empty ones, both optional', () => {
    expect(splitText(' a , b ,, c ', base).parts).toEqual(['a', 'b', 'c'])
    expect(splitText(' a , b ,, c ', { ...base, trim: false }).parts).toEqual([' a ', ' b ', ' c '])
    expect(splitText('a,,b', { ...base, skipEmpty: false }).parts).toEqual(['a', '', 'b'])
  })

  it('does not treat a part with only spaces as filled', () => {
    expect(splitText('a,   ,b', { ...base, trim: false }).parts).toEqual(['a', 'b'])
  })

  it('asks for a separator when the custom one is empty', () => {
    expect(splitText('abc', { ...base, separator: 'custom', custom: '' })).toEqual({ parts: [], needsSeparator: true })
  })

  it('returns nothing for an empty text, and one part for a text without the separator', () => {
    expect(splitText('', base)).toEqual({ parts: [], needsSeparator: false })
    expect(splitText('sem virgula', base).parts).toEqual(['sem virgula'])
  })

  it('splits on a multi-line text without losing parts', () => {
    expect(splitText('a,b\nc,d', base).parts).toEqual(['a', 'b\nc', 'd'])
  })
})
