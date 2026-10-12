import { removeAccents } from './accents'
import { splitCharacters } from './reverse'
import { getWords } from './textStats'

export interface OccurrenceOptions {
  ignoreCase: boolean
  ignoreAccents: boolean
  /** Count only when the match is not glued to other letters or numbers ("sol" is not in "solo"). */
  wholeWord: boolean
}

/** Where a match sits in the original text, as UTF-16 indices (what `slice` takes). */
export interface MatchRange {
  start: number
  end: number
}

export interface OccurrenceResult {
  count: number
  ranges: MatchRange[]
  /** Words in the whole text, to put the count in perspective. */
  words: number
}

const LETTER_OR_NUMBER = /[\p{L}\p{N}\p{M}]/u

function fold(piece: string, { ignoreCase, ignoreAccents }: OccurrenceOptions): string {
  let out = piece
  if (ignoreAccents) out = removeAccents(out, { keepCedilla: false }).output
  if (ignoreCase) out = out.toLocaleLowerCase('pt-BR')
  return out
}

/**
 * Finds every non-overlapping match of `query` in `text`. The text is folded one visible
 * character at a time, remembering where each folded unit came from, so a match found in the
 * folded text can be highlighted at the right place in the original (even when "ß" became "ss").
 */
export function findOccurrences(text: string, rawQuery: string, options: OccurrenceOptions): OccurrenceResult {
  const query = rawQuery.trim()
  const words = getWords(text).length
  if (query === '' || text === '') return { count: 0, ranges: [], words }

  let folded = ''
  const starts: number[] = []
  const ends: number[] = []
  let position = 0
  for (const character of splitCharacters(text)) {
    const piece = fold(character, options)
    for (let i = 0; i < piece.length; i++) {
      starts.push(position)
      ends.push(position + character.length)
    }
    folded += piece
    position += character.length
  }

  const needle = splitCharacters(query).map((character) => fold(character, options)).join('')
  if (needle === '') return { count: 0, ranges: [], words }

  const ranges: MatchRange[] = []
  let from = 0
  for (;;) {
    const index = folded.indexOf(needle, from)
    if (index === -1) break
    const range = { start: starts[index], end: ends[index + needle.length - 1] }
    from = index + needle.length
    if (options.wholeWord) {
      const before = [...text.slice(Math.max(0, range.start - 2), range.start)].pop() ?? ''
      const after = [...text.slice(range.end, range.end + 2)][0] ?? ''
      if (LETTER_OR_NUMBER.test(before) || LETTER_OR_NUMBER.test(after)) continue
    }
    ranges.push(range)
  }
  return { count: ranges.length, ranges, words }
}

/** The text cut into pieces, marking which ones are matches (to render a highlight). */
export function highlightSegments(text: string, ranges: MatchRange[]): Array<{ text: string; match: boolean }> {
  const segments: Array<{ text: string; match: boolean }> = []
  let cursor = 0
  for (const { start, end } of ranges) {
    if (start > cursor) segments.push({ text: text.slice(cursor, start), match: false })
    segments.push({ text: text.slice(start, end), match: true })
    cursor = end
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), match: false })
  return segments
}
