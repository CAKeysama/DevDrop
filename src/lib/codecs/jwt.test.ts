import { describe, expect, it } from 'vitest'
import {
  decodeJwt,
  JWT_EXAMPLE,
  JWT_EXPIRED_EXAMPLE,
} from './jwt'

describe('JWT Decoder', () => {
  it('decodes a valid JWT properly', () => {
    const res = decodeJwt(JWT_EXAMPLE)
    expect(res.error).toBeUndefined()
    expect(res.data).toBeDefined()

    const { header, payload, signature, algorithm, type } = res.data!
    expect(header.alg).toBe('HS256')
    expect(algorithm).toBe('HS256')
    expect(type).toBe('JWT')
    expect(payload.sub).toBe('1234567890')
    expect(payload.name).toBe('Ana Silva')
    expect(signature).toBeDefined()
    expect(typeof payload.exp).toBe('number')
  })

  it('detects an expired JWT and marks isExpired as true', () => {
    const res = decodeJwt(JWT_EXPIRED_EXAMPLE)
    expect(res.error).toBeUndefined()
    expect(res.data).toBeDefined()
    expect(res.data!.isExpired).toBe(true)
    expect(res.data!.expirationSummary).toContain('Expirou')
  })

  it('handles JWT without optional claims (like exp or iat)', () => {
    // Header: {"alg":"none"} => eyJhbGciOiJub25lIn0
    // Payload: {"custom":"data"} => eyJjdXN0b20iOiJkYXRhIn0
    // Signature: empty string
    const token = 'eyJhbGciOiJub25lIn0.eyJjdXN0b20iOiJkYXRhIn0.'
    const res = decodeJwt(token)
    expect(res.error).toBeUndefined()
    expect(res.data).toBeDefined()
    expect(res.data!.payload.custom).toBe('data')
    expect(res.data!.isExpired).toBeNull()
    expect(res.data!.expiresAt).toBeNull()
    expect(res.data!.expirationSummary).toContain('Sem data de expiração')
  })

  it('returns clear error on malformed tokens with wrong parts count', () => {
    const res1 = decodeJwt('header.only')
    expect(res1.data).toBeUndefined()
    expect(res1.error).toContain('exatamente 3 partes')

    const res2 = decodeJwt('one.two.three.four')
    expect(res2.data).toBeUndefined()
    expect(res2.error).toContain('exatamente 3 partes')
  })

  it('returns error on corrupted base64 or invalid JSON in parts', () => {
    const res = decodeJwt('eyJinvalid.eyJpayload.signature')
    expect(res.data).toBeUndefined()
    expect(res.error).toBeDefined()
  })

  it('handles empty input gracefully', () => {
    const res = decodeJwt('   ')
    expect(res.data).toBeUndefined()
    expect(res.error).toContain('vazia')
  })
})
