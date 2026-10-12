import { namedEntity } from './html'

export interface CharInfo {
  /** The code point itself. */
  character: string
  /** What to draw for it: the character, or a visible stand-in when it has no shape. */
  shown: string
  /** Whether the character has no visible shape of its own (space, control, zero-width). */
  invisible: boolean
  codePoint: number
  /** `U+00E7`. */
  unicode: string
  /** Bytes in UTF-8, in hex: `C3 A7`. */
  utf8: string
  /** Code units in UTF-16, in hex: `00E7`, or a surrogate pair `D83D DE80`. */
  utf16: string
  /** The named entity when there is one (`&ccedil;`), the numeric one otherwise. */
  entity: string
  category: string
}

/** Unicode general categories, in the words a Portuguese speaker would use. */
const CATEGORIES: Array<[RegExp, string]> = [
  [/^\p{Lu}$/u, 'Letra maiúscula'],
  [/^\p{Ll}$/u, 'Letra minúscula'],
  [/^\p{Lt}$/u, 'Letra capitular'],
  [/^\p{Lm}$/u, 'Letra modificadora'],
  [/^\p{Lo}$/u, 'Outra letra'],
  [/^\p{Mn}$/u, 'Marca combinante'],
  [/^\p{Mc}$/u, 'Marca com espaçamento'],
  [/^\p{Me}$/u, 'Marca envolvente'],
  [/^\p{Nd}$/u, 'Dígito'],
  [/^\p{Nl}$/u, 'Número (letra)'],
  [/^\p{No}$/u, 'Outro número'],
  [/^\p{Pc}$/u, 'Pontuação (conector)'],
  [/^\p{Pd}$/u, 'Pontuação (travessão)'],
  [/^\p{Ps}$/u, 'Pontuação (abre)'],
  [/^\p{Pe}$/u, 'Pontuação (fecha)'],
  [/^\p{Pi}$/u, 'Aspas (abre)'],
  [/^\p{Pf}$/u, 'Aspas (fecha)'],
  [/^\p{Po}$/u, 'Pontuação'],
  [/^\p{Sm}$/u, 'Símbolo matemático'],
  [/^\p{Sc}$/u, 'Símbolo de moeda'],
  [/^\p{Sk}$/u, 'Símbolo modificador'],
  [/^\p{So}$/u, 'Outro símbolo'],
  [/^\p{Zs}$/u, 'Espaço'],
  [/^\p{Zl}$/u, 'Separador de linha'],
  [/^\p{Zp}$/u, 'Separador de parágrafo'],
  [/^\p{Cc}$/u, 'Controle'],
  [/^\p{Cf}$/u, 'Formatação (invisível)'],
  [/^\p{Cs}$/u, 'Substituto'],
  [/^\p{Co}$/u, 'Uso privado'],
  [/^\p{Cn}$/u, 'Não atribuído'],
]

const hex = (value: number, width = 4) => value.toString(16).toUpperCase().padStart(width, '0')
const encoder = new TextEncoder()

/** A character with no shape cannot be shown as itself: draw a stand-in (␣, ↵, ⇥, ␀…). */
function standIn(character: string, codePoint: number, category: string): { shown: string; invisible: boolean } {
  if (codePoint === 0x20) return { shown: String.fromCodePoint(0x2423), invisible: true } // ␣
  if (codePoint < 0x20) return { shown: String.fromCodePoint(0x2400 + codePoint), invisible: true } // ␀ … ␟
  if (codePoint === 0x7f) return { shown: String.fromCodePoint(0x2421), invisible: true } // ␡
  if (['Espaço', 'Separador de linha', 'Separador de parágrafo', 'Controle', 'Formatação (invisível)'].includes(category)) {
    return { shown: String.fromCodePoint(0x00b7), invisible: true } // ·
  }
  // A mark on its own draws nothing useful; the dotted circle gives it something to sit on.
  if (['Marca combinante', 'Marca com espaçamento', 'Marca envolvente'].includes(category)) {
    return { shown: `${String.fromCodePoint(0x25cc)}${character}`, invisible: false }
  }
  return { shown: character, invisible: false }
}

export function describeCharacter(character: string): CharInfo {
  const codePoint = character.codePointAt(0)!
  const category = CATEGORIES.find(([pattern]) => pattern.test(character))?.[1] ?? 'Desconhecido'
  const units = Array.from({ length: character.length }, (_, index) => hex(character.charCodeAt(index)))
  return {
    character,
    ...standIn(character, codePoint, category),
    codePoint,
    unicode: `U+${hex(codePoint)}`,
    utf8: Array.from(encoder.encode(character), (byte) => hex(byte, 2)).join(' '),
    utf16: units.join(' '),
    entity: namedEntity(character) ?? `&#${codePoint};`,
    category,
  }
}

export interface CharInfoResult {
  items: CharInfo[]
  /** Code points in the whole text, which can be more than the ones described. */
  total: number
}

/** One entry per code point (a family emoji is several: the people and the joiners). */
export function describeCharacters(text: string, limit = 100): CharInfoResult {
  const items: CharInfo[] = []
  let total = 0
  for (const character of text) {
    if (items.length < limit) items.push(describeCharacter(character))
    total++
  }
  return { items, total }
}
