import { describe, expect, it } from 'vitest'
import { defaultPasswordOptions, generatePassword, passwordEntropyBits } from './password'
import { analyzePassword } from './passwordStrength'

const value = <T>(outcome: { result: T | null; error?: string }): T => {
  if (outcome.error !== undefined || outcome.result === null) throw new Error('expected a result, got ' + outcome.error)
  return outcome.result
}

describe('password generator', () => {
  it('respects the length and includes every selected group', () => {
    for (let i = 0; i < 200; i++) {
      const password = value(generatePassword({ ...defaultPasswordOptions, length: 4 }))
      expect(password).toHaveLength(4)
      expect(password).toMatch(/[A-Z]/)
      expect(password).toMatch(/[a-z]/)
      expect(password).toMatch(/[0-9]/)
      expect(password).toMatch(/[^A-Za-z0-9]/)
    }
  })

  it('uses only the selected groups', () => {
    const digits = value(generatePassword({ ...defaultPasswordOptions, length: 64, uppercase: false, lowercase: false, symbols: false }))
    expect(digits).toMatch(/^\d{64}$/)
  })

  it('removes ambiguous characters on request', () => {
    for (let i = 0; i < 50; i++) {
      expect(value(generatePassword({ ...defaultPasswordOptions, length: 128, excludeAmbiguous: true }))).not.toMatch(/[Il1O0o|]/)
    }
  })

  it('does not repeat itself', () => {
    const all = new Set(Array.from({ length: 200 }, () => value(generatePassword(defaultPasswordOptions))))
    expect(all.size).toBe(200)
  })

  it('rejects impossible options', () => {
    expect(generatePassword({ ...defaultPasswordOptions, uppercase: false, lowercase: false, numbers: false, symbols: false }).error === undefined).toBe(false)
    for (const length of [0, 3, 129, 12.5, -5, NaN]) {
      expect(generatePassword({ ...defaultPasswordOptions, length }).error === undefined, String(length)).toBe(false)
    }
  })

  it('estimates entropy', () => {
    expect(passwordEntropyBits({ ...defaultPasswordOptions, length: 10, uppercase: false, lowercase: false, symbols: false })).toBeCloseTo(33.2, 1)
  })
})
describe('password strength', () => {
  it('ranks obvious cases', () => {
    expect(analyzePassword('').score).toBe(0)
    for (const weak of ['123456', 'senha', 'Senha123', 'password', 'P@ssw0rd', 'qwerty', 'aaaaaaaa', 'abcabcabc', '12345678', 'flamengo10', 'joao1990']) {
      expect(analyzePassword(weak).score, weak).toBeLessThanOrEqual(1)
    }
    for (const strong of ['x7$Kp2!mQ9@vL4#z', 'correto cavalo bateria grampo', 'Tr0ub4dor&3-xK!9pLm', 'h8Jk2Lm9Qp4Rs7Tv']) {
      expect(analyzePassword(strong).score, strong).toBeGreaterThanOrEqual(3)
    }
  })

  it('does not punish long random passwords of a single class', () => {
    expect(analyzePassword('82917364501928374650192837465019283746').score).toBe(4)
    expect(analyzePassword('kqzrwmxvbtplnhgdjsfy').score).toBeGreaterThanOrEqual(3)
  })

  it('catches keyboard walks and plain dates', () => {
    for (const weak of ['qazwsxedc', 'zaq12wsx', 'q1w2e3r4t5', '15/03/1990', '15031990']) {
      expect(analyzePassword(weak).score, weak).toBeLessThanOrEqual(1)
    }
    expect(analyzePassword('123456').findings.map((finding) => finding.text).join(' ')).not.toMatch(/ano ou uma data/)
    expect(analyzePassword('a').findings[0].text).toBe('Curta demais: 1 caractere.')
  })

  it('explains the verdict', () => {
    const result = analyzePassword('Senha123')
    expect(result.label).toBe('Muito fraca')
    expect(result.findings.some((finding) => finding.kind === 'bad')).toBe(true)
    expect(result.suggestions.length).toBeGreaterThan(0)
    expect(analyzePassword('abcd1234efgh').findings.map((finding) => finding.text).join(' ')).toMatch(/sequência/)
    expect(analyzePassword('maria1990!').findings.map((finding) => finding.text).join(' ')).toMatch(/ano|data/)
  })

  it('handles unicode and very long input', () => {
    expect(analyzePassword('ação🚀ñandú漢字-Zx9').score).toBeGreaterThanOrEqual(2)
    expect(analyzePassword('a'.repeat(5000)).score).toBeLessThanOrEqual(1)
  })
})
