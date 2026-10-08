import { decodeBase64 } from './base64'

export interface JwtHeader {
  alg?: string
  typ?: string
  kid?: string
  [key: string]: unknown
}

export interface JwtPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
  [key: string]: unknown
}

export interface DecodedJwt {
  header: JwtHeader
  payload: JwtPayload
  signature: string
  rawHeaderJson: string
  rawPayloadJson: string
  formattedHeader: string
  formattedPayload: string
  algorithm: string
  type: string
  isExpired: boolean | null
  expiresAt: Date | null
  issuedAt: Date | null
  notBefore: Date | null
  expirationSummary: string
}

export interface JwtDecodeResult {
  data?: DecodedJwt
  error?: string
}

function decodeBase64Url(part: string): string {
  let normalized = part.replace(/-/g, '+').replace(/_/g, '/')
  while (normalized.length % 4 !== 0) {
    normalized += '='
  }
  const decoded = decodeBase64(normalized)
  if (decoded.error) {
    throw new Error(decoded.error)
  }
  return decoded.result
}

function formatRelativeTime(targetDate: Date, now: Date): string {
  const diffMs = targetDate.getTime() - now.getTime()
  const isPast = diffMs < 0
  const absDiff = Math.abs(diffMs)

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  let timeString: string
  if (days > 0) timeString = `${days} dia${days > 1 ? 's' : ''}`
  else if (hours > 0) timeString = `${hours} hora${hours > 1 ? 's' : ''}`
  else if (minutes > 0) timeString = `${minutes} minuto${minutes > 1 ? 's' : ''}`
  else timeString = `${seconds} segundo${seconds > 1 ? 's' : ''}`

  return isPast ? `Expirou há ${timeString}` : `Expira em ${timeString}`
}

/**
 * Decodes and inspects a JSON Web Token (JWT) strictly on the client side.
 * Never performs signature validation without keys and explicitly warns the user.
 */
export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim()
  if (!trimmed) {
    return { error: 'A entrada está vazia. Cole um token JWT para decodificar.' }
  }

  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    return {
      error: `Formato de JWT inválido: um token JWT deve possuir exatamente 3 partes separadas por pontos (Header.Payload.Signature). Foram encontradas ${parts.length} partes.`,
    }
  }

  const [headerPart, payloadPart, signaturePart] = parts

  let headerJson: string
  let payloadJson: string
  let header: JwtHeader
  let payload: JwtPayload

  // 1. Decode Header
  try {
    headerJson = decodeBase64Url(headerPart)
    header = JSON.parse(headerJson) as JwtHeader
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { error: `Erro ao decodificar a seção Header do token: ${message}` }
  }

  // 2. Decode Payload
  try {
    payloadJson = decodeBase64Url(payloadPart)
    payload = JSON.parse(payloadJson) as JwtPayload
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { error: `Erro ao decodificar a seção Payload do token: ${message}` }
  }

  // 3. Claims analysis
  const now = new Date()
  let isExpired: boolean | null = null
  let expiresAt: Date | null = null
  let expirationSummary = 'Sem data de expiração (claim "exp" não definida)'

  if (typeof payload.exp === 'number' && !isNaN(payload.exp)) {
    expiresAt = new Date(payload.exp * 1000)
    isExpired = now.getTime() >= expiresAt.getTime()
    expirationSummary = `${formatRelativeTime(expiresAt, now)} (${expiresAt.toLocaleString('pt-BR')})`
  }

  const issuedAt =
    typeof payload.iat === 'number' && !isNaN(payload.iat)
      ? new Date(payload.iat * 1000)
      : null

  const notBefore =
    typeof payload.nbf === 'number' && !isNaN(payload.nbf)
      ? new Date(payload.nbf * 1000)
      : null

  const algorithm = header.alg || 'Nenhum (none)'
  const type = header.typ || 'JWT'

  return {
    data: {
      header,
      payload,
      signature: signaturePart,
      rawHeaderJson: headerJson,
      rawPayloadJson: payloadJson,
      formattedHeader: JSON.stringify(header, null, 2),
      formattedPayload: JSON.stringify(payload, null, 2),
      algorithm,
      type,
      isExpired,
      expiresAt,
      issuedAt,
      notBefore,
      expirationSummary,
    },
  }
}

export const JWT_NOTICE =
  'Aviso de Segurança: Este decodificador lê e exibe as informações contidas no Header e Payload. Ele NÃO realiza validação criptográfica da assinatura e a decodificação não comprova a autenticidade ou integridade do token.'

/**
 * Valid sample JWT token (HS256) for demonstration.
 */
export const JWT_EXAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFuYSBTaWx2YSIsImVtYWlsIjoiYW5hLnNpbHZhQGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciIsImFkbWluIl0sImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzk4NzU4NDAwLCJpc3MiOiJkZXZkcm9wLWp3dCJ9.nSdr9mPzY3N1cI5Z9o_v9eKz_K1Z5pE8eX0k5e4l_lE'

/**
 * Expired sample JWT token for testing.
 */
export const JWT_EXPIRED_EXAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvX2V4cGlyYWRvIiwibmFtZSI6IkNhcmxvcyBNZW5kZXMiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMiwiaXNzIjoiZGV2ZHJvcCJ9.4uXb1w10Xv_bK9KqG8FjQ4h_Q1mF_6rG3yU7m5F1k_s'
