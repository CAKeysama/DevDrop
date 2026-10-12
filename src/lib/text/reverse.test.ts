import { describe, expect, it } from 'vitest'
import { reverseModes, reverseText, splitCharacters } from './reverse'

describe('reverseText', () => {
  it('reverses the whole text, so the last line comes first', () => {
    expect(reverseText('abc', 'characters')).toBe('cba')
    expect(reverseText('ab\ncd', 'characters')).toBe('dc\nba')
    expect(reverseText('ab\r\ncd', 'characters')).toBe('dc\nba')
  })

  it('keeps a visible character whole: accents, emoji and ZWJ sequences', () => {
    expect(reverseText('éa', 'characters')).toBe('aé') // e + combining accent
    expect(reverseText('a👨‍👩‍👧b', 'characters')).toBe('b👨‍👩‍👧a')
    expect(reverseText('🇧🇷x', 'characters')).toBe('x🇧🇷')
    expect(splitCharacters('👨‍👩‍👧')).toHaveLength(1)
  })

  it('reverses the letters of each word, leaving punctuation and spacing', () => {
    expect(reverseText('olá, mundo!', 'each-word')).toBe('álo, odnum!')
    expect(reverseText("don't  stop", 'each-word')).toBe("t'nod  pots")
    expect(reverseText('a1b2 c-d', 'each-word')).toBe('2b1a c-d')
  })

  it('reverses the word order per line, keeping line breaks and spaces', () => {
    expect(reverseText('um dois três', 'words')).toBe('três dois um')
    expect(reverseText('um dois\ntrês quatro', 'words')).toBe('dois um\nquatro três')
    expect(reverseText('a  b   c', 'words')).toBe('c  b   a')
    expect(reverseText('  a b', 'words')).toBe('  b a')
    expect(reverseText('Olá, mundo!', 'words')).toBe('mundo! Olá,')
  })

  it('reverses the order of the lines', () => {
    expect(reverseText('1\n2\n3', 'lines')).toBe('3\n2\n1')
    expect(reverseText('a\n\nb', 'lines')).toBe('b\n\na')
  })

  it('returns an empty text for an empty input, in every mode', () => {
    for (const { id } of reverseModes) expect(reverseText('', id)).toBe('')
  })

  it('is its own inverse', () => {
    const text = 'Olá, mundo! 🚀\nsegunda linha  com   espaços'
    for (const mode of ['characters', 'lines'] as const) expect(reverseText(reverseText(text, mode), mode)).toBe(text)
  })

  it('shows examples that match what the function really does', () => {
    for (const { id, example } of reverseModes) {
      const [from, to] = example.map((value) => value.replaceAll('↵', '\n'))
      expect(reverseText(from, id), id).toBe(to)
    }
  })
})
