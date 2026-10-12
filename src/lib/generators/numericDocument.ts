import { secureRandomInt, type RandomInt } from '../random'
import type { DocumentValidation } from './cpf'

export interface NumericDocumentSpec {
  /** As written in the page: "PIS/PASEP", "CNH". */
  name: string
  /** The document is feminine in Portuguese ("uma CNH", "válida"). */
  feminine?: boolean
  /** Digits in the whole number, check digits included. */
  length: number
  /** Digits before the check digits. */
  baseLength: number
  /** The check digits of the leading digits. */
  checkDigits: (base: string) => string
  /** Shows the digits with the document's mask. */
  format: (digits: string) => string
  /** The mask, with 0 for a digit; punctuation may be left out when typing. */
  mask: string
  /** A rule over the whole number beyond the check digits (a state code, say). */
  extraRule?: (digits: string) => { message: string; hint: string } | null
  /** Refuse numbers made of one repeated digit. They pass the arithmetic of most documents. */
  rejectRepeated?: boolean
  /** A random base for documents whose base has structure. */
  randomBase?: (randomInt: RandomInt) => string
  /** Whether a generated number is safe to hand out (leave out cases validators disagree on). */
  acceptGenerated?: (digits: string) => boolean
}

export interface NumericDocument {
  strip: (value: string) => string
  format: (digits: string) => string
  display: (digits: string, masked: boolean) => string
  validate: (input: string) => DocumentValidation
  generate: (masked?: boolean, randomInt?: RandomInt) => string
}

const strip = (value: string) => value.replace(/\D/g, '')

/**
 * Validator and generator of a document that is a run of digits ending in check digits
 * (PIS, voter ID, RENAVAM, CNH…). CPF and CNPJ keep their own modules: they have their own
 * rules and a long history of tests.
 */
export function createNumericDocument(spec: NumericDocumentSpec): NumericDocument {
  const { name, feminine = false, length, baseLength, checkDigits, format, mask, extraRule, rejectRepeated = true, randomBase, acceptGenerated } = spec
  const indefinite = `${feminine ? 'Uma' : 'Um'} ${name}`
  const maskPattern = new RegExp(`^${[...mask].map((char) => (char === '0' ? '\\d' : `\\${char}?`)).join('')}$`)
  const allowedChars = /[^\d.\-/\s]/

  function validate(input: string): DocumentValidation {
    const trimmed = input.trim()
    if (trimmed === '') return { valid: false, message: `Nenhum ${name} informado.`, hint: `Digite os ${length} dígitos.` }
    if (allowedChars.test(trimmed)) {
      return { valid: false, message: `O ${name} contém caracteres que não são dígitos.`, hint: 'Use apenas números, pontos, hífen e barra.' }
    }
    const digits = strip(trimmed)
    if (digits.length !== length) {
      return { valid: false, message: `${indefinite} tem ${length} dígitos; foram informados ${digits.length}.`, hint: 'Confira se falta ou sobra algum dígito.' }
    }
    if (!maskPattern.test(trimmed.replace(/\s/g, ''))) {
      return { valid: false, message: `A pontuação do ${name} está fora do lugar.`, hint: `Use o formato ${mask} ou apenas os ${length} dígitos.` }
    }
    if (rejectRepeated && /^(\d)\1+$/.test(digits)) {
      return { valid: false, message: `${name} inválid${feminine ? 'a' : 'o'}: todos os dígitos são iguais.`, hint: 'Sequências repetidas passam na conta, mas não são números válidos.' }
    }
    const broken = extraRule?.(digits)
    if (broken) return { valid: false, ...broken }

    const expected = checkDigits(digits.slice(0, baseLength))
    if (digits.slice(baseLength) !== expected) {
      return {
        valid: false,
        message: `${name} inválid${feminine ? 'a' : 'o'}: os dígitos verificadores não conferem.`,
        hint: `Para os ${baseLength} primeiros dígitos informados, ${expected.length === 1 ? 'o verificador correto seria' : 'os verificadores corretos seriam'} ${expected}. Confira se algum número foi digitado errado.`,
      }
    }
    return { valid: true, message: `${name} válid${feminine ? 'a' : 'o'}: os dígitos verificadores conferem.`, formatted: format(digits) }
  }

  function generate(masked = true, randomInt: RandomInt = secureRandomInt): string {
    for (;;) {
      const base = randomBase ? randomBase(randomInt) : Array.from({ length: baseLength }, () => randomInt(10)).join('')
      const digits = base + checkDigits(base)
      if (rejectRepeated && /^(\d)\1+$/.test(digits)) continue
      if (acceptGenerated && !acceptGenerated(digits)) continue
      return masked ? format(digits) : digits
    }
  }

  return {
    strip,
    format,
    display: (digits, masked) => (masked ? format(strip(digits)) : strip(digits)),
    validate,
    generate,
  }
}

/** Weighted sum of the digits of `base`, weights applied left to right. */
export function weightedSum(base: string, weights: readonly number[]): number {
  let sum = 0
  for (let i = 0; i < base.length; i++) sum += Number(base[i]) * weights[i]
  return sum
}
