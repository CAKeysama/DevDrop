import { secureRandomInt, type RandomInt } from '../random'
import { createNumericDocument, type NumericDocument } from './numericDocument'

/** The two digits before the check digits say where the voter registered. */
export const voterStates = [
  { code: '01', uf: 'SP', name: 'São Paulo' },
  { code: '02', uf: 'MG', name: 'Minas Gerais' },
  { code: '03', uf: 'RJ', name: 'Rio de Janeiro' },
  { code: '04', uf: 'RS', name: 'Rio Grande do Sul' },
  { code: '05', uf: 'BA', name: 'Bahia' },
  { code: '06', uf: 'PR', name: 'Paraná' },
  { code: '07', uf: 'CE', name: 'Ceará' },
  { code: '08', uf: 'PE', name: 'Pernambuco' },
  { code: '09', uf: 'SC', name: 'Santa Catarina' },
  { code: '10', uf: 'GO', name: 'Goiás' },
  { code: '11', uf: 'MA', name: 'Maranhão' },
  { code: '12', uf: 'PB', name: 'Paraíba' },
  { code: '13', uf: 'PA', name: 'Pará' },
  { code: '14', uf: 'ES', name: 'Espírito Santo' },
  { code: '15', uf: 'PI', name: 'Piauí' },
  { code: '16', uf: 'RN', name: 'Rio Grande do Norte' },
  { code: '17', uf: 'AL', name: 'Alagoas' },
  { code: '18', uf: 'MT', name: 'Mato Grosso' },
  { code: '19', uf: 'MS', name: 'Mato Grosso do Sul' },
  { code: '20', uf: 'DF', name: 'Distrito Federal' },
  { code: '21', uf: 'SE', name: 'Sergipe' },
  { code: '22', uf: 'AM', name: 'Amazonas' },
  { code: '23', uf: 'RO', name: 'Rondônia' },
  { code: '24', uf: 'AC', name: 'Acre' },
  { code: '25', uf: 'AP', name: 'Amapá' },
  { code: '26', uf: 'RR', name: 'Roraima' },
  { code: '27', uf: 'TO', name: 'Tocantins' },
  { code: '28', uf: 'ZZ', name: 'Exterior' },
] as const

/** São Paulo and Minas Gerais: a remainder of 0 gives the digit 1 instead of 0. */
const isSpecialState = (code: string) => code === '01' || code === '02'

function digit(sum: number, special: boolean): number {
  const rest = sum % 11
  if (rest === 10) return 0
  if (rest === 0 && special) return 1
  return rest
}

function computeCheckDigits(base: string, special: boolean): string {
  let sum = 0
  for (let i = 0; i < 8; i++) sum += Number(base[i]) * (i + 2)
  const first = digit(sum, special)
  const second = digit(Number(base[8]) * 7 + Number(base[9]) * 8 + first * 9, special)
  return `${first}${second}`
}

/** `base` is the 8 sequential digits followed by the 2 of the state. */
function checkDigits(base: string): string {
  return computeCheckDigits(base, isSpecialState(base.slice(8, 10)))
}

function stateRule(digits: string) {
  const code = digits.slice(8, 10)
  if (voterStates.some((state) => state.code === code)) return null
  return {
    message: 'Título inválido: o código do estado não existe.',
    hint: `As posições 9 e 10 (${code}) devem ser um código de 01 a 28: 01 é São Paulo, 02 é Minas Gerais… e 28 é o exterior.`,
  }
}

export type VoterStateCode = (typeof voterStates)[number]['code']

/** The number as the validator sees it, and a generator that can be pinned to one state. */
function build(state: VoterStateCode | 'any'): NumericDocument {
  return createNumericDocument({
    name: 'Título de eleitor',
    length: 12,
    baseLength: 10,
    checkDigits,
    format: (digits) => digits.replace(/^(\d{4})(\d{4})(\d{4})$/, '$1 $2 $3'),
    mask: '0000 0000 0000',
    extraRule: stateRule,
    randomBase: (random) => {
      const sequence = Array.from({ length: 8 }, () => random(10)).join('')
      const code = state === 'any' ? voterStates[random(voterStates.length)].code : state
      return sequence + code
    },
    // The sources of the rule for São Paulo and Minas disagree on some remainders; hand out
    // only numbers that come out the same with or without it.
    acceptGenerated: (digits) => {
      const base = digits.slice(0, 10)
      return computeCheckDigits(base, true) === computeCheckDigits(base, false)
    },
  })
}

const voterId = build('any')

export const voterIdCheckDigits = checkDigits
export const formatVoterId = voterId.format
export const displayVoterId = voterId.display
export const validateVoterId = voterId.validate

/** A voter ID registered in `state` (a code from `voterStates`), or in a random state. */
export function generateVoterId(state: VoterStateCode | 'any' = 'any', masked = true, randomInt: RandomInt = secureRandomInt): string {
  return build(state).generate(masked, randomInt)
}
