export type CaseMode = 'upper' | 'lower' | 'sentence' | 'capitalize' | 'title' | 'invert'

export const caseModes: Array<{ id: CaseMode; label: string; description: string }> = [
  { id: 'upper', label: 'MAIÚSCULAS', description: 'Todas as letras em maiúsculas.' },
  { id: 'lower', label: 'minúsculas', description: 'Todas as letras em minúsculas.' },
  { id: 'sentence', label: 'Início de frase', description: 'Maiúscula só na primeira letra de cada frase.' },
  { id: 'capitalize', label: 'Cada Palavra', description: 'Maiúscula na primeira letra de todas as palavras.' },
  { id: 'title', label: 'Título', description: 'Como “Cada Palavra”, mas mantém em minúsculas artigos e preposições (de, da, e, em…).' },
  { id: 'invert', label: 'iNVERTER', description: 'Troca maiúsculas por minúsculas e vice-versa.' },
]

const LOCALE = 'pt-BR'
const upper = (text: string) => text.toLocaleUpperCase(LOCALE)
const lower = (text: string) => text.toLocaleLowerCase(LOCALE)

/** Words that stay lowercase in Portuguese and English titles, unless they come first. */
const MINOR_WORDS = new Set(
  `a à as às ao aos o os e ou de da das do dos em na nas no nos num numa um uma uns umas por pelo pela pelos pelas
  para pra com sem sob sobre que se
  the an and or of in on at to for by from with as but nor`.split(/\s+/),
)

const WORD = /[\p{L}\p{N}\p{M}]+(?:['’][\p{L}\p{N}\p{M}]+)*/gu

function capitalizeWord(word: string) {
  const [first, ...rest] = Array.from(word)
  const initial = upper(first)
  // Letters without a single-letter capital (ß) stay as they are.
  return ([...initial].length === 1 ? initial : first) + lower(rest.join(''))
}

/** Converts letter case. Only letters change: accents, emoji, digits and punctuation are kept. */
export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'upper':
      return upper(text)
    case 'lower':
      return lower(text)
    case 'sentence':
      // A sentence starts at the beginning, after . ! ? … or on a new line — skipping spaces, quotes and bullets.
      return lower(text).replace(/(^[^\p{L}\p{N}]*|[.!?…]["'”’)\]]*\s+[^\p{L}\p{N}\n]*|\n[^\p{L}\p{N}]*)(\p{L})/gu, (_, before: string, letter: string) => before + upper(letter))
    case 'capitalize':
      return text.replace(WORD, capitalizeWord)
    case 'title': {
      let first = true
      return text.replace(WORD, (word, offset: number) => {
        const startsLine = first || /[\n.!?:…]\s*$/.test(text.slice(0, offset))
        first = false
        return !startsLine && MINOR_WORDS.has(lower(word)) ? lower(word) : capitalizeWord(word)
      })
    }
    case 'invert':
      // Letters whose other case is not a single letter (ß → SS) are left alone.
      return Array.from(text, (char) => {
        const swapped = char === upper(char) ? lower(char) : upper(char)
        return [...swapped].length === 1 ? swapped : char
      }).join('')
  }
}
