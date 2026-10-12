import { createNumericDocument, weightedSum } from './numericDocument'

const WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const

/** Module 11: the check digit is 11 minus the remainder, and 0 when that would be 10 or 11. */
function checkDigit(base: string): string {
  const digit = 11 - (weightedSum(base, WEIGHTS) % 11)
  return String(digit >= 10 ? 0 : digit)
}

/**
 * PIS, PASEP and NIT share the same 11-digit number and the same check digit: three names
 * for the identifier of one social security registration.
 */
export const pis = createNumericDocument({
  name: 'PIS/PASEP',
  length: 11,
  baseLength: 10,
  checkDigits: checkDigit,
  format: (digits) => digits.replace(/^(\d{3})(\d{5})(\d{2})(\d)$/, '$1.$2.$3-$4'),
  mask: '000.00000.00-0',
})

export const pisCheckDigit = checkDigit
