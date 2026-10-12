import { fail, ok, type ToolResult } from '../result'

export type LoremUnit = 'words' | 'sentences' | 'paragraphs'

export const loremLimits: Record<LoremUnit, number> = { words: 1000, sentences: 100, paragraphs: 20 }
export const loremUnitLabels: Record<LoremUnit, string> = { words: 'Palavras', sentences: 'Frases', paragraphs: 'Parágrafos' }

const OPENING = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit']

const WORDS = `ad adipisci aliqua aliquam aliquid amet animi aperiam architecto asperiores aspernatur assumenda at atque aut
autem beatae blanditiis commodi consectetur consequatur consequuntur corporis corrupti culpa cum cumque cupiditate
debitis delectus deleniti deserunt dicta dignissimos distinctio dolor dolore dolorem doloremque dolores doloribus
dolorum ducimus ea eaque earum eius eligendi enim eos error esse est et eum eveniet ex excepturi exercitationem
expedita explicabo facere facilis fuga fugiat fugit harum hic id illo illum impedit in incidunt inventore ipsa ipsam
ipsum iste itaque iure iusto labore laboriosam laborum laudantium libero magnam magni maiores maxime minima minus
modi molestiae molestias mollitia nam natus necessitatibus nemo neque nesciunt nihil nisi nobis non nostrum nulla
numquam obcaecati odio odit officia officiis omnis optio pariatur perferendis perspiciatis placeat porro possimus
praesentium provident quae quaerat quam quas quasi qui quia quibusdam quidem quis quisquam quo quod quos ratione
recusandae reiciendis rem repellat repellendus reprehenderit repudiandae rerum saepe sapiente sed sequi similique
sint sit soluta sunt suscipit tempora tempore temporibus tenetur totam ullam unde ut vel velit veniam veritatis vero
vitae voluptas voluptate voluptatem voluptates voluptatibus voluptatum`.split(/\s+/)

export interface LoremOptions {
  unit: LoremUnit
  count: number
  /** Starts with the classic "Lorem ipsum dolor sit amet…". */
  startWithLorem?: boolean
}

type Random = () => number

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** Placeholder text does not need a secure source, so Math.random is fine here. */
export function generateLorem({ unit, count, startWithLorem = true }: LoremOptions, random: Random = Math.random): ToolResult {
  if (!Number.isInteger(count) || count < 1 || count > loremLimits[unit]) {
    return fail(`A quantidade de ${loremUnitLabels[unit].toLowerCase()} precisa ser um número inteiro entre 1 e ${loremLimits[unit]}.`)
  }

  const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1))
  let last = ''
  const word = () => {
    let index = Math.floor(random() * WORDS.length) % WORDS.length
    // Never repeat the previous word.
    if (WORDS[index] === last) index = (index + 1) % WORDS.length
    const next = WORDS[index]
    last = next
    return next
  }

  const takeWords = (amount: number, opening: boolean) => {
    const words = opening ? OPENING.slice(0, amount) : []
    while (words.length < amount) words.push(word())
    return words
  }

  const sentence = (opening: boolean) => {
    const words = takeWords(between(6, 14), opening)
    // An occasional comma makes the rhythm less mechanical.
    // The classic opening is kept intact; the comma only goes after it.
    const firstFree = opening ? OPENING.length : 3
    if (words.length > firstFree + 3 && random() < 0.6) {
      const at = between(firstFree, words.length - 4)
      words[at] += ','
    }
    return capitalize(words.join(' ')) + '.'
  }

  const paragraph = (opening: boolean) =>
    Array.from({ length: between(4, 7) }, (_, index) => sentence(opening && index === 0)).join(' ')

  switch (unit) {
    case 'words':
      return ok(takeWords(count, startWithLorem).join(' '))
    case 'sentences':
      return ok(Array.from({ length: count }, (_, index) => sentence(startWithLorem && index === 0)).join(' '))
    case 'paragraphs':
      return ok(Array.from({ length: count }, (_, index) => paragraph(startWithLorem && index === 0)).join('\n\n'))
  }
}
