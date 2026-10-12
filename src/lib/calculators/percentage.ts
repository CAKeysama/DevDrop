import { formatNumber as n, formatOperand as p } from './number'
import { fail, ok, type ToolResult } from '../result'

export type PercentageMode = 'percent-of' | 'what-percent' | 'increase' | 'decrease' | 'change'

export interface PercentageModeInfo {
  id: PercentageMode
  label: string
  question: string
  /** Labels of the two inputs, in order. */
  fields: [string, string]
  example: [string, string]
}

export const percentageModes: PercentageModeInfo[] = [
  { id: 'percent-of', label: 'X% de Y', question: 'Quanto é X% de Y?', fields: ['Porcentagem (X)', 'Valor (Y)'], example: ['15', '240'] },
  { id: 'what-percent', label: 'X é quantos % de Y', question: 'X representa quantos por cento de Y?', fields: ['Parte (X)', 'Total (Y)'], example: ['30', '120'] },
  { id: 'increase', label: 'Aumento', question: 'Quanto fica Y com um aumento de X%?', fields: ['Valor inicial (Y)', 'Aumento em % (X)'], example: ['200', '10'] },
  { id: 'decrease', label: 'Desconto', question: 'Quanto fica Y com uma redução de X%?', fields: ['Valor inicial (Y)', 'Redução em % (X)'], example: ['200', '25'] },
  { id: 'change', label: 'Variação', question: 'Qual a variação percentual de A para B?', fields: ['Valor inicial (A)', 'Valor final (B)'], example: ['80', '100'] },
]

export interface PercentageResult {
  value: number
  /** Result ready to display, with its unit. */
  display: string
  formula: string
  steps: string[]
  /** Sentence explaining the result in plain words. */
  summary: string
}

export function calculatePercentage(mode: PercentageMode, first: number, second: number): ToolResult<PercentageResult> {
  if (!Number.isFinite(first) || !Number.isFinite(second)) return fail('Informe dois números válidos.')
  const result = compute(mode, first, second)
  if (result.result && !Number.isFinite(result.result.value)) {
    return fail('O resultado é grande demais para ser calculado.', { hint: 'Use números menores.' })
  }
  return result
}

function compute(mode: PercentageMode, first: number, second: number): ToolResult<PercentageResult> {
  switch (mode) {
    case 'percent-of': {
      const value = (first / 100) * second
      return ok({
        value,
        display: n(value),
        formula: 'X ÷ 100 × Y',
        steps: [`${n(first)} ÷ 100 = ${n(first / 100)}`, `${n(first / 100)} × ${p(second)} = ${n(value)}`],
        summary: `${n(first)}% de ${n(second)} é ${n(value)}.`,
      })
    }
    case 'what-percent': {
      if (second === 0) return divisionByZero('O total (Y)')
      const value = (first / second) * 100
      return ok({
        value,
        display: `${n(value)}%`,
        formula: 'X ÷ Y × 100',
        steps: [`${n(first)} ÷ ${p(second)} = ${n(first / second)}`, `${n(first / second)} × 100 = ${n(value)}%`],
        summary: `${n(first)} representa ${n(value)}% de ${n(second)}.`,
      })
    }
    case 'increase':
    case 'decrease': {
      if (second < 0) {
        return fail('A porcentagem não pode ser negativa.', {
          hint: mode === 'increase' ? 'Para reduzir o valor, use o modo “Desconto”.' : 'Para aumentar o valor, use o modo “Aumento”.',
        })
      }
      const sign = mode === 'increase' ? 1 : -1
      const delta = (first * second) / 100
      const value = first + sign * delta
      const operator = sign === 1 ? '+' : '−'
      return ok({
        value,
        display: n(value),
        formula: `Y ${operator} (Y × X ÷ 100)`,
        steps: [`${n(first)} × ${n(second)} ÷ 100 = ${n(delta)}`, `${n(first)} ${operator} ${p(delta)} = ${n(value)}`],
        summary:
          mode === 'increase'
            ? `${n(first)} com aumento de ${n(second)}% fica ${n(value)} (acréscimo de ${n(delta)}).`
            : `${n(first)} com redução de ${n(second)}% fica ${n(value)} (desconto de ${n(delta)}).`,
      })
    }
    case 'change': {
      if (first === 0) return divisionByZero('O valor inicial (A)')
      const difference = second - first
      const ratio = difference / Math.abs(first)
      const value = ratio * 100
      const direction = value > 0 ? 'aumento' : 'redução'
      return ok({
        value,
        display: `${value > 0 ? '+' : ''}${n(value)}%`,
        formula: '(B − A) ÷ |A| × 100',
        steps: [`${n(second)} − ${p(first)} = ${n(difference)}`, `${n(difference)} ÷ ${n(Math.abs(first))} = ${n(ratio)}`, `${n(ratio)} × 100 = ${n(value)}%`],
        summary:
          value === 0
            ? `De ${n(first)} para ${n(second)} não há variação.`
            : `De ${n(first)} para ${n(second)} há ${direction} de ${n(Math.abs(value))}%.`,
      })
    }
  }
}

function divisionByZero(label: string): ToolResult<PercentageResult> {
  return fail(`${label} não pode ser zero.`, { hint: 'Não existe divisão por zero. Informe um valor diferente de zero.' })
}
