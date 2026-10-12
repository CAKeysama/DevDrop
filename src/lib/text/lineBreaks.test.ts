import { describe, expect, it } from 'vitest'
import { unescapeText } from './escapes'
import { replaceLineBreaks, type LineBreakOptions } from './lineBreaks'

const base: LineBreakOptions = { mode: 'space', custom: '', skipEmpty: true, trimLines: false }

describe('unescapeText', () => {
  it('turns \\n, \\t and \\\\ into the real characters', () => {
    expect(unescapeText('a\\nb')).toBe('a\nb')
    expect(unescapeText('a\\tb')).toBe('a\tb')
    expect(unescapeText('a\\\\nb')).toBe('a\\nb')
  })

  it('leaves other backslashes alone', () => {
    expect(unescapeText('C:\\pasta\\arquivo')).toBe('C:\\pasta\\arquivo')
    expect(unescapeText('sem barra')).toBe('sem barra')
  })
})

describe('replaceLineBreaks', () => {
  it('joins the lines with a space', () => {
    expect(replaceLineBreaks('um\ndois\ntrês', base)).toEqual({ output: 'um dois três', breaks: 2 })
  })

  it('removes the breaks without a separator', () => {
    expect(replaceLineBreaks('um\ndois', { ...base, mode: 'remove' }).output).toBe('umdois')
  })

  it('uses a custom separator, with escapes', () => {
    expect(replaceLineBreaks('a\nb\nc', { ...base, mode: 'custom', custom: ', ' }).output).toBe('a, b, c')
    expect(replaceLineBreaks('a\nb', { ...base, mode: 'custom', custom: '\\n\\n' }).output).toBe('a\n\nb')
  })

  it('understands every kind of line break', () => {
    expect(replaceLineBreaks('a\r\nb\rc\nd\u2028e\u2029f', base)).toEqual({ output: 'a b c d e f', breaks: 5 })
  })

  it('skips blank lines when asked, so no double separator is left', () => {
    expect(replaceLineBreaks('a\n\n\nb\n', base).output).toBe('a b')
    expect(replaceLineBreaks('a\n   \nb', base).output).toBe('a b')
  })

  it('keeps blank lines as empty slots when not skipping them', () => {
    expect(replaceLineBreaks('a\n\nb', { ...base, skipEmpty: false }).output).toBe('a  b')
  })

  it('trims each line only when asked', () => {
    expect(replaceLineBreaks('  a  \n  b', base).output).toBe('  a     b')
    expect(replaceLineBreaks('  a  \n  b', { ...base, trimLines: true }).output).toBe('a b')
  })

  it('handles an empty text and a text without breaks', () => {
    expect(replaceLineBreaks('', base)).toEqual({ output: '', breaks: 0 })
    expect(replaceLineBreaks('uma linha só', base)).toEqual({ output: 'uma linha só', breaks: 0 })
  })
})
