import { describe, expect, it } from 'vitest'
import { describeCharacter, describeCharacters } from './charInfo'

describe('describeCharacter', () => {
  it('describes a letter with a named entity', () => {
    expect(describeCharacter('ç')).toMatchObject({
      unicode: 'U+00E7',
      codePoint: 231,
      utf8: 'C3 A7',
      utf16: '00E7',
      entity: '&ccedil;',
      category: 'Letra minúscula',
      shown: 'ç',
      invisible: false,
    })
  })

  it('describes an emoji: four UTF-8 bytes, a surrogate pair and a numeric entity', () => {
    expect(describeCharacter('🚀')).toMatchObject({
      unicode: 'U+1F680',
      utf8: 'F0 9F 9A 80',
      utf16: 'D83D DE80',
      entity: '&#128640;',
      category: 'Outro símbolo',
    })
  })

  it('knows the plain ASCII ones', () => {
    expect(describeCharacter('A')).toMatchObject({ unicode: 'U+0041', utf8: '41', category: 'Letra maiúscula', entity: '&#65;' })
    expect(describeCharacter('7')).toMatchObject({ category: 'Dígito' })
    expect(describeCharacter('€')).toMatchObject({ category: 'Símbolo de moeda', entity: '&euro;' })
  })

  it('names the reserved HTML characters', () => {
    expect(describeCharacter('<').entity).toBe('&lt;')
    expect(describeCharacter('&').entity).toBe('&amp;')
    expect(describeCharacter('"').entity).toBe('&quot;')
  })

  it('draws a stand-in for characters without a shape', () => {
    expect(describeCharacter(' ')).toMatchObject({ shown: '␣', invisible: true, category: 'Espaço' })
    expect(describeCharacter('\n')).toMatchObject({ shown: '␊', invisible: true, category: 'Controle' })
    expect(describeCharacter('\t')).toMatchObject({ shown: '␉', invisible: true })
    expect(describeCharacter('​')).toMatchObject({ invisible: true, category: 'Formatação (invisível)', utf8: 'E2 80 8B' })
    expect(describeCharacter(' ')).toMatchObject({ invisible: true, entity: '&nbsp;' })
  })

  it('sits a combining mark on a dotted circle', () => {
    expect(describeCharacter('́')).toMatchObject({ category: 'Marca combinante', shown: '◌́', invisible: false })
  })

  it('says so when a code point is not assigned', () => {
    expect(describeCharacter(String.fromCodePoint(0x0378)).category).toBe('Não atribuído')
  })
})

describe('describeCharacters', () => {
  it('lists one entry per code point', () => {
    const { items, total } = describeCharacters('aç🚀')
    expect(items.map((item) => item.unicode)).toEqual(['U+0061', 'U+00E7', 'U+1F680'])
    expect(total).toBe(3)
  })

  it('shows a decomposed accent as two code points', () => {
    expect(describeCharacters('é').items).toHaveLength(2)
    expect(describeCharacters('é').items).toHaveLength(1)
  })

  it('stops at the limit but still counts everything', () => {
    const { items, total } = describeCharacters('abcdef', 4)
    expect(items).toHaveLength(4)
    expect(total).toBe(6)
  })

  it('returns nothing for an empty text', () => {
    expect(describeCharacters('')).toEqual({ items: [], total: 0 })
  })
})
