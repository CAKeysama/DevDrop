import { secureRandomInt, type RandomInt } from '../random'

export interface DocumentValidation {
  valid: boolean
  /** Explanation in plain words, for valid and invalid numbers alike. */
  message: string
  hint?: string
  formatted?: string
}

export const stripCpf = (value: string) => value.replace(/\D/g, '')

export function formatCpf(digits: string): string {
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

/** Check digit for the given leading digits (module 11, weights from length + 1 down to 2). */
function checkDigit(digits: string): number {
  let sum = 0
  for (let i = 0; i < digits.length; i++) sum += Number(digits[i]) * (digits.length + 1 - i)
  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest
}

export function cpfCheckDigits(base: string): string {
  const first = checkDigit(base)
  return `${first}${checkDigit(base + first)}`
}

export function validateCpf(input: string): DocumentValidation {
  const trimmed = input.trim()
  if (trimmed === '') return { valid: false, message: 'Nenhum CPF informado.', hint: 'Digite os 11 dígitos do CPF.' }
  if (/[^\d.\-\s]/.test(trimmed)) {
    return { valid: false, message: 'O CPF contém caracteres que não são dígitos.', hint: 'Use apenas números, pontos e hífen.' }
  }
  const digits = stripCpf(trimmed)
  if (digits.length !== 11) {
    return { valid: false, message: `Um CPF tem 11 dígitos; foram informados ${digits.length}.`, hint: 'Confira se falta ou sobra algum dígito.' }
  }
  if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(trimmed.replace(/\s/g, ''))) {
    return { valid: false, message: 'A pontuação do CPF está fora do lugar.', hint: 'Use o formato 000.000.000-00 ou apenas os 11 dígitos.' }
  }
  if (/^(\d)\1{10}$/.test(digits)) {
    return { valid: false, message: 'CPF inválido: todos os dígitos são iguais.', hint: 'Sequências como 111.111.111-11 passam na conta, mas não são CPFs válidos.' }
  }
  const expected = cpfCheckDigits(digits.slice(0, 9))
  if (digits.slice(9) !== expected) {
    return {
      valid: false,
      message: 'CPF inválido: os dígitos verificadores não conferem.',
      hint: `Para os nove primeiros dígitos informados, os verificadores corretos seriam ${expected}. Confira se algum número foi digitado errado.`,
    }
  }
  return { valid: true, message: 'CPF válido: os dígitos verificadores conferem.', formatted: formatCpf(digits) }
}

/**
 * Generates a mathematically valid CPF for development and testing. The number is random:
 * it may or may not belong to a real person and must never be used as a real document.
 */
/** Shows an 11-digit CPF with or without the mask. */
export const displayCpf = (digits: string, masked: boolean) => (masked ? formatCpf(stripCpf(digits)) : stripCpf(digits))

export function generateCpf(masked = true, randomInt: RandomInt = secureRandomInt): string {
  let base: string
  do {
    base = Array.from({ length: 9 }, () => randomInt(10)).join('')
  } while (/^(\d)\1{8}$/.test(base))
  const digits = base + cpfCheckDigits(base)
  return masked ? formatCpf(digits) : digits
}
