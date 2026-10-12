import { describe, expect, it } from 'vitest'
import { describeDotReading, formatNumber, parseNumber } from './number'
import { calculatePercentage } from './percentage'
import { solveRuleOfThree } from './ruleOfThree'

const value = <T>(outcome: { result: T | null; error?: string }): T => {
  if (outcome.error !== undefined || outcome.result === null) throw new Error('expected a result, got ' + outcome.error)
  return outcome.result
}

describe('parseNumber', () => {
  it('accepts Brazilian and plain notation', () => {
    expect(value(parseNumber('1.234,56'))).toBe(1234.56)
    expect(value(parseNumber('1234.56'))).toBe(1234.56)
    expect(value(parseNumber(' -0,5 '))).toBe(-0.5)
    expect(value(parseNumber('1.234.567'))).toBe(1234567)
    expect(value(parseNumber('1e3'))).toBe(1000)
    expect(value(parseNumber('.5'))).toBe(0.5)
    expect(value(parseNumber('3.14'))).toBe(3.14)
    expect(value(parseNumber('0.001'))).toBe(0.001)
  })

  it('reads dots in groups of three as thousands, like the results it shows', () => {
    expect(value(parseNumber('1.234'))).toBe(1234)
    expect(value(parseNumber('1.000'))).toBe(1000)
    expect(value(parseNumber('12.345,5'))).toBe(12345.5)
    expect(value(parseNumber(formatNumber(1234)))).toBe(1234)
    expect(value(parseNumber(formatNumber(1234567.25)))).toBe(1234567.25)
    expect(value(parseNumber(formatNumber(0.125)))).toBe(0.125)
  })

  it('accepts a pasted percentage and explains how a dot was read', () => {
    expect(value(parseNumber('25%'))).toBe(25)
    expect(value(parseNumber('+25%'))).toBe(25)
    expect(describeDotReading('1.125')).toMatch(/Lido como 1125: o ponto separa milhares/)
    expect(describeDotReading('1.12')).toMatch(/Lido como 1,12: o ponto foi entendido como vírgula decimal/)
    expect(describeDotReading('1,5')).toBeNull()
    expect(describeDotReading('15')).toBeNull()
    expect(describeDotReading('1..5')).toBeNull()
  })

  it('rejects ambiguous or malformed separators instead of guessing', () => {
    for (const raw of ['1,234.56', '1..5', '..5', '1.23.4', '0.5.5', '1.2345,6', '1,', ',', '.', '1.234.56', '12,34,5']) {
      expect(parseNumber(raw).error === undefined, raw).toBe(false)
    }
  })

  it('never shows a non-zero number as zero', () => {
    expect(formatNumber(1e-10)).toBe('1E-10')
    expect(formatNumber(0.00001234)).toBe('0,00001234')
    expect(formatNumber(-0.0000004)).toBe('-4E-7')
    expect(formatNumber(1e21)).toBe('1E21')
    expect(formatNumber(-0.00000001)).not.toBe('0')
  })

  it('rejects anything that is not a number', () => {
    for (const raw of ['', '  ', 'abc', '1,2,3', '12abc', '--1', '1/2', 'Infinity', 'NaN', '1e999']) {
      expect(parseNumber(raw).error === undefined, raw).toBe(false)
    }
  })

  it('formats in pt-BR', () => {
    expect(formatNumber(1234.5)).toBe('1.234,5')
    expect(formatNumber(1 / 3)).toBe('0,333333')
    expect(formatNumber(-0)).toBe('0')
  })
})
describe('percentage', () => {
  it('computes every mode', () => {
    expect(value(calculatePercentage('percent-of', 15, 240)).value).toBeCloseTo(36)
    expect(value(calculatePercentage('what-percent', 30, 120)).value).toBeCloseTo(25)
    expect(value(calculatePercentage('increase', 200, 10)).value).toBeCloseTo(220)
    expect(value(calculatePercentage('decrease', 200, 25)).value).toBeCloseTo(150)
    expect(value(calculatePercentage('change', 80, 100)).value).toBeCloseTo(25)
    expect(value(calculatePercentage('change', 100, 80)).value).toBeCloseTo(-20)
  })

  it('shows the result with its unit, the formula and the steps', () => {
    const result = value(calculatePercentage('what-percent', 30, 120))
    expect(result.display).toBe('25%')
    expect(result.formula).toBe('X ÷ Y × 100')
    expect(result.steps).toHaveLength(2)
    expect(value(calculatePercentage('change', 80, 100)).display).toBe('+25%')
  })

  it('handles decimals, negatives and zero', () => {
    expect(value(calculatePercentage('percent-of', 12.5, 80)).value).toBeCloseTo(10)
    expect(value(calculatePercentage('percent-of', 0, 50)).value).toBe(0)
    expect(value(calculatePercentage('percent-of', 10, -50)).value).toBeCloseTo(-5)
    expect(value(calculatePercentage('change', -50, -25)).value).toBeCloseTo(50)
    expect(value(calculatePercentage('decrease', 200, 100)).value).toBe(0)
  })

  it('keeps the steps true for tiny, huge and negative numbers', () => {
    const tiny = value(calculatePercentage('change', 0.000000001, 1))
    expect(tiny.steps[0]).toBe('1 − 1E-9 = 1')
    expect(tiny.steps.join(' ')).not.toMatch(/÷ 0 /)
    expect(value(calculatePercentage('percent-of', 0.00001, 0.001)).display).toBe('1E-10')
    expect(value(calculatePercentage('what-percent', 1, 1000000000)).display).toBe('1E-7%')
    expect(value(calculatePercentage('change', 50, -50)).steps[0]).toBe('-50 − 50 = -100')
    expect(value(calculatePercentage('change', -50, 50)).steps[0]).toBe('50 − (-50) = 100')
    expect(value(calculatePercentage('change', 1000000000, 999999999.99999)).display).not.toBe('-0%')
    expect(calculatePercentage('percent-of', 1e200, 1e200).error === undefined).toBe(false)
  })

  it('refuses division by zero and nonsense', () => {
    expect(calculatePercentage('what-percent', 5, 0).error === undefined).toBe(false)
    expect(calculatePercentage('change', 0, 10).error === undefined).toBe(false)
    expect(calculatePercentage('increase', 100, -5).error === undefined).toBe(false)
    expect(calculatePercentage('decrease', 100, -5).error === undefined).toBe(false)
    expect(calculatePercentage('percent-of', NaN, 1).error === undefined).toBe(false)
    expect(calculatePercentage('percent-of', 1, Infinity).error === undefined).toBe(false)
  })
})
describe('rule of three', () => {
  it('solves direct proportions', () => {
    const result = value(solveRuleOfThree(2, 10, 5))
    expect(result.value).toBe(25)
    expect(result.formula).toBe('X = B × C ÷ A')
    expect(result.steps.at(-1)).toBe('X = 50 ÷ 2 = 25')
  })

  it('solves inverse proportions', () => {
    expect(value(solveRuleOfThree(4, 6, 8, 'inverse')).value).toBe(3)
  })

  it('handles decimals and negatives', () => {
    expect(value(solveRuleOfThree(1.5, 4.5, 2.5)).value).toBeCloseTo(7.5)
    expect(value(solveRuleOfThree(-2, 10, 5)).value).toBe(-25)
    expect(value(solveRuleOfThree(3, 0, 5)).value).toBe(0)
  })

  it('survives tiny and huge numbers without false steps', () => {
    const tiny = value(solveRuleOfThree(7, 0.000000001, 0.000000001))
    expect(tiny.summary).toBe('Se 7 corresponde a 1E-9, então 1E-9 corresponde a 1,42857E-19.')
    expect(value(solveRuleOfThree(1e200, 1e200, 1e200)).value).toBe(1e200)
    expect(solveRuleOfThree(1e-200, 1e200, 1e200).error === undefined).toBe(false)
    expect(value(solveRuleOfThree(2, -10, 5)).steps[1]).toBe('2 × X = (-10) × 5')
  })

  it('refuses division by zero and invalid numbers', () => {
    expect(solveRuleOfThree(0, 10, 5).error === undefined).toBe(false)
    expect(solveRuleOfThree(4, 6, 0, 'inverse').error === undefined).toBe(false)
    expect(solveRuleOfThree(NaN, 1, 1).error === undefined).toBe(false)
    expect(solveRuleOfThree(1, Infinity, 1).error === undefined).toBe(false)
  })
})
