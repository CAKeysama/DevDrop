import { describe, expect, it } from 'vitest'
import { findOccurrences, highlightSegments, type OccurrenceOptions } from './occurrences'

const base: OccurrenceOptions = { ignoreCase: true, ignoreAccents: false, wholeWord: false }
const find = (text: string, query: string, options: Partial<OccurrenceOptions> = {}) => findOccurrences(text, query, { ...base, ...options })
const matched = (text: string, query: string, options: Partial<OccurrenceOptions> = {}) =>
  find(text, query, options).ranges.map(({ start, end }) => text.slice(start, end))

describe('findOccurrences', () => {
  it('counts every occurrence, ignoring case by default', () => {
    expect(find('Casa casa CASA cas', 'casa').count).toBe(3)
  })

  it('respects case when asked', () => {
    expect(find('Casa casa CASA', 'casa', { ignoreCase: false }).count).toBe(1)
  })

  it('respects accents unless told to ignore them', () => {
    expect(find('café cafe', 'cafe').count).toBe(1)
    expect(find('café cafe', 'cafe', { ignoreAccents: true }).count).toBe(2)
    expect(find('café cafe', 'café', { ignoreAccents: true }).count).toBe(2)
  })

  it('returns the matched text exactly as written in the original', () => {
    expect(matched('Ação, AÇÃO e acao', 'acao', { ignoreAccents: true })).toEqual(['Ação', 'AÇÃO', 'acao'])
  })

  it('counts a phrase', () => {
    expect(find('um dois três. Um dois', 'um dois').count).toBe(2)
  })

  it('counts a word only when it is whole, if asked', () => {
    const text = 'sol solo girassol sol, sol.'
    expect(find(text, 'sol').count).toBe(5)
    expect(find(text, 'sol', { wholeWord: true }).count).toBe(3)
  })

  it('treats digits and accented letters as part of a word', () => {
    expect(find('a1 a 1a', 'a', { wholeWord: true }).count).toBe(1)
    expect(find('ação a', 'a', { wholeWord: true }).count).toBe(1)
  })

  it('does not count overlapping matches twice', () => {
    expect(find('aaaa', 'aa').count).toBe(2)
  })

  it('keeps the ranges right when a letter changes length when folded', () => {
    expect(matched('straße é grande', 'strasse', { ignoreAccents: true })).toEqual(['straße'])
  })

  it('works with emoji and decomposed accents', () => {
    expect(find('🚀 foguete 🚀', '🚀').count).toBe(2)
    expect(find('café', 'café', { ignoreAccents: true }).count).toBe(1)
  })

  it('reports the words of the text, and nothing for an empty query or text', () => {
    expect(find('um dois três', 'dois')).toMatchObject({ count: 1, words: 3 })
    expect(find('um dois', '  ')).toMatchObject({ count: 0, ranges: [] })
    expect(find('', 'a')).toMatchObject({ count: 0, words: 0 })
  })

  it('does not treat the query as a pattern', () => {
    expect(find('a.b a+b (x)', '.').count).toBe(1)
    expect(find('a.b a+b (x)', '(x)').count).toBe(1)
  })
})

describe('highlightSegments', () => {
  it('cuts the text around the matches, keeping every character', () => {
    const text = 'um dois um'
    const { ranges } = find(text, 'um')
    const segments = highlightSegments(text, ranges)
    expect(segments).toEqual([
      { text: 'um', match: true },
      { text: ' dois ', match: false },
      { text: 'um', match: true },
    ])
    expect(segments.map((segment) => segment.text).join('')).toBe(text)
  })

  it('returns the whole text as one piece when there is no match', () => {
    expect(highlightSegments('abc', [])).toEqual([{ text: 'abc', match: false }])
  })
})
