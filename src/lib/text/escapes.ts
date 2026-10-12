/**
 * Lets a one-line field hold what cannot be typed in it: `\n` is a line break, `\t` a tab and
 * `\\` a backslash. Any other backslash stays as typed, so "C:\temp" is only touched by \t.
 */
export function unescapeText(value: string): string {
  return value.replace(/\\([nt\\])/g, (_, code: string) => (code === 'n' ? '\n' : code === 't' ? '\t' : '\\'))
}
