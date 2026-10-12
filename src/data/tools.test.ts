import { describe, expect, it } from 'vitest'
import {
  categories,
  getShowcaseTools,
  formatToolCount,
  getToolHref,
  getToolsByCategory,
  isCategoryId,
  searchTools,
  showcaseToolIds,
  tools,
} from './tools'

describe('tool registry', () => {
  it('has unique tool ids', () => {
    const ids = tools.map((tool) => tool.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('assigns every tool to an existing category', () => {
    for (const tool of tools) expect(isCategoryId(tool.categoryId)).toBe(true)
  })

  it('has no empty category', () => {
    for (const category of categories) expect(getToolsByCategory(category.id).length).toBeGreaterThan(0)
  })

  it('only marks a tool as available when it has a route', () => {
    for (const tool of tools) {
      if (tool.status === 'available') expect(tool.path).toMatch(/^\//)
    }
  })
})

describe('showcase', () => {
  it('only lists tools that exist in the registry', () => {
    expect(getShowcaseTools()).toHaveLength(showcaseToolIds.length)
  })

  it('only shows available tools', () => {
    for (const tool of getShowcaseTools()) expect(tool.status).toBe('available')
  })

  it('links an available tool to its route', () => {
    const availableTool = tools.find((tool) => tool.status === 'available')!
    expect(availableTool).toBeDefined()
    expect(getToolHref(availableTool)).toBe(availableTool.path)
  })

  it('links a planned tool to its catalog entry', () => {
    const plannedTool = tools.find((tool) => tool.status === 'planned')!
    expect(plannedTool).toBeDefined()
    expect(getToolHref(plannedTool)).toBe(`/tools?q=${encodeURIComponent(plannedTool.name)}`)
  })
})

describe('searchTools', () => {
  it('returns everything for an empty query', () => {
    expect(searchTools('')).toHaveLength(tools.length)
  })

  it('matches by name, ignoring case', () => {
    expect(searchTools('JSON').map((tool) => tool.id)).toContain('json-formatter')
  })

  it('matches the exact tool name used by landing page links', () => {
    for (const tool of tools) expect(searchTools(tool.name).map((t) => t.id)).toContain(tool.id)
  })

  it('requires every term to match', () => {
    expect(searchTools('senha força').map((tool) => tool.id)).toEqual(['password-strength'])
  })

  it('ignores accents', () => {
    expect(searchTools('regra de tres').map((tool) => tool.id)).toEqual(['rule-of-three'])
    expect(searchTools('maiusculas').map((tool) => tool.id)).toEqual(['case-converter'])
  })

  it('finds tools by verb, not only by the exact name', () => {
    expect(searchTools('formatar json')[0].id).toBe('json-formatter')
    expect(searchTools('decodificar token').map((tool) => tool.id)).toEqual(['jwt-decoder'])
    expect(searchTools('formatar').map((tool) => tool.id)).toEqual(
      expect.arrayContaining(['json-formatter', 'xml-formatter', 'sql-formatter']),
    )
  })

  it('understands common synonyms', () => {
    expect(searchTools('prettify').map((tool) => tool.id)).toContain('json-formatter')
    expect(searchTools('gerar senha').map((tool) => tool.id)).toContain('password-generator')
    expect(searchTools('codificar url')[0].id).toBe('url-encoder')
  })

  it('ignores filler words', () => {
    expect(searchTools('formatador de json para api')[0].id).toBe('json-formatter')
  })

  it('falls back to partial matches instead of returning nothing', () => {
    expect(searchTools('gerador de cpf falso').map((tool) => tool.id)).toContain('cpf')
  })

  it('lists available tools before planned ones', () => {
    const results = searchTools('')
    const firstPlanned = results.findIndex((tool) => tool.status === 'planned')
    expect(results.slice(firstPlanned).every((tool) => tool.status === 'planned')).toBe(true)
  })

  it('returns nothing for unrelated text', () => {
    expect(searchTools('xyzzy')).toHaveLength(0)
  })

  it('filters by category', () => {
    expect(searchTools('', 'css').every((tool) => tool.categoryId === 'css')).toBe(true)
    expect(searchTools('json', 'css')).toHaveLength(0)
  })
})

describe('formatToolCount', () => {
  it('separates available from planned tools', () => {
    const available = tools.filter((tool) => tool.status === 'available').length
    const planned = tools.length - available
    expect(formatToolCount()).toBe(`${available} disponíveis · ${planned} em breve`)
  })

  it('omits the empty side', () => {
    expect(formatToolCount(tools.filter((tool) => tool.status === 'planned').slice(0, 1))).toBe('1 em breve')
  })
})
