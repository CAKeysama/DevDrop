import type { DocumentValidation } from './cpf'
import { secureRandomInt, type RandomInt } from '../random'

/**
 * CNPJ has 14 positions: 12 identifiers and 2 numeric check digits. The alphanumeric format
 * (IN RFB nº 2.229/2024, scheduled to start in July 2026) allows letters A–Z in the 12
 * identifiers. The check digits use the same module 11 rule, with each character worth its
 * ASCII code minus 48 (digits keep their value; A = 17, B = 18…).
 */
export const stripCnpj = (value: string) => value.toUpperCase().replace(/[^0-9A-Z]/g, '')

export function formatCnpj(value: string): string {
  return value.replace(/^(.{2})(.{3})(.{3})(.{4})(.{2})$/, '$1.$2.$3/$4-$5')
}

const charValue = (char: string) => char.charCodeAt(0) - 48

function checkDigit(characters: string): number {
  let sum = 0
  let weight = 2
  for (let i = characters.length - 1; i >= 0; i--) {
    sum += charValue(characters[i]) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest
}

export function cnpjCheckDigits(base: string): string {
  const first = checkDigit(base)
  return `${first}${checkDigit(base + first)}`
}

export function validateCnpj(input: string): DocumentValidation {
  const trimmed = input.trim()
  if (trimmed === '') return { valid: false, message: 'Nenhum CNPJ informado.', hint: 'Digite as 14 posições do CNPJ.' }
  if (/[^0-9A-Za-z.\-/\s]/.test(trimmed)) {
    return { valid: false, message: 'O CNPJ contém caracteres inválidos.', hint: 'Use apenas letras, números, pontos, barra e hífen.' }
  }
  const value = stripCnpj(trimmed)
  if (value.length !== 14) {
    return { valid: false, message: `Um CNPJ tem 14 posições; foram informadas ${value.length}.`, hint: 'Confira se falta ou sobra algum caractere.' }
  }
  if (!/^.{2}\.?.{3}\.?.{3}\/?.{4}-?.{2}$/.test(trimmed.replace(/\s/g, ''))) {
    return { valid: false, message: 'A pontuação do CNPJ está fora do lugar.', hint: 'Use o formato 00.000.000/0000-00 ou apenas as 14 posições.' }
  }
  if (!/^\d{2}$/.test(value.slice(12))) {
    return { valid: false, message: 'CNPJ inválido: os dois últimos caracteres (dígitos verificadores) precisam ser números.' }
  }
  if (/^(.)\1{13}$/.test(value)) {
    return { valid: false, message: 'CNPJ inválido: todas as posições são iguais.' }
  }
  const expected = cnpjCheckDigits(value.slice(0, 12))
  if (value.slice(12) !== expected) {
    return {
      valid: false,
      message: 'CNPJ inválido: os dígitos verificadores não conferem.',
      hint: `Para as doze primeiras posições informadas, os verificadores corretos seriam ${expected}. Confira se algum caractere foi digitado errado.`,
    }
  }
  const alphanumeric = /[A-Z]/.test(value)
  return {
    valid: true,
    message: `CNPJ válido${alphanumeric ? ' (formato alfanumérico)' : ''}: os dígitos verificadores conferem.`,
    formatted: formatCnpj(value),
  }
}

/** Shows a 14-position CNPJ with or without the mask. */
export const displayCnpj = (value: string, masked: boolean) => (masked ? formatCnpj(stripCnpj(value)) : stripCnpj(value))

export interface CnpjOptions {
  masked?: boolean
  /** Uses letters and digits in the first 12 positions (alphanumeric format). */
  alphanumeric?: boolean
}

const ALPHANUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Generates a mathematically valid CNPJ for development and testing, for a head office
 * (branch 0001). The number is random and must never be used as a real document.
 */
export function generateCnpj({ masked = true, alphanumeric = false }: CnpjOptions = {}, randomInt: RandomInt = secureRandomInt): string {
  const alphabet = alphanumeric ? ALPHANUMERIC : '0123456789'
  let root: string
  do {
    root = Array.from({ length: 8 }, () => alphabet[randomInt(alphabet.length)]).join('')
  } while (/^(.)\1{7}$/.test(root))
  const base = root + '0001'
  const value = base + cnpjCheckDigits(base)
  return masked ? formatCnpj(value) : value
}
