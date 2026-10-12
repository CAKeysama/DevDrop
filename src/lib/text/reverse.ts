export type ReverseMode = 'characters' | 'each-word' | 'words' | 'lines'

export const reverseModes: Array<{ id: ReverseMode; label: string; description: string; example: [string, string] }> = [
  {
    id: 'characters',
    label: 'Texto inteiro',
    description: 'Lê tudo de trás para frente, letra por letra. A última linha vira a primeira.',
    example: ['olá, mundo', 'odnum ,álo'],
  },
  {
    id: 'each-word',
    label: 'Letras de cada palavra',
    description: 'Inverte as letras dentro de cada palavra e mantém a ordem das palavras e a pontuação.',
    example: ['olá, mundo!', 'álo, odnum!'],
  },
  {
    id: 'words',
    label: 'Ordem das palavras',
    description: 'Troca a ordem das palavras em cada linha. A pontuação acompanha a palavra.',
    example: ['um dois três', 'três dois um'],
  },
  {
    id: 'lines',
    label: 'Ordem das linhas',
    description: 'Troca a ordem das linhas, sem mexer no que está escrito em cada uma.',
    example: ['primeira↵segunda', 'segunda↵primeira'],
  },
]

/**
 * Splits into what a person sees as one character: "👨‍👩‍👧" or "é" written as e + accent stay
 * whole, which reversing by UTF-16 units or code points would tear apart. Falls back to code
 * points where `Intl.Segmenter` does not exist.
 */
const segmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null

export function splitCharacters(text: string): string[] {
  return segmenter ? Array.from(segmenter.segment(text), (part) => part.segment) : Array.from(text)
}

const reverseCharacters = (text: string) => splitCharacters(text).reverse().join('')

/** Letters and numbers (with accents and inner apostrophes), as in the case converter. */
const WORD = /[\p{L}\p{N}\p{M}]+(?:['’][\p{L}\p{N}\p{M}]+)*/gu

const splitLines = (text: string) => text.split(/\r\n|\r|\n/)

/** Reverses the order of the words of a line, keeping the spaces where they were. */
function reverseWordOrder(line: string): string {
  const parts = line.split(/(\s+)/) // words at even positions, whitespace at odd ones
  const words = parts.filter((_, index) => index % 2 === 0 && parts[index] !== '').reverse()
  let next = 0
  return parts.map((part, index) => (index % 2 === 0 && part !== '' ? words[next++] : part)).join('')
}

export function reverseText(text: string, mode: ReverseMode): string {
  if (text === '') return ''
  switch (mode) {
    case 'characters':
      return reverseCharacters(text.replace(/\r\n?/g, '\n'))
    case 'each-word':
      return text.replace(WORD, reverseCharacters)
    case 'words':
      return splitLines(text).map(reverseWordOrder).join('\n')
    case 'lines':
      return splitLines(text).reverse().join('\n')
  }
}
