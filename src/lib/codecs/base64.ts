/**
 * Robust UTF-8 Base64 encoding and decoding with full Unicode support.
 */

export interface CodecResult {
  result: string
  error?: string
}

/**
 * Encodes a UTF-8 string to Base64 safely without breaking on multi-byte characters.
 */
export function encodeBase64(input: string): CodecResult {
  if (!input) {
    return { result: '', error: 'A entrada está vazia. Digite ou cole um texto para codificar.' }
  }

  try {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(input)
    let binary = ''
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return { result: btoa(binary) }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return { result: '', error: `Erro ao codificar para Base64: ${error.message}` }
  }
}

/**
 * Decodes a Base64 string back to UTF-8 text. Validates syntax and padding.
 */
export function decodeBase64(input: string): CodecResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { result: '', error: 'A entrada está vazia. Digite ou cole um Base64 para decodificar.' }
  }

  // Basic regex check for Base64 (standard and URL-safe)
  // Allows valid base64 chars + padding
  const sanitized = trimmed.replace(/\s+/g, '')
  const base64Regex = /^[A-Za-z0-9+/_-]+={0,2}$/
  if (!base64Regex.test(sanitized)) {
    return {
      result: '',
      error: 'Entrada Base64 inválida: contém caracteres não permitidos.',
    }
  }

  try {
    // Normalise url-safe base64
    let normalized = sanitized.replace(/-/g, '+').replace(/_/g, '/')
    while (normalized.length % 4 !== 0) {
      normalized += '='
    }

    const binary = atob(normalized)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const decoder = new TextDecoder('utf-8', { fatal: true })
    const decoded = decoder.decode(bytes)
    return { result: decoded }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return {
      result: '',
      error: `Entrada Base64 inválida ou corrompida: ${error.message}`,
    }
  }
}

export const BASE64_TEXT_EXAMPLE = 'DevDrop: Utilitários online para desenvolvedores modernos! 🚀 🇧🇷'
export const BASE64_ENCODED_EXAMPLE = 'RGV2RHJvcDogVXRpbGl0w6FyaW9zIG9ubGluZSBwYXJhIGRlc2Vudm9sdmVkb3JlcyBtb2Rlcm5vcyEg8J+agCDwn4en8J+Htw=='
