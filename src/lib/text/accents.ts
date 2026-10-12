export interface AccentOptions {
  /** Leave ç and Ç as they are (some systems and names require the cedilla). */
  keepCedilla: boolean
}

export interface AccentResult {
  output: string
  /** How many letters lost an accent or were folded to plain letters. */
  changed: number
}

/**
 * Letters that have no decomposition into base + accent, so `normalize` leaves them alone.
 * Folded the way ASCII transliteration usually does.
 */
const FOLDS: Record<string, string> = {
  ø: 'o', Ø: 'O', ł: 'l', Ł: 'L', đ: 'd', Đ: 'D', ħ: 'h', Ħ: 'H', ı: 'i',
  ß: 'ss', æ: 'ae', Æ: 'AE', œ: 'oe', Œ: 'OE', þ: 'th', Þ: 'TH',
}
const FOLDABLE = new RegExp(`[${Object.keys(FOLDS).join('')}]`, 'g')

/** A Latin letter followed by its combining marks (only after NFD). */
const ACCENTED_LATIN = /(\p{Script=Latin})\p{M}+/gu

function strip(segment: string): AccentResult {
  let changed = 0
  const output = segment
    .normalize('NFD')
    // Only marks that sit on a Latin letter: vowel signs of other scripts (हिन्दी, العربية)
    // are not accents, and removing them would change the words.
    .replace(ACCENTED_LATIN, (_, letter: string) => {
      changed++
      return letter
    })
    .replace(FOLDABLE, (letter) => {
      changed++
      return FOLDS[letter]
    })
    .normalize('NFC') // puts back what is not Latin (é of Greek, й of Cyrillic stays intact)
  return { output, changed }
}

export function removeAccents(text: string, { keepCedilla }: AccentOptions): AccentResult {
  // NFC first, so a cedilla typed as c + U+0327 counts as ç when it has to be kept.
  const source = text.normalize('NFC')
  if (!keepCedilla) return strip(source)

  let changed = 0
  const output = source
    .split(/([çÇ])/)
    .map((part, index) => {
      if (index % 2 === 1) return part // the ç itself
      const result = strip(part)
      changed += result.changed
      return result.output
    })
    .join('')
  return { output, changed }
}
