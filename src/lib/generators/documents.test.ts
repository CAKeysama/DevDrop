import { describe, expect, it } from 'vitest'
import { cnh, cnhCheckDigits } from './cnh'
import { pis, pisCheckDigit } from './pis'
import { renavam, renavamCheckDigit } from './renavam'
import { generateVoterId, validateVoterId, voterIdCheckDigits, voterStates } from './voterId'

/*
 * The algorithms were cross-checked once against two independent libraries (validation-br and
 * @brazilian-utils/brazilian-utils) with 100,000+ random numbers each. These tests keep the
 * known cases and the behaviour of the validators.
 */

describe('PIS/PASEP', () => {
  it('computes the check digit (module 11, weights 3 2 9 8 7 6 5 4 3 2)', () => {
    expect(pisCheckDigit('1234567891')).toBe('9')
    expect(pisCheckDigit('1609226974')).toBe('1')
  })

  it('accepts a valid number, with or without the mask', () => {
    expect(pis.validate('16092269741').valid).toBe(true)
    expect(pis.validate('160.92269.74-1')).toMatchObject({ valid: true, formatted: '160.92269.74-1' })
  })

  it('explains what is wrong', () => {
    expect(pis.validate('')).toMatchObject({ valid: false, message: 'Nenhum PIS/PASEP informado.' })
    expect(pis.validate('1609226974')).toMatchObject({ valid: false, message: expect.stringMatching(/11 dígitos; foram informados 10/) })
    expect(pis.validate('16092269742')).toMatchObject({ valid: false, hint: expect.stringContaining('seria 1') })
    expect(pis.validate('11111111111').message).toMatch(/todos os dígitos são iguais/)
    expect(pis.validate('1609A269741').message).toMatch(/não são dígitos/)
    expect(pis.validate('16.09226.97-41').message).toMatch(/pontuação/)
  })

  it('generates numbers its own validator accepts', () => {
    for (let i = 0; i < 500; i++) expect(pis.validate(pis.generate(i % 2 === 0)).valid).toBe(true)
  })
})

describe('RENAVAM', () => {
  it('computes the check digit (weights 3 2 9 8 7 6 5 4 3 2, times 10, module 11)', () => {
    expect(renavamCheckDigit('4221927303')).toBe('6')
  })

  it('validates', () => {
    expect(renavam.validate('42219273036').valid).toBe(true)
    expect(renavam.validate('42219273037')).toMatchObject({ valid: false, message: expect.stringMatching(/dígitos verificadores não conferem/) })
    expect(renavam.validate('4221927303').message).toMatch(/11 dígitos/)
  })

  it('has no mask', () => {
    expect(renavam.display('42219273036', true)).toBe('42219273036')
  })

  it('generates numbers its own validator accepts', () => {
    for (let i = 0; i < 500; i++) expect(renavam.validate(renavam.generate(false)).valid).toBe(true)
  })
})

describe('CNH', () => {
  it('computes both check digits (the second one uses the first)', () => {
    expect(cnhCheckDigits('583167945')).toBe('34') // worked example of the validation-br documentation
    expect(cnhCheckDigits('580780216')).toBe('70')
  })

  it('validates, and speaks of a CNH in the feminine', () => {
    expect(cnh.validate('58316794534')).toMatchObject({ valid: true, message: 'CNH válida: os dígitos verificadores conferem.' })
    expect(cnh.validate('58316794535')).toMatchObject({ valid: false, message: 'CNH inválida: os dígitos verificadores não conferem.' })
    expect(cnh.validate('')).toMatchObject({ message: 'Nenhum CNH informado.' })
    expect(cnh.validate('583167945').message).toBe('Uma CNH tem 11 dígitos; foram informados 9.')
  })

  it('generates numbers its own validator accepts', () => {
    for (let i = 0; i < 500; i++) expect(cnh.validate(cnh.generate(false)).valid).toBe(true)
  })
})

describe('Título de eleitor', () => {
  it('computes the check digits (weights 2..9, then 7 8 9 over the state and the first digit)', () => {
    expect(voterIdCheckDigits('1023850106')).toBe('71') // worked example of the validation-br documentation
  })

  it('validates, with or without spaces', () => {
    expect(validateVoterId('102385010671')).toMatchObject({ valid: true, formatted: '1023 8501 0671' })
    expect(validateVoterId('1023 8501 0671').valid).toBe(true)
    expect(validateVoterId('102385010672')).toMatchObject({ valid: false })
  })

  it('knows the 28 state codes and refuses the others', () => {
    expect(voterStates).toHaveLength(28)
    expect(validateVoterId('102385010071').message).toMatch(/código do estado não existe/)
    expect(validateVoterId('102385012971').message).toMatch(/código do estado não existe/)
  })

  it('applies the rule of São Paulo and Minas Gerais: a remainder of 0 gives digit 1', () => {
    // sequence 00000000, state 01: both remainders are 0 or become 0
    expect(voterIdCheckDigits('0000000001')).toBe('16')
    expect(validateVoterId('000000000116').valid).toBe(true)
    expect(validateVoterId('000000000108').valid).toBe(false)
    // any other state keeps a remainder of 0 as 0
    expect(voterIdCheckDigits('0000000003')).toBe('02')
  })

  it('generates for a chosen state, or any', () => {
    for (const state of voterStates) {
      const value = generateVoterId(state.code, false)
      expect(value.slice(8, 10)).toBe(state.code)
      expect(validateVoterId(value).valid).toBe(true)
    }
    for (let i = 0; i < 300; i++) expect(validateVoterId(generateVoterId('any', i % 2 === 0)).valid).toBe(true)
  })

  it('never hands out a number the two known rules would treat differently', () => {
    for (let i = 0; i < 2000; i++) {
      const value = generateVoterId(i % 2 === 0 ? '01' : '02', false)
      expect(voterIdCheckDigits(value.slice(0, 10))).toBe(value.slice(10))
      // with remainders not 0 the special rule changes nothing, so it matches the plain one
      expect(voterIdCheckDigits(value.slice(0, 10))).toBe(plainVoterDigits(value.slice(0, 10)))
    }
  })
})

/** The same check digits without the exception for São Paulo and Minas. */
function plainVoterDigits(base: string): string {
  const digit = (sum: number) => (sum % 11 === 10 ? 0 : sum % 11)
  let sum = 0
  for (let i = 0; i < 8; i++) sum += Number(base[i]) * (i + 2)
  const first = digit(sum)
  const second = digit(Number(base[8]) * 7 + Number(base[9]) * 8 + first * 9)
  return `${first}${second}`
}
