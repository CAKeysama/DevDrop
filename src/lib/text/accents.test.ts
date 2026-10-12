import { describe, expect, it } from 'vitest'
import { removeAccents } from './accents'

const plain = { keepCedilla: false }
const keep = { keepCedilla: true }

describe('removeAccents', () => {
  it('removes every Portuguese accent and the cedilla', () => {
    expect(removeAccents('ação, coração, avião', plain).output).toBe('acao, coracao, aviao')
    expect(removeAccents('ÁÉÍÓÚ áéíóú ÀÈÌÒÙ àèìòù ÂÊÔ âêô ÃÕ ãõ ÜÏ üï ÇÑ çñ', plain).output).toBe('AEIOU aeiou AEIOU aeiou AEO aeo AO ao UI ui CN cn')
  })

  it('counts the letters it changed', () => {
    expect(removeAccents('ação', plain).changed).toBe(2)
    expect(removeAccents('sem acento', plain).changed).toBe(0)
  })

  it('keeps the cedilla when asked, still removing the other accents', () => {
    expect(removeAccents('Ação é coração', keep).output).toBe('Açao e coraçao')
    expect(removeAccents('Ç', keep).output).toBe('Ç')
  })

  it('treats a cedilla typed as c + combining mark like ç', () => {
    expect(removeAccents('ç', plain).output).toBe('c')
    expect(removeAccents('ç', keep).output).toBe('ç')
  })

  it('handles accents written as separate combining marks', () => {
    expect(removeAccents('é ã', plain).output).toBe('e a')
  })

  it('folds letters that do not decompose', () => {
    expect(removeAccents('Ørsted straße Łódź œuvre', plain).output).toBe('Orsted strasse Lodz oeuvre')
  })

  it('leaves other scripts, emoji, digits and punctuation untouched', () => {
    const text = 'हिन्दी й ά 日本語 🚀 1² «x» —'
    expect(removeAccents(text, plain).output).toBe(text.normalize('NFC'))
  })

  it('returns an empty text for an empty input', () => {
    expect(removeAccents('', plain)).toEqual({ output: '', changed: 0 })
  })

  it('is idempotent', () => {
    const once = removeAccents('Pão de açúcar, São João', plain).output
    expect(removeAccents(once, plain).output).toBe(once)
  })
})
