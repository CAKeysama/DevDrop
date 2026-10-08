import type { CodecResult } from './base64'

export type UrlEncodeType = 'component' | 'full'

/**
 * Encodes a URL string or query parameter component safely.
 */
export function encodeUrl(input: string, type: UrlEncodeType = 'component'): CodecResult {
  if (!input) {
    return { result: '', error: 'A entrada está vazia. Digite ou cole uma URL para codificar.' }
  }

  try {
    const encoded = type === 'full' ? encodeURI(input) : encodeURIComponent(input)
    return { result: encoded }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return { result: '', error: `Erro ao codificar URL: ${error.message}` }
  }
}

/**
 * Decodes a percent-encoded URL string safely, intercepting URIError.
 */
export function decodeUrl(input: string, decodePlusAsSpace = true): CodecResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { result: '', error: 'A entrada está vazia. Digite ou cole uma URL codificada para decodificar.' }
  }

  try {
    const normalized = decodePlusAsSpace ? trimmed.replace(/\+/g, '%20') : trimmed
    const decoded = decodeURIComponent(normalized)
    return { result: decoded }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    if (error.name === 'URIError') {
      return {
        result: '',
        error:
          'A entrada contém uma sequência de escape percentual inválida ou incompleta (ex: "%" não seguido por dígitos hexadecimais válidos).',
      }
    }
    return { result: '', error: `Erro ao decodificar URL: ${error.message}` }
  }
}

export const URL_RAW_EXAMPLE = 'https://devdrop.com.br/busca?termo=desenvolvimento ágil & categoria=ferramentas#secao-1'
export const URL_ENCODED_EXAMPLE = 'https%3A%2F%2Fdevdrop.com.br%2Fbusca%3Ftermo%3Ddesenvolvimento%20%C3%A1gil%20%26%20categoria%3Dferramentas%23secao-1'
