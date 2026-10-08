import { describe, expect, it } from 'vitest'
import {
  decodeUrl,
  encodeUrl,
  URL_ENCODED_EXAMPLE,
  URL_RAW_EXAMPLE,
} from './url'

describe('URL Codec', () => {
  it('encodes full URL parameters with component mode', () => {
    const raw = URL_RAW_EXAMPLE
    const res = encodeUrl(raw, 'component')
    expect(res.error).toBeUndefined()
    expect(res.result).toBe(URL_ENCODED_EXAMPLE)
  })

  it('encodes preserving URL structure with full mode', () => {
    const raw = 'https://devdrop.com.br/busca?q=espaço e acentuação'
    const res = encodeUrl(raw, 'full')
    expect(res.error).toBeUndefined()
    expect(res.result).toBe('https://devdrop.com.br/busca?q=espa%C3%A7o%20e%20acentua%C3%A7%C3%A3o')
  })

  it('decodes encoded URL successfully', () => {
    const encoded = URL_ENCODED_EXAMPLE
    const res = decodeUrl(encoded)
    expect(res.error).toBeUndefined()
    expect(res.result).toBe(URL_RAW_EXAMPLE)
  })

  it('decodes plus (+) as space', () => {
    const raw = 'termo+de+busca+online'
    const res = decodeUrl(raw)
    expect(res.result).toBe('termo de busca online')
  })

  it('handles invalid percent-encoded sequence without crashing', () => {
    const invalid = 'https://devdrop.com.br?broken=%ZZ%E0'
    const res = decodeUrl(invalid)
    expect(res.result).toBe('')
    expect(res.error).toBeDefined()
    expect(res.error).toContain('sequência de escape percentual inválida')
  })

  it('handles empty input gracefully', () => {
    expect(encodeUrl('').error).toContain('vazia')
    expect(decodeUrl('   ').error).toContain('vazia')
  })
})
