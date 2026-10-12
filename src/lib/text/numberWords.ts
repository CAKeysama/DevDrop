import extenso from 'extenso'

export type WordsMode = 'number' | 'currency' | 'ordinal'
export type WordsGender = 'male' | 'female'
export type WordsCurrency = 'BRL' | 'USD' | 'EUR'

export const wordsModes: Array<{ id: WordsMode; label: string; description: string }> = [
  { id: 'number', label: 'Número', description: 'Escreve o número: 1250 vira “mil duzentos e cinquenta”. Decimais viram “inteiros e centésimos”.' },
  { id: 'currency', label: 'Valor em dinheiro', description: 'Escreve um valor monetário, com a unidade e os centavos: “um real”, “dois reais e cinquenta centavos”.' },
  { id: 'ordinal', label: 'Ordinal', description: 'Escreve a posição: 1 vira “primeiro”, 42 vira “quadragésimo segundo”. Só aceita números inteiros.' },
]

export const wordsCurrencies: Array<{ id: WordsCurrency; label: string }> = [
  { id: 'BRL', label: 'Real' },
  { id: 'USD', label: 'Dólar' },
  { id: 'EUR', label: 'Euro' },
]

export interface WordsOptions {
  mode: WordsMode
  gender: WordsGender
  currency: WordsCurrency
}

export type WordsResult = { words: string; error?: undefined } | { words?: undefined; error: string }

/** The library's messages are in English; these are what the visitor reads. */
const MESSAGES: Array<[RegExp, string]> = [
  [/thousands grouping/i, 'Use ponto para separar milhares e vírgula para decimais, como em 1.234,56.'],
  [/multiple decimal separators/i, 'Há mais de uma vírgula decimal.'],
  [/negative sign/i, 'O sinal de menos só pode aparecer no início.'],
  [/decimal places/i, 'Em valores em dinheiro, use no máximo duas casas decimais.'],
  [/ordinal numbers must be integers/i, 'O ordinal só funciona com números inteiros.'],
  [/exceeds|too large|limit/i, 'Número grande demais: o limite é 42 dígitos.'],
  [/only digits|invalid integer|invalid number format|invalid decimal/i, 'Digite só números, com vírgula nos decimais (ex.: 1.234,56).'],
]

/** Writes one number in words. Input is Brazilian: "." groups thousands and "," marks decimals. */
export function numberToWords(value: string, { mode, gender, currency }: WordsOptions): WordsResult {
  try {
    const words = extenso(value.trim(), {
      decimalSeparator: 'comma',
      mode: mode === 'currency' ? 'currency' : 'number',
      number: { gender, ordinal: mode === 'ordinal' },
      ...(mode === 'currency' && { currency: { code: currency } }),
    })
    return { words }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    return { error: MESSAGES.find(([pattern]) => pattern.test(message))?.[1] ?? 'Não é um número válido.' }
  }
}

export interface WordsLines {
  output: string
  /** Lines that were written in words. */
  converted: number
  /** The first line that could not be, with the reason. */
  firstError?: { line: number; message: string }
}

/** One number per line, one result per line. Blank lines stay blank. */
export function numbersToWords(text: string, options: WordsOptions): WordsLines {
  let converted = 0
  let firstError: WordsLines['firstError']
  const output = text
    .split(/\r\n|\r|\n/)
    .map((line, index) => {
      if (line.trim() === '') return ''
      const result = numberToWords(line, options)
      if (result.error !== undefined) {
        firstError ??= { line: index + 1, message: result.error }
        return '(número inválido)'
      }
      converted++
      return result.words
    })
    .join('\n')
  return { output, converted, firstError }
}
