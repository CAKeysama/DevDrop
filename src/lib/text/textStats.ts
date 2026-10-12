export interface TextStats {
  /** Characters as a person sees them: an emoji or an accented letter counts as one. */
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  sentences: number
  paragraphs: number
  /** Size in bytes when encoded as UTF-8. */
  bytes: number
  /** Reading time in seconds at 200 words per minute. */
  readingSeconds: number
}

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null

/** Splits text into user-perceived characters (grapheme clusters). */
export function splitGraphemes(text: string): string[] {
  if (segmenter) return Array.from(segmenter.segment(text), (part) => part.segment)
  return Array.from(text)
}

/**
 * A word is a run of letters, digits or combining marks. Apostrophes and hyphens inside a
 * word keep it together, so "guarda-chuva" and "don't" count as one word each, in Portuguese
 * and in English alike.
 */
const WORD = /[\p{L}\p{N}\p{M}]+(?:['’-][\p{L}\p{N}\p{M}]+)*/gu

export function getWords(text: string): string[] {
  return text.match(WORD) ?? []
}

export function getTextStats(text: string): TextStats {
  const graphemes = splitGraphemes(text)
  const words = getWords(text).length
  return {
    characters: graphemes.length,
    charactersNoSpaces: graphemes.filter((char) => !/^\s+$/u.test(char)).length,
    words,
    lines: text === '' ? 0 : text.split(/\r\n|\r|\n/).length,
    sentences: (text.match(/[^.!?…\s][^.!?…]*(?:[.!?…]+|$)/g) ?? []).filter((part) => /[\p{L}\p{N}]/u.test(part)).length,
    paragraphs: text.split(/(?:\r\n|\r|\n)\s*(?:\r\n|\r|\n)/).filter((block) => block.trim() !== '').length,
    bytes: new TextEncoder().encode(text).length,
    readingSeconds: Math.round((words / 200) * 60),
  }
}

/** "1 min 30 s", "45 s", "menos de 1 s". */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 s'
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (minutes === 0) return `${rest} s`
  return rest === 0 ? `${minutes} min` : `${minutes} min ${rest} s`
}

/** Most frequent words with at least `minLength` letters, case-insensitive, most frequent first. */
export function getTopWords(text: string, limit = 8, minLength = 3): Array<{ word: string; count: number }> {
  const counts = new Map<string, number>()
  for (const word of getWords(text)) {
    const key = word.toLocaleLowerCase('pt-BR')
    if ([...key].length >= minLength) counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word, 'pt-BR'))
    .slice(0, limit)
}

export const textExample =
  'O DevDrop reúne utilitários rápidos em um só lugar.\nConte caracteres, palavras e linhas — inclusive com acentuação e emoji 🚀.'
