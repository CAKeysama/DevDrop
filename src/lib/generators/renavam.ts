import { createNumericDocument, weightedSum } from './numericDocument'

const WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const

/** The sum is multiplied by 10 before taking the remainder; a result of 10 becomes 0. */
function checkDigit(base: string): string {
  const digit = (weightedSum(base, WEIGHTS) * 10) % 11
  return String(digit === 10 ? 0 : digit)
}

/** RENAVAM: the registration number of a vehicle, 11 digits (older ones had 9, left-padded). */
export const renavam = createNumericDocument({
  name: 'RENAVAM',
  length: 11,
  baseLength: 10,
  checkDigits: checkDigit,
  format: (digits) => digits,
  mask: '00000000000',
})

export const renavamCheckDigit = checkDigit
