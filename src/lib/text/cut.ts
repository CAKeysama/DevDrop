import { LINE_BREAK } from './lineBreaks'
import { splitCharacters } from './reverse'

export type CutUnit = 'characters' | 'words'
export type CutMode = 'first' | 'last' | 'range'

export interface CutOptions {
  unit: CutUnit
  mode: CutMode
  /** How many to keep, for "first" and "last". `null` when the field is not a valid number. */
  count: number | null
  /** 1-based, inclusive, for "range". */
  from: number | null
  to: number | null
  /** Cut each line on its own, instead of the whole text. */
  perLine: boolean
  /** Mark where something was cut with "…". */
  ellipsis: boolean
}

export interface CutResult {
  output: string
  /** How many characters or words were kept, and how many there were. */
  kept: number
  total: number
  error?: string
}

/** A whole number from 1 up, typed by a person; `null` when it is not one. */
export function parseCount(value: string): number | null {
  const text = value.trim()
  if (!/^\d+$/.test(text)) return null
  const number = Number(text)
  return Number.isSafeInteger(number) && number >= 1 ? number : null
}

const INVALID = 'Digite um número inteiro maior que zero.'

function cutPiece(text: string, { unit, mode, count, from, to, ellipsis }: CutOptions) {
  // Characters are what a person sees as one (an emoji, a letter with its accent), not code units.
  const pieces = unit === 'characters' ? splitCharacters(text) : text.split(/\s+/).filter(Boolean)
  const total = pieces.length

  let start = 0
  let end = total
  if (mode === 'first') end = Math.min(count!, total)
  else if (mode === 'last') start = Math.max(0, total - count!)
  else {
    start = Math.min(from! - 1, total)
    end = Math.min(to!, total)
  }

  const kept = pieces.slice(start, end)
  let output = kept.join(unit === 'words' ? ' ' : '')
  if (ellipsis && kept.length > 0) {
    if (start > 0) output = `…${output}`
    if (end < total) output = `${output}…`
  }
  return { output, kept: kept.length, total }
}

export function cutText(text: string, options: CutOptions): CutResult {
  const { mode, count, from, to, perLine } = options
  const empty = { output: '', kept: 0, total: 0 }

  if (mode === 'range') {
    if (from === null || to === null) return { ...empty, error: INVALID }
    if (from > to) return { ...empty, error: 'O início não pode ser maior que o fim.' }
  } else if (count === null) {
    return { ...empty, error: INVALID }
  }

  const source = text.replace(/\r\n?/g, '\n')
  if (!perLine) return cutPiece(source, options)

  const parts = source.split(LINE_BREAK).map((line) => cutPiece(line, options))
  return {
    output: parts.map((part) => part.output).join('\n'),
    kept: parts.reduce((sum, part) => sum + part.kept, 0),
    total: parts.reduce((sum, part) => sum + part.total, 0),
  }
}
