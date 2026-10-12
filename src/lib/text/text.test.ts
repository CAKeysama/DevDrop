import { describe, expect, it } from 'vitest'
import { convertCase } from './caseConvert'
import { formatDuration, getTextStats, getTopWords } from './textStats'

describe('text stats', () => {
  it('counts an empty text as zero everywhere', () => {
    expect(getTextStats('')).toEqual({ characters: 0, charactersNoSpaces: 0, words: 0, lines: 0, sentences: 0, paragraphs: 0, bytes: 0, readingSeconds: 0 })
  })

  it('counts characters, words and lines', () => {
    const stats = getTextStats('Olá,  mundo!\nSegunda linha.')
    expect(stats.characters).toBe(27)
    expect(stats.charactersNoSpaces).toBe(23)
    expect(stats.words).toBe(4)
    expect(stats.lines).toBe(2)
    expect(stats.sentences).toBe(2)
  })

  it('treats multiple spaces, tabs and blank lines correctly', () => {
    const stats = getTextStats('  um   dois\t\ttrês \n\n\n quatro  ')
    expect(stats.words).toBe(4)
    expect(stats.lines).toBe(4)
    expect(stats.paragraphs).toBe(2)
    expect(getTextStats('   \n  ').words).toBe(0)
  })

  it('counts compound and contracted words as one, in Portuguese and English', () => {
    expect(getTextStats("guarda-chuva don't d'água e-mail").words).toBe(4)
    expect(getTextStats('ação coração não').words).toBe(3)
    expect(getTextStats('3 itens em 2026').words).toBe(4)
    expect(getTextStats('— … !!! ???').words).toBe(0)
  })

  it('counts emoji and combining characters as one character', () => {
    expect(getTextStats('👩‍👩‍👧').characters).toBe(1)
    expect(getTextStats('é').characters).toBe(1)
    expect(getTextStats('ção').characters).toBe(3)
    expect(getTextStats('ç').bytes).toBe(2)
    expect(getTextStats('🚀').bytes).toBe(4)
  })

  it('handles Windows line endings', () => {
    expect(getTextStats('a\r\nb\r\nc').lines).toBe(3)
  })

  it('estimates reading time', () => {
    expect(getTextStats('palavra '.repeat(300)).readingSeconds).toBe(90)
    expect(formatDuration(90)).toBe('1 min 30 s')
    expect(formatDuration(45)).toBe('45 s')
    expect(formatDuration(120)).toBe('2 min')
  })

  it('ranks the most frequent words, ignoring case and short words', () => {
    expect(getTopWords('Casa casa CASA de de de de rua Rua sol', 2)).toEqual([
      { word: 'casa', count: 3 },
      { word: 'rua', count: 2 },
    ])
    expect(getTopWords('')).toEqual([])
  })

  it('handles a large text', () => {
    expect(getTextStats('lorem ipsum dolor\n'.repeat(50_000)).words).toBe(150_000)
  })
})
describe('case converter', () => {
  const text = 'oLÁ, mundo! a AÇÃO de hoje. e-mail: Teste'

  it('converts every mode', () => {
    expect(convertCase(text, 'upper')).toBe('OLÁ, MUNDO! A AÇÃO DE HOJE. E-MAIL: TESTE')
    expect(convertCase(text, 'lower')).toBe('olá, mundo! a ação de hoje. e-mail: teste')
    expect(convertCase(text, 'sentence')).toBe('Olá, mundo! A ação de hoje. E-mail: teste')
    expect(convertCase(text, 'capitalize')).toBe('Olá, Mundo! A Ação De Hoje. E-Mail: Teste')
    expect(convertCase('a volta ao mundo em 80 dias', 'title')).toBe('A Volta ao Mundo em 80 Dias')
    expect(convertCase('the lord of the rings', 'title')).toBe('The Lord of the Rings')
    expect(convertCase('Olá Mundo', 'invert')).toBe('oLÁ mUNDO')
  })

  it('starts sentences after leading spaces, quotes and bullets, and leaves ß alone', () => {
    expect(convertCase('  olá mundo. "tudo bem?" sim.', 'sentence')).toBe('  Olá mundo. "Tudo bem?" Sim.')
    expect(convertCase('- item um\n• item dois', 'sentence')).toBe('- Item um\n• Item dois')
    expect(convertCase('Straße', 'invert')).toBe('sTRAßE')
    expect(convertCase('ßeta', 'capitalize')).toBe('ßeta')
  })

  it('keeps emoji, digits, punctuation and line breaks', () => {
    const source = '🚀 123 — ñandú\nsegunda linha… ok?'
    expect(convertCase(source, 'upper')).toBe('🚀 123 — ÑANDÚ\nSEGUNDA LINHA… OK?')
    expect(convertCase(source, 'sentence')).toBe('🚀 123 — ñandú\nSegunda linha… Ok?')
    for (const mode of ['upper', 'lower', 'sentence', 'capitalize', 'title', 'invert'] as const) {
      expect(convertCase('', mode)).toBe('')
      expect([...convertCase(source, mode)].length).toBe([...source].length)
    }
  })

  it('capitalizes after a line break in title mode', () => {
    expect(convertCase('o início\na continuação', 'title')).toBe('O Início\nA Continuação')
  })
})
