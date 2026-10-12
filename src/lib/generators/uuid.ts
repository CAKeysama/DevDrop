import { fail, ok, type ToolResult } from '../result'

export const UUID_MAX_QUANTITY = 500

const hex = (byte: number) => byte.toString(16).padStart(2, '0')

/** UUID v4 from crypto.getRandomValues, for browsers without crypto.randomUUID. */
export function uuidV4FromRandomValues(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40 // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // RFC 4122 variant
  const h = Array.from(bytes, hex).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

/** Random UUID (version 4) from a cryptographically secure source. */
export function generateUuid(): string {
  return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : uuidV4FromRandomValues()
}

/** Applies the display options to a canonical (lowercase, hyphenated) UUID. */
export function formatUuid(id: string, { uppercase = false, hyphens = true }: { uppercase?: boolean; hyphens?: boolean } = {}): string {
  const value = hyphens ? id : id.replace(/-/g, '')
  return uppercase ? value.toUpperCase() : value
}

export interface UuidOptions {
  quantity: number
  uppercase?: boolean
  hyphens?: boolean
}

export function generateUuids({ quantity, uppercase = false, hyphens = true }: UuidOptions): ToolResult<string[]> {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > UUID_MAX_QUANTITY) {
    return fail(`A quantidade precisa ser um número inteiro entre 1 e ${UUID_MAX_QUANTITY}.`)
  }
  return ok(Array.from({ length: quantity }, () => formatUuid(generateUuid(), { uppercase, hyphens })))
}

export const isUuidV4 = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
