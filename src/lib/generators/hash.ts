export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'

export interface HashAlgorithmInfo {
  id: HashAlgorithm
  bits: number
  description: string
  /** False when the algorithm must not be relied on for security. */
  secure: boolean
}

export const hashAlgorithms: HashAlgorithmInfo[] = [
  {
    id: 'MD5',
    bits: 128,
    secure: false,
    description: 'Rápido e muito difundido, mas quebrado: é possível criar dois conteúdos com o mesmo hash. Use só para conferir integridade de arquivos contra erros acidentais, nunca para segurança.',
  },
  {
    id: 'SHA-1',
    bits: 160,
    secure: false,
    description: 'Também considerado inseguro contra colisões. Ainda aparece em sistemas antigos e no Git, mas não deve ser usado em projetos novos.',
  },
  {
    id: 'SHA-256',
    bits: 256,
    secure: true,
    description: 'Da família SHA-2. É o padrão atual para assinaturas digitais, certificados e verificação de integridade.',
  },
  {
    id: 'SHA-512',
    bits: 512,
    secure: true,
    description: 'Da família SHA-2, com saída maior. Indicado quando se quer margem extra de segurança.',
  },
]

const toHex = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

// MD5 (RFC 1321). Web Crypto does not offer it, so it is implemented here.
const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]
const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x1_0000_0000) >>> 0)

export function md5(bytes: Uint8Array): string {
  const bitLength = bytes.length * 8
  const paddedLength = (((bytes.length + 8) >>> 6) + 1) << 6
  const data = new Uint8Array(paddedLength)
  data.set(bytes)
  data[bytes.length] = 0x80
  const view = new DataView(data.buffer)
  view.setUint32(paddedLength - 8, bitLength >>> 0, true)
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x1_0000_0000), true)

  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476

  for (let offset = 0; offset < paddedLength; offset += 64) {
    let a = a0
    let b = b0
    let c = c0
    let d = d0
    for (let i = 0; i < 64; i++) {
      let f: number
      let g: number
      if (i < 16) {
        f = (b & c) | (~b & d)
        g = i
      } else if (i < 32) {
        f = (d & b) | (~d & c)
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        f = b ^ c ^ d
        g = (3 * i + 5) % 16
      } else {
        f = c ^ (b | ~d)
        g = (7 * i) % 16
      }
      const sum = (a + f + K[i] + view.getUint32(offset + g * 4, true)) >>> 0
      const shift = S[(i >> 4) * 4 + (i % 4)]
      a = d
      d = c
      c = b
      b = (b + ((sum << shift) | (sum >>> (32 - shift)))) >>> 0
    }
    a0 = (a0 + a) >>> 0
    b0 = (b0 + b) >>> 0
    c0 = (c0 + c) >>> 0
    d0 = (d0 + d) >>> 0
  }

  const out = new Uint8Array(16)
  const outView = new DataView(out.buffer)
  ;[a0, b0, c0, d0].forEach((word, index) => outView.setUint32(index * 4, word, true))
  return toHex(out)
}

/** Hash of a text (encoded as UTF-8), as lowercase hexadecimal. Computed locally. */
export async function hashText(text: string, algorithm: HashAlgorithm): Promise<string> {
  const bytes = new TextEncoder().encode(text)
  if (algorithm === 'MD5') return md5(bytes)
  if (!globalThis.crypto?.subtle) {
    throw new Error('Este navegador só calcula SHA em páginas seguras (HTTPS ou localhost).')
  }
  return toHex(new Uint8Array(await crypto.subtle.digest(algorithm, bytes)))
}
