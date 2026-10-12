import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { cnpjCheckDigits, displayCnpj, formatCnpj, generateCnpj, validateCnpj } from './cnpj'
import { cpfCheckDigits, displayCpf, formatCpf, generateCpf, validateCpf } from './cpf'
import { hashText, md5 } from './hash'
import { generateLorem } from './lorem'
import { generateUuids, isUuidV4, uuidV4FromRandomValues } from './uuid'

const value = <T>(outcome: { result: T | null; error?: string }): T => {
  if (outcome.error !== undefined || outcome.result === null) throw new Error('expected a result, got ' + outcome.error)
  return outcome.result
}

describe('UUID', () => {
  it('generates valid, unique v4 identifiers', () => {
    const ids = value(generateUuids({ quantity: 500 }))
    expect(ids).toHaveLength(500)
    expect(ids.every(isUuidV4)).toBe(true)
    expect(new Set(ids).size).toBe(500)
  })

  it('has a correct fallback', () => {
    for (let i = 0; i < 200; i++) expect(isUuidV4(uuidV4FromRandomValues())).toBe(true)
  })

  it('supports uppercase and no hyphens', () => {
    expect(value(generateUuids({ quantity: 1, uppercase: true }))[0]).toMatch(/^[0-9A-F-]{36}$/)
    expect(value(generateUuids({ quantity: 1, hyphens: false }))[0]).toMatch(/^[0-9a-f]{32}$/)
  })

  it('validates the quantity', () => {
    for (const quantity of [0, -1, 501, 1.5, NaN]) expect(generateUuids({ quantity }).error === undefined, String(quantity)).toBe(false)
  })
})
describe('Lorem Ipsum', () => {
  const words = (text: string) => text.split(/\s+/).filter(Boolean)

  it('generates exactly the requested number of words', () => {
    for (const count of [1, 3, 8, 9, 250, 1000]) {
      expect(words(value(generateLorem({ unit: 'words', count })))).toHaveLength(count)
    }
    expect(value(generateLorem({ unit: 'words', count: 5 }))).toBe('lorem ipsum dolor sit amet')
  })

  it('generates exactly the requested number of sentences', () => {
    const text = value(generateLorem({ unit: 'sentences', count: 7 }))
    expect(text.match(/\./g)).toHaveLength(7)
    expect(text.startsWith('Lorem ipsum dolor sit amet')).toBe(true)
    expect(text).toMatch(/^[A-Z]/)
  })

  it('generates exactly the requested number of paragraphs', () => {
    const paragraphs = value(generateLorem({ unit: 'paragraphs', count: 4 })).split('\n\n')
    expect(paragraphs).toHaveLength(4)
    for (const paragraph of paragraphs) expect(paragraph.match(/\./g)!.length).toBeGreaterThanOrEqual(4)
  })

  it('never breaks the classic opening with a comma', () => {
    for (let i = 0; i < 300; i++) {
      expect(value(generateLorem({ unit: 'sentences', count: 2 }))).toMatch(/^Lorem ipsum dolor sit amet[ ,.]/)
    }
  })

  it('can skip the classic opening', () => {
    const fixed = () => 0.99
    expect(value(generateLorem({ unit: 'sentences', count: 1, startWithLorem: false }, fixed))).not.toMatch(/^Lorem ipsum/)
  })

  it('enforces limits', () => {
    expect(generateLorem({ unit: 'words', count: 1001 }).error === undefined).toBe(false)
    expect(generateLorem({ unit: 'sentences', count: 101 }).error === undefined).toBe(false)
    expect(generateLorem({ unit: 'paragraphs', count: 21 }).error === undefined).toBe(false)
    expect(generateLorem({ unit: 'paragraphs', count: 0 }).error === undefined).toBe(false)
    expect(generateLorem({ unit: 'words', count: 2.5 }).error === undefined).toBe(false)
  })
})
describe('hash', () => {
  const reference = (algorithm: string, text: string) => createHash(algorithm).update(text, 'utf8').digest('hex')

  it('matches known MD5 vectors', () => {
    expect(md5(new Uint8Array())).toBe('d41d8cd98f00b204e9800998ecf8427e')
    expect(md5(new TextEncoder().encode('abc'))).toBe('900150983cd24fb0d6963f7d28e17f72')
    expect(md5(new TextEncoder().encode('The quick brown fox jumps over the lazy dog'))).toBe('9e107d9d372bb6826bd81d3542a419d6')
  })

  it('matches the reference implementation for every algorithm and many inputs', async () => {
    const inputs = ['', 'a', 'ção 你好 🚀', 'x'.repeat(55), 'x'.repeat(56), 'x'.repeat(63), 'x'.repeat(64), 'x'.repeat(65), 'linha\n'.repeat(20_000)]
    for (const input of inputs) {
      expect(await hashText(input, 'MD5')).toBe(reference('md5', input))
      expect(await hashText(input, 'SHA-1')).toBe(reference('sha1', input))
      expect(await hashText(input, 'SHA-256')).toBe(reference('sha256', input))
      expect(await hashText(input, 'SHA-512')).toBe(reference('sha512', input))
    }
  })
})
describe('CPF', () => {
  it('validates known numbers', () => {
    expect(validateCpf('529.982.247-25').valid).toBe(true)
    expect(validateCpf('52998224725').valid).toBe(true)
    expect(validateCpf(' 529 982 247 25 ').formatted).toBe('529.982.247-25')
    expect(cpfCheckDigits('529982247')).toBe('25')
    expect(formatCpf('52998224725')).toBe('529.982.247-25')
  })

  it('detects mathematically invalid numbers', () => {
    expect(validateCpf('529.982.247-24').valid).toBe(false)
    expect(validateCpf('529.982.247-35').valid).toBe(false)
    expect(validateCpf('529.982.247-24').hint).toMatch(/25/)
    for (let digit = 0; digit <= 9; digit++) expect(validateCpf(String(digit).repeat(11)).valid).toBe(false)
  })

  it('rejects punctuation out of place', () => {
    expect(validateCpf('5.2.9.9.8.2.2.4.7-2-5').valid).toBe(false)
    expect(validateCpf('529-982-247.25').valid).toBe(false)
    expect(validateCpf('529982247-25').valid).toBe(true)
    expect(validateCnpj('1/1/2/2/2/3/3/3/0/0/0/1/8/1').valid).toBe(false)
    expect(validateCnpj('11222333/0001-81').valid).toBe(true)
    expect(displayCpf('52998224725', true)).toBe('529.982.247-25')
    expect(displayCpf('529.982.247-25', false)).toBe('52998224725')
    expect(displayCnpj('11222333000181', true)).toBe('11.222.333/0001-81')
  })

  it('rejects wrong lengths, letters and empty input', () => {
    expect(validateCpf('').valid).toBe(false)
    expect(validateCpf('123').valid).toBe(false)
    expect(validateCpf('529.982.247-255').valid).toBe(false)
    expect(validateCpf('529.982.247-2a').valid).toBe(false)
    expect(validateCpf('abc.def.ghi-jk').valid).toBe(false)
  })

  it('generates numbers that pass validation, with and without mask', () => {
    for (let i = 0; i < 500; i++) {
      const masked = generateCpf(true)
      expect(masked).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      expect(validateCpf(masked).valid).toBe(true)
    }
    const plain = generateCpf(false)
    expect(plain).toMatch(/^\d{11}$/)
    expect(validateCpf(plain).valid).toBe(true)
  })
})
describe('CNPJ', () => {
  it('validates known numbers', () => {
    expect(validateCnpj('11.222.333/0001-81').valid).toBe(true)
    expect(validateCnpj('11444777000161').valid).toBe(true)
    expect(cnpjCheckDigits('112223330001')).toBe('81')
    expect(formatCnpj('11222333000181')).toBe('11.222.333/0001-81')
  })

  it('validates the alphanumeric format', () => {
    expect(validateCnpj('12.ABC.345/01DE-35').valid).toBe(true)
    expect(validateCnpj('12.abc.345/01de-35').formatted).toBe('12.ABC.345/01DE-35')
    expect(validateCnpj('12.ABC.345/01DE-36').valid).toBe(false)
    expect(validateCnpj('12.ABC.345/01DE-3A').valid).toBe(false)
  })

  it('detects mathematically invalid numbers', () => {
    expect(validateCnpj('11.222.333/0001-82').valid).toBe(false)
    expect(validateCnpj('11.222.333/0001-82').hint).toMatch(/81/)
    expect(validateCnpj('00.000.000/0000-00').valid).toBe(false)
    expect(validateCnpj('11111111111111').valid).toBe(false)
  })

  it('rejects wrong lengths, symbols and empty input', () => {
    expect(validateCnpj('').valid).toBe(false)
    expect(validateCnpj('11.222.333/0001').valid).toBe(false)
    expect(validateCnpj('11.222.333/0001-811').valid).toBe(false)
    expect(validateCnpj('11.222.333/0001-8!').valid).toBe(false)
  })

  it('generates numbers that pass validation in both formats', () => {
    for (let i = 0; i < 300; i++) {
      const numeric = generateCnpj()
      expect(numeric).toMatch(/^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/)
      expect(validateCnpj(numeric).valid).toBe(true)
      const alpha = generateCnpj({ alphanumeric: true, masked: false })
      expect(alpha).toMatch(/^[0-9A-Z]{8}0001\d{2}$/)
      expect(validateCnpj(alpha).valid).toBe(true)
    }
  })
})
