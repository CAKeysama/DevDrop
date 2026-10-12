import { describe, expect, it } from 'vitest'
import { getShowcaseTools } from '../data/tools'
import { readMissingPath, suggestTools } from './notFound'

describe('readMissingPath', () => {
  it('turns the address into search words', () => {
    expect(readMissingPath('/formatar-json')).toBe('formatar json')
    expect(readMissingPath('/tools/gerador_de_senha/')).toBe('gerador de senha')
    expect(readMissingPath('/jwt%20decoder')).toBe('jwt decoder')
  })

  it('survives malformed escapes', () => {
    expect(readMissingPath('/%E0%A4%A')).toBe('%e0%a4%a')
  })

  it('ignores file extensions and the catalog prefix', () => {
    expect(readMissingPath('/tools/base64.html')).toBe('base64')
  })
})

describe('suggestTools', () => {
  it('suggests the tools the address points at', () => {
    expect(suggestTools('/formatar-json').tools[0].id).toBe('json-formatter')
    expect(suggestTools('/senha').matched).toBe(true)
    expect(suggestTools('/senha').tools.map((tool) => tool.id)).toContain('password-generator')
  })

  it('falls back to the showcase when nothing matches', () => {
    const result = suggestTools('/xyzzy')
    expect(result.matched).toBe(false)
    expect(result.tools.map((tool) => tool.id)).toEqual(getShowcaseTools().slice(0, 3).map((tool) => tool.id))
  })

  it('never suggests more than three', () => {
    expect(suggestTools('/gerador').tools.length).toBeLessThanOrEqual(3)
  })
})
