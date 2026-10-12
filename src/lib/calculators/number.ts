import { fail, ok, type ToolResult } from '../result'

/**
 * Parses a number typed by a person, following Brazilian notation — the same notation the
 * results are shown in, so a copied result can always be pasted back:
 *
 * - comma is the decimal separator: "1250,75";
 * - dots group thousands and must come in groups of three: "1.250,75", "1.000", "1.000.000";
 * - a single dot that is not a thousands group is accepted as a decimal point: "3.14", "0.5".
 *
 * Anything ambiguous or malformed ("1,234.56", "1..5", "1.23.4") is rejected, never guessed.
 */
export function parseNumber(raw: string, label = 'O valor'): ToolResult<number> {
  // A trailing % is tolerated so a copied result such as "25%" can be pasted back.
  const text = raw.trim().replace(/\s/g, '').replace(/%$/, '')
  if (text === '') return fail(`${label} está vazio.`, { hint: 'Digite um número.' })

  const match = /^([+-]?)([\d.]*)(?:,(\d*))?(?:e([+-]?\d+))?$/i.exec(text)
  if (!match) return invalid(label, raw)
  const [, sign, integerPart, commaDecimals, exponent] = match
  const hasComma = commaDecimals !== undefined

  let digits: string
  if (!integerPart.includes('.')) {
    digits = integerPart
  } else if (/^[1-9]\d{0,2}(\.\d{3})+$/.test(integerPart)) {
    digits = integerPart.replace(/\./g, '') // thousands groups
  } else if (!hasComma && /^\d*\.\d+$/.test(integerPart)) {
    digits = integerPart // single decimal point, as in "3.14"
  } else {
    return invalid(label, raw)
  }

  if (hasComma && commaDecimals === '') return invalid(label, raw)
  if (digits === '' && !hasComma) return invalid(label, raw)

  const value = Number(`${sign}${digits || '0'}${hasComma ? `.${commaDecimals}` : ''}${exponent ? `e${exponent}` : ''}`)
  if (!Number.isFinite(value)) {
    return fail(`${label} é grande demais para ser calculado.`, { hint: 'Use um número menor.' })
  }
  return ok(value)
}

function invalid(label: string, raw: string): ToolResult<number> {
  return fail(`${label} não é um número válido: “${raw.trim()}”.`, {
    hint: 'Use vírgula para os decimais e, se quiser, ponto a cada três dígitos. Exemplos: 1250,75 ou 1.250,75.',
  })
}

const plain = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 6 })
const small = new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 6 })
const scientific = new Intl.NumberFormat('pt-BR', { notation: 'scientific', maximumSignificantDigits: 6 })

/**
 * Formats a number in pt-BR without ever showing a non-zero value as zero: values below 1 keep
 * 6 significant digits and extreme magnitudes use scientific notation (1,5E-10).
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—'
  if (value === 0) return '0'
  const magnitude = Math.abs(value)
  if (magnitude >= 1e15 || magnitude < 1e-6) return scientific.format(value)
  const text = (magnitude < 1 ? small : plain).format(value)
  return text === '-0' ? '0' : text
}

/** Like formatNumber, but wraps negatives in parentheses so "50 − (-50)" stays readable. */
export function formatOperand(value: number): string {
  const text = formatNumber(value)
  return value < 0 && text !== '0' ? `(${text})` : text
}

/**
 * Says how a typed number containing a dot was understood, since a dot can be a thousands
 * separator ("1.250") or a decimal point ("3.14"). Returns null when there is nothing to explain.
 */
export function describeDotReading(raw: string): string | null {
  const text = raw.trim().replace(/\s/g, '').replace(/%$/, '')
  if (!text.includes('.') || text.includes(',')) return null
  const parsed = parseNumber(raw)
  if (parsed.result === null) return null
  const unsigned = text.replace(/^[+-]/, '').replace(/e[+-]?\d+$/i, '')
  return /^[1-9]\d{0,2}(\.\d{3})+$/.test(unsigned)
    ? `Lido como ${String(parsed.result)}: o ponto separa milhares. Para decimais, use vírgula.`
    : `Lido como ${String(parsed.result).replace('.', ',')}: o ponto foi entendido como vírgula decimal.`
}
