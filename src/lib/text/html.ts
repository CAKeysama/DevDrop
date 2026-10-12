export type HtmlStructure = 'paragraphs' | 'br' | 'none'

export const htmlStructures: Array<{ id: HtmlStructure; label: string; description: string }> = [
  { id: 'paragraphs', label: 'Parágrafos', description: 'Cada bloco separado por uma linha em branco vira um <p>; as quebras dentro dele viram <br>.' },
  { id: 'br', label: 'Só quebras', description: 'Cada quebra de linha vira um <br>, sem <p>.' },
  { id: 'none', label: 'Sem tags', description: 'Só escapa os símbolos; as quebras de linha ficam como estão.' },
]

export interface HtmlOptions {
  structure: HtmlStructure
  /** Turn http(s) addresses into <a> links. */
  linkify: boolean
  /** Write accents and symbols as entities (&aacute;), for systems that do not read UTF-8. */
  entities: boolean
}

export interface HtmlResult {
  output: string
  paragraphs: number
}

/** Named entities for Portuguese letters: base letter + accent -> `&aacute;`, `&ccedil;`… */
const NAMED: Record<string, string> = {}
const accents: Array<[string, string, string]> = [
  ['́', 'acute', 'aeiouAEIOU'],
  ['̀', 'grave', 'aeiouAEIOU'],
  ['̂', 'circ', 'aeiouAEIOU'],
  ['̈', 'uml', 'aeiouAEIOU'],
  ['̃', 'tilde', 'aonAON'],
  ['̧', 'cedil', 'cC'],
]
for (const [mark, name, letters] of accents) {
  for (const letter of letters) NAMED[(letter + mark).normalize('NFC')] = `${letter}${name}`
}
Object.assign(NAMED, {
  '«': 'laquo', '»': 'raquo', '©': 'copy', '®': 'reg', '™': 'trade', '°': 'deg', 'º': 'ordm', 'ª': 'ordf',
  '€': 'euro', '£': 'pound', '¥': 'yen', '¢': 'cent', '§': 'sect', '¿': 'iquest', '¡': 'iexcl',
  '–': 'ndash', '—': 'mdash', '…': 'hellip', '“': 'ldquo', '”': 'rdquo', '‘': 'lsquo', '’': 'rsquo',
  '•': 'bull', '×': 'times', '÷': 'divide', '±': 'plusmn', '¼': 'frac14', '½': 'frac12', '¾': 'frac34',
  ' ': 'nbsp',
})

/** Escapes what HTML reserves; with `entities`, also writes everything non-ASCII as an entity. */
export function escapeHtml(text: string, entities: boolean): string {
  let out = ''
  for (const char of text) {
    if (char === '&') out += '&amp;'
    else if (char === '<') out += '&lt;'
    else if (char === '>') out += '&gt;'
    else if (char === '"') out += '&quot;'
    else if (entities && char.codePointAt(0)! > 126) out += NAMED[char] ? `&${NAMED[char]};` : `&#${char.codePointAt(0)};`
    else out += char
  }
  return out
}

/** Trailing punctuation and quotes belong to the sentence, not to the address. */
const TRAILING = /(?:[.,;:!?\]]|&quot;|&#39;|&gt;)$/

/** Works on already-escaped text, so an address with `&` ends up as `&amp;` inside href. */
function linkify(escaped: string): string {
  return escaped.replace(/https?:\/\/[^\s<]+/g, (match) => {
    let url = match
    let tail = ''
    for (;;) {
      if (url.endsWith('&amp;')) break
      const closing = url.endsWith(')') && !url.includes('(')
      const found = url.match(TRAILING)
      if (!found && !closing) break
      const piece = found ? found[0] : ')'
      tail = piece + tail
      url = url.slice(0, -piece.length)
    }
    return url.length > 'https://'.length - 1 ? `<a href="${url}">${url}</a>${tail}` : match
  })
}

export function textToHtml(text: string, { structure, linkify: withLinks, entities }: HtmlOptions): HtmlResult {
  const source = text.replace(/\r\n?/g, '\n')
  if (source.trim() === '') return { output: '', paragraphs: 0 }

  let body = escapeHtml(source, entities)
  if (withLinks) body = linkify(body)

  if (structure === 'none') return { output: body, paragraphs: 0 }
  if (structure === 'br') return { output: body.replace(/\n/g, '<br>\n'), paragraphs: 0 }

  const blocks = body
    .split(/\n[ \t]*\n(?:[ \t]*\n)*/)
    .map((block) => block.replace(/^\n+|\n+$/g, ''))
    .filter((block) => block.trim() !== '')
  return { output: blocks.map((block) => `<p>${block.split('\n').join('<br>\n')}</p>`).join('\n'), paragraphs: blocks.length }
}
