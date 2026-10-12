import { describe, expect, it } from 'vitest'
import { numbersToWords, numberToWords, type WordsOptions } from './numberWords'

const base: WordsOptions = { mode: 'number', gender: 'male', currency: 'BRL' }
const words = (value: string, options: Partial<WordsOptions> = {}) => {
  const result = numberToWords(value, { ...base, ...options })
  return result.error ?? result.words
}

describe('cardinals', () => {
  it.each([
    ['1', 'um'],
    ['21', 'vinte e um'],
    ['100', 'cem'],
    ['101', 'cento e um'],
    ['1000', 'mil'],
    ['1001', 'mil e um'],
    ['1100', 'mil e cem'],
    ['1101', 'mil cento e um'],
    ['2001', 'dois mil e um'],
    ['1.000.000', 'um milhão'],
    ['1.000.001', 'um milhão e um'],
    ['1.100.000', 'um milhão e cem mil'],
    ['0', 'zero'],
    ['-5', 'menos cinco'],
  ])('writes %s as "%s"', (value, expected) => {
    expect(words(value)).toBe(expected)
  })

  it('reads the Brazilian format: "." groups thousands and "," is the decimal', () => {
    expect(words('1.234')).toBe('mil duzentos e trinta e quatro')
    expect(words('3,14')).toBe('três inteiros e quatorze centésimos')
    expect(words('1,5')).toBe('um inteiro e cinco décimos')
  })

  it('writes very large numbers up to 42 digits', () => {
    expect(words('12345678901234567890')).toMatch(/^doze quintilhões/)
    expect(words('1' + '0'.repeat(41))).toBe('cem duodecilhões')
  })

  it('ignores spaces around the number', () => {
    expect(words('  42  ')).toBe('quarenta e dois')
  })
})

describe('gender', () => {
  it.each([
    ['1', 'uma'],
    ['2', 'duas'],
    ['21', 'vinte e uma'],
    ['200', 'duzentas'],
    ['2000', 'duas mil'],
  ])('writes %s in the feminine as "%s"', (value, expected) => {
    expect(words(value, { gender: 'female' })).toBe(expected)
  })
})

describe('money', () => {
  const money = (value: string, currency: WordsOptions['currency'] = 'BRL') => words(value, { mode: 'currency', currency })

  it('writes reais and centavos, in the singular and the plural', () => {
    expect(money('1,00')).toBe('um real')
    expect(money('0,01')).toBe('um centavo')
    expect(money('2,50')).toBe('dois reais e cinquenta centavos')
    expect(money('1.001,00')).toBe('mil e um reais')
    expect(money('0')).toBe('zero reais')
  })

  it('puts "de" before the currency when the value is whole millions', () => {
    expect(money('1.000.000,00')).toBe('um milhão de reais')
    expect(money('2.000.000,00')).toBe('dois milhões de reais')
    expect(money('1.000.000,01')).toBe('um milhão de reais e um centavo')
  })

  it('accepts the currency symbol', () => {
    expect(money('R$ 1.234,56')).toBe('mil duzentos e trinta e quatro reais e cinquenta e seis centavos')
  })

  it('writes dollars and euros', () => {
    expect(money('1,00', 'USD')).toBe('um dólar')
    expect(money('2', 'EUR')).toBe('dois euros')
  })

  it('refuses more than two decimal places', () => {
    expect(money('12,345')).toMatch(/duas casas decimais/)
  })
})

describe('ordinals', () => {
  it.each([
    ['1', 'male', 'primeiro'],
    ['11', 'male', 'décimo primeiro'],
    ['42', 'female', 'quadragésima segunda'],
    ['1000', 'male', 'milésimo'],
  ] as const)('writes %s (%s) as "%s"', (value, gender, expected) => {
    expect(words(value, { mode: 'ordinal', gender })).toBe(expected)
  })

  it('refuses a decimal ordinal', () => {
    expect(words('1,5', { mode: 'ordinal' })).toMatch(/números inteiros/)
  })
})

describe('invalid input', () => {
  it('explains, in Portuguese, what is wrong', () => {
    expect(words('abc')).toMatch(/só números/)
    expect(words('1.5')).toMatch(/ponto para separar milhares/)
    expect(words('1,2,3')).toMatch(/mais de uma vírgula/)
    expect(words('--1')).toMatch(/sinal de menos/)
    expect(words('1' + '0'.repeat(70))).toMatch(/42 dígitos/)
  })

  it('never shows the library message in English', () => {
    for (const value of ['abc', '1.5', '1,2,3', '--1', '1e3', '٣', '']) expect(words(value), value).not.toMatch(/[Ii]nput|[Ii]nvalid|must|only/)
  })
})

describe('numbersToWords', () => {
  it('converts one number per line and keeps blank lines', () => {
    expect(numbersToWords('1\n\n2', base)).toEqual({ output: 'um\n\ndois', converted: 2, firstError: undefined })
  })

  it('marks an invalid line and reports the first one', () => {
    const result = numbersToWords('1\nabc\n3\nxyz', base)
    expect(result.output).toBe('um\n(número inválido)\ntrês\n(número inválido)')
    expect(result.converted).toBe(2)
    expect(result.firstError).toMatchObject({ line: 2 })
  })

  it('returns nothing for an empty text', () => {
    expect(numbersToWords('', base)).toEqual({ output: '', converted: 0, firstError: undefined })
  })
})
