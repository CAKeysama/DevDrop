import { LINE_BREAK } from './lineBreaks'

export type SortOrder = 'asc' | 'desc'

export interface SortOptions {
  order: SortOrder
  /** "casa" and "Casa" are the same line (matters for duplicates). */
  ignoreCase: boolean
  /** "cafe" and "café" are the same line (matters for duplicates). */
  ignoreAccents: boolean
  /** Numbers inside the lines count by value: "item 2" comes before "item 10". */
  numeric: boolean
  removeDuplicates: boolean
  skipEmpty: boolean
  /** Trim the spaces at the start and end of each line before sorting. */
  trimLines: boolean
}

export interface SortResult {
  lines: string[]
  /** Lines taken out for being repeated. */
  removed: number
}

/**
 * Which differences count as a difference. Letters always sort by their base letter first
 * (a, A, á before b), so these options decide what is "the same line" for duplicates.
 */
function sensitivity({ ignoreCase, ignoreAccents }: Pick<SortOptions, 'ignoreCase' | 'ignoreAccents'>) {
  if (ignoreCase && ignoreAccents) return 'base'
  if (ignoreCase) return 'accent'
  if (ignoreAccents) return 'case'
  return 'variant'
}

export function sortLines(text: string, options: SortOptions): SortResult {
  const collator = new Intl.Collator('pt-BR', { sensitivity: sensitivity(options), numeric: options.numeric })
  const direction = options.order === 'asc' ? 1 : -1

  let lines = text === '' ? [] : text.split(LINE_BREAK)
  if (options.trimLines) lines = lines.map((line) => line.trim())
  if (options.skipEmpty) lines = lines.filter((line) => line.trim() !== '')

  // Array.prototype.sort is stable, so equal lines keep the order they were typed in.
  const sorted = [...lines].sort((a, b) => direction * collator.compare(a, b))
  if (!options.removeDuplicates) return { lines: sorted, removed: 0 }

  const unique = sorted.filter((line, index) => index === 0 || collator.compare(sorted[index - 1], line) !== 0)
  return { lines: unique, removed: sorted.length - unique.length }
}
