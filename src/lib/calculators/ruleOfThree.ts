import { formatNumber as n, formatOperand as p } from './number'
import { fail, ok, type ToolResult } from '../result'

export type Proportion = 'direct' | 'inverse'

export interface RuleOfThreeResult {
  value: number
  display: string
  formula: string
  steps: string[]
  summary: string
}

/**
 * Solves "A is to B as C is to X".
 * Direct: when one quantity grows the other grows too — X = B × C ÷ A.
 * Inverse: when one grows the other shrinks — X = A × B ÷ C.
 */
export function solveRuleOfThree(a: number, b: number, c: number, proportion: Proportion = 'direct'): ToolResult<RuleOfThreeResult> {
  if (![a, b, c].every(Number.isFinite)) return fail('Informe três números válidos.')

  const direct = proportion === 'direct'
  const divisor = direct ? a : c
  if (divisor === 0) {
    return fail(`O valor ${direct ? 'A' : 'C'} não pode ser zero.`, {
      hint: `Na regra de três ${direct ? 'direta, X = B × C ÷ A' : 'inversa, X = A × B ÷ C'}. Não existe divisão por zero.`,
    })
  }

  const [left, right] = direct ? [b, c] : [a, b]
  const product = left * right
  // When the product overflows, dividing first still gives the right answer.
  const value = Number.isFinite(product) ? product / divisor : (left / divisor) * right
  if (!Number.isFinite(value)) {
    return fail('O resultado é grande demais para ser calculado.', { hint: 'Use números menores.' })
  }

  const [leftName, rightName, divisorName] = direct ? ['B', 'C', 'A'] : ['A', 'B', 'C']
  const steps = [`${divisorName} × X = ${leftName} × ${rightName}`, `${p(divisor)} × X = ${p(left)} × ${p(right)}`]
  if (Number.isFinite(product)) steps.push(`${p(divisor)} × X = ${n(product)}`, `X = ${n(product)} ÷ ${p(divisor)} = ${n(value)}`)
  else steps.push(`X = ${p(left)} ÷ ${p(divisor)} × ${p(right)} = ${n(value)}`)

  return ok({
    value,
    display: n(value),
    formula: `X = ${leftName} × ${rightName} ÷ ${divisorName}`,
    steps,
    summary: `Se ${n(a)} corresponde a ${n(b)}, então ${n(c)} corresponde a ${n(value)}${direct ? '' : ' (grandezas inversamente proporcionais)'}.`,
  })
}
