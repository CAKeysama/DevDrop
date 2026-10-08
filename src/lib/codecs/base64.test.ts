import { describe, expect, it } from 'vitest'
import {
  BASE64_ENCODED_EXAMPLE,
  BASE64_TEXT_EXAMPLE,
  decodeBase64,
  encodeBase64,
} from './base64'

describe('Base64 Codec', () => {
  it('encodes standard ASCII string', () => {
    const raw = 'Hello World'
    const encoded = encodeBase64(raw)
    expect(encoded.error).toBeUndefined()
    expect(encoded.result).toBe('SGVsbG8gV29ybGQ=')
  })

  it('decodes standard Base64 string', () => {
    const raw = 'SGVsbG8gV29ybGQ='
    const decoded = decodeBase64(raw)
    expect(decoded.error).toBeUndefined()
    expect(decoded.result).toBe('Hello World')
  })

  it('supports full Unicode including accents and emojis', () => {
    const raw = BASE64_TEXT_EXAMPLE
    const enc = encodeBase64(raw)
    expect(enc.error).toBeUndefined()
    expect(enc.result).toBe(BASE64_ENCODED_EXAMPLE)

    const dec = decodeBase64(enc.result)
    expect(dec.error).toBeUndefined()
    expect(dec.result).toBe(raw)
  })

  it('handles URL-safe base64 with - and _ without padding', () => {
    // Standard: SGVsbG8+/?
    // URL-safe: SGVsbG8-/_
    const raw = '{"test": true}'
    const enc = encodeBase64(raw)
    const urlSafe = enc.result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    const dec = decodeBase64(urlSafe)
    expect(dec.error).toBeUndefined()
    expect(dec.result).toBe(raw)
  })

  it('returns clear error on invalid base64 characters', () => {
    const invalid = 'SGVsbG8!!!@@@'
    const res = decodeBase64(invalid)
    expect(res.result).toBe('')
    expect(res.error).toBeDefined()
    expect(res.error).toContain('inválida')
  })

  it('handles empty inputs with friendly message', () => {
    expect(encodeBase64('').error).toContain('vazia')
    expect(decodeBase64('   ').error).toContain('vazia')
  })
})
