import { createNumericDocument, weightedSum } from './numericDocument'

const FIRST_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const
// The first check digit joins the number, with weight 2 at the end.
const SECOND_WEIGHTS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 2] as const

/** Module 11: 11 minus the remainder, and 0 when the remainder is 0 or 1. */
function digit(sum: number): number {
  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest
}

function checkDigits(base: string): string {
  const first = digit(weightedSum(base, FIRST_WEIGHTS))
  const second = digit(weightedSum(base + first, SECOND_WEIGHTS))
  return `${first}${second}`
}

/** CNH: the driver licence number (registro), 11 digits, the last two being check digits. */
export const cnh = createNumericDocument({
  name: 'CNH',
  feminine: true,
  length: 11,
  baseLength: 9,
  checkDigits,
  format: (digits) => digits,
  mask: '00000000000',
})

export const cnhCheckDigits = checkDigits
