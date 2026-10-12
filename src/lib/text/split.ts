import { unescapeText } from './escapes'

export type SeparatorId = 'comma' | 'semicolon' | 'space' | 'tab' | 'pipe' | 'custom'

export const separators: Array<{ id: SeparatorId; label: string; value: string | null }> = [
  { id: 'comma', label: 'Vírgula', value: ',' },
  { id: 'semicolon', label: 'Ponto e vírgula', value: ';' },
  { id: 'space', label: 'Espaço', value: ' ' },
  { id: 'tab', label: 'Tab', value: '\t' },
  { id: 'pipe', label: 'Barra vertical', value: '|' },
  { id: 'custom', label: 'Outro…', value: null },
]

export interface SplitOptions {
  separator: SeparatorId
  /** The separator typed by the visitor in the "custom" mode; accepts \n and \t. */
  custom: string
  /** Trim the spaces around each part. */
  trim: boolean
  /** Drop parts that end up empty ("a,,b" has one). */
  skipEmpty: boolean
}

export interface SplitResult {
  parts: string[]
  /** The custom mode is chosen but nothing is typed yet. */
  needsSeparator: boolean
}

export function splitText(text: string, { separator, custom, trim, skipEmpty }: SplitOptions): SplitResult {
  const chosen = separators.find((item) => item.id === separator)!
  const value = chosen.value ?? unescapeText(custom)
  if (value === '') return { parts: [], needsSeparator: true }
  if (text === '') return { parts: [], needsSeparator: false }

  let parts = text.split(value)
  if (trim) parts = parts.map((part) => part.trim())
  if (skipEmpty) parts = parts.filter((part) => part.trim() !== '')
  return { parts, needsSeparator: false }
}
