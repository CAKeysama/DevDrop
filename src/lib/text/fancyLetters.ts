import { splitCharacters } from './reverse'

export interface FancyStyle {
  id: string
  label: string
  /** Style of one character (a letter, a digit or anything else, which most styles leave alone). */
  apply: (character: string) => string
}

/**
 * The "Mathematical Alphanumeric Symbols" block has gaps: where a letter would be, there is
 * nothing, because it already existed elsewhere (the italic h is U+210E, in Letterlike Symbols).
 * Each style lists those exceptions by the plain letter; `fancyLetters.test.ts` checks every
 * letter of every style against the Unicode data, so a missing exception fails there.
 */
type Exceptions = Record<string, number>

function alphabet(upper: number | null, lower: number | null, digits: number | null, exceptions: Exceptions = {}) {
  return (character: string): string => {
    if (character in exceptions) return String.fromCodePoint(exceptions[character])
    const code = character.codePointAt(0)!
    if (upper !== null && code >= 0x41 && code <= 0x5a) return String.fromCodePoint(upper + code - 0x41)
    if (lower !== null && code >= 0x61 && code <= 0x7a) return String.fromCodePoint(lower + code - 0x61)
    if (digits !== null && code >= 0x30 && code <= 0x39) return String.fromCodePoint(digits + code - 0x30)
    return character
  }
}

/** Small capitals exist for most lowercase letters, in several blocks; x has none. */
const SMALL_CAPS: Record<string, number> = {
  a: 0x1d00, b: 0x0299, c: 0x1d04, d: 0x1d05, e: 0x1d07, f: 0xa730, g: 0x0262, h: 0x029c, i: 0x026a,
  j: 0x1d0a, k: 0x1d0b, l: 0x029f, m: 0x1d0d, n: 0x0274, o: 0x1d0f, p: 0x1d18, q: 0x01eb, r: 0x0280,
  s: 0xa731, t: 0x1d1b, u: 0x1d1c, v: 0x1d20, w: 0x1d21, y: 0x028f, z: 0x1d22,
}

const COMBINING_STRIKE = '̶'
const COMBINING_UNDERLINE = '̲'

export const fancyStyles: FancyStyle[] = [
  { id: 'bold', label: 'Negrito', apply: alphabet(0x1d400, 0x1d41a, 0x1d7ce) },
  { id: 'italic', label: 'Itálico', apply: alphabet(0x1d434, 0x1d44e, null, { h: 0x210e }) },
  { id: 'bold-italic', label: 'Negrito itálico', apply: alphabet(0x1d468, 0x1d482, null) },
  {
    id: 'script',
    label: 'Cursiva',
    apply: alphabet(0x1d49c, 0x1d4b6, null, {
      B: 0x212c, E: 0x2130, F: 0x2131, H: 0x210b, I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211b, e: 0x212f, g: 0x210a, o: 0x2134,
    }),
  },
  { id: 'bold-script', label: 'Cursiva negrito', apply: alphabet(0x1d4d0, 0x1d4ea, null) },
  { id: 'fraktur', label: 'Gótico', apply: alphabet(0x1d504, 0x1d51e, null, { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 }) },
  {
    id: 'double-struck',
    label: 'Contornado',
    apply: alphabet(0x1d538, 0x1d552, 0x1d7d8, { C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124 }),
  },
  { id: 'sans', label: 'Sem serifa', apply: alphabet(0x1d5a0, 0x1d5ba, 0x1d7e2) },
  { id: 'sans-bold', label: 'Sem serifa negrito', apply: alphabet(0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { id: 'sans-italic', label: 'Sem serifa itálico', apply: alphabet(0x1d608, 0x1d622, null) },
  { id: 'sans-bold-italic', label: 'Sem serifa negrito itálico', apply: alphabet(0x1d63c, 0x1d656, null) },
  { id: 'monospace', label: 'Monoespaçado', apply: alphabet(0x1d670, 0x1d68a, 0x1d7f6) },
  {
    id: 'circled',
    label: 'Circulado',
    apply: (character) => {
      const code = character.codePointAt(0)!
      if (code >= 0x41 && code <= 0x5a) return String.fromCodePoint(0x24b6 + code - 0x41)
      if (code >= 0x61 && code <= 0x7a) return String.fromCodePoint(0x24d0 + code - 0x61)
      if (code === 0x30) return String.fromCodePoint(0x24ea)
      if (code >= 0x31 && code <= 0x39) return String.fromCodePoint(0x2460 + code - 0x31)
      return character
    },
  },
  {
    id: 'fullwidth',
    label: 'Largura total',
    apply: (character) => {
      const code = character.codePointAt(0)!
      if (code === 0x20) return String.fromCodePoint(0x3000)
      return code >= 0x21 && code <= 0x7e ? String.fromCodePoint(code + 0xfee0) : character
    },
  },
  { id: 'small-caps', label: 'Versalete', apply: (character) => (character in SMALL_CAPS ? String.fromCodePoint(SMALL_CAPS[character]) : character) },
  { id: 'strikethrough', label: 'Riscado', apply: (character) => (character.trim() === '' ? character : character + COMBINING_STRIKE) },
  { id: 'underline', label: 'Sublinhado', apply: (character) => (character.trim() === '' ? character : character + COMBINING_UNDERLINE) },
]

/**
 * Writes a text in a style. Accented letters are split into letter + accent first, so the
 * letter gets the style and the accent stays on top of it (these alphabets have no accents).
 */
export function applyStyle(text: string, style: FancyStyle): string {
  return splitCharacters(text.normalize('NFD'))
    .map((cluster) => {
      // A visible character can be a letter plus marks ("e" + accent): style the letter, keep the marks.
      const [base, ...marks] = Array.from(cluster)
      return style.apply(base) + marks.join('')
    })
    .join('')
}
