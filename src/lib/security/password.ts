import { fail, ok, type ToolResult } from '../result'
import { secureRandomInt, shuffle, type RandomInt } from '../random'

export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  /** Removes characters that look alike: I, l, 1, O, 0, o and |. */
  excludeAmbiguous: boolean
}

export const PASSWORD_MIN_LENGTH = 4
export const PASSWORD_MAX_LENGTH = 128

export const defaultPasswordOptions: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
}

const AMBIGUOUS = new Set('Il1O0o|')

const sets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/|~',
} as const

/** Character groups enabled by the options, after removing ambiguous characters. */
export function getCharacterGroups(options: PasswordOptions): string[] {
  return (Object.keys(sets) as Array<keyof typeof sets>)
    .filter((key) => options[key])
    .map((key) => (options.excludeAmbiguous ? [...sets[key]].filter((char) => !AMBIGUOUS.has(char)).join('') : sets[key]))
}

/** Entropy in bits of a password drawn uniformly from the enabled groups. */
export function passwordEntropyBits(options: PasswordOptions): number {
  const pool = getCharacterGroups(options).join('').length
  return pool > 1 ? options.length * Math.log2(pool) : 0
}

/**
 * Generates a password with a cryptographically secure source. Every enabled group is
 * guaranteed to appear at least once; positions are then shuffled.
 */
export function generatePassword(options: PasswordOptions, randomInt: RandomInt = secureRandomInt): ToolResult {
  if (!Number.isInteger(options.length) || options.length < PASSWORD_MIN_LENGTH || options.length > PASSWORD_MAX_LENGTH) {
    return fail(`O comprimento precisa ser um número inteiro entre ${PASSWORD_MIN_LENGTH} e ${PASSWORD_MAX_LENGTH}.`)
  }
  const groups = getCharacterGroups(options)
  if (groups.length === 0) {
    return fail('Nenhum tipo de caractere selecionado.', {
      hint: 'Marque pelo menos uma opção: maiúsculas, minúsculas, números ou símbolos.',
    })
  }

  const pool = groups.join('')
  const chars = groups.map((group) => group[randomInt(group.length)])
  while (chars.length < options.length) chars.push(pool[randomInt(pool.length)])
  return ok(shuffle(chars, randomInt).join(''))
}
