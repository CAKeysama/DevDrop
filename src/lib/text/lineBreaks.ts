import { unescapeText } from './escapes'

export type BreakMode = 'space' | 'remove' | 'custom'

export const breakModes: Array<{ id: BreakMode; label: string; description: string }> = [
  { id: 'space', label: 'Trocar por espaço', description: 'As linhas viram um texto corrido, separadas por um espaço.' },
  { id: 'remove', label: 'Remover', description: 'Junta as linhas sem nada entre elas.' },
  { id: 'custom', label: 'Trocar por…', description: 'Coloca o texto que você digitar entre as linhas (vírgula, ponto e vírgula, barra…).' },
]

export interface LineBreakOptions {
  mode: BreakMode
  /** What goes between the lines in the "custom" mode; accepts \n and \t. */
  custom: string
  /** Drop empty lines, so a blank line does not leave a double separator. */
  skipEmpty: boolean
  /** Trim the spaces at the start and end of each line. */
  trimLines: boolean
}

export interface LineBreakResult {
  output: string
  /** How many line breaks the text had. */
  breaks: number
}

/** Windows (\r\n), old Mac (\r), Unix (\n) and the Unicode line/paragraph separators. */
export const LINE_BREAK =/\r\n|[\n\r\u2028\u2029]/

export function replaceLineBreaks(text: string, { mode, custom, skipEmpty, trimLines }: LineBreakOptions): LineBreakResult {
  const lines = text.split(LINE_BREAK)
  const kept = (trimLines ? lines.map((line) => line.trim()) : lines).filter((line) => !skipEmpty || line.trim() !== '')
  const separator = mode === 'space' ? ' ' : mode === 'remove' ? '' : unescapeText(custom)
  return { output: kept.join(separator), breaks: lines.length - 1 }
}
