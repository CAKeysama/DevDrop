import { readFileSync } from 'node:fs'
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

describe('catalog completeness', () => {
  const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf-8')

  it('has 21 tools in 6 categories, all available', () => {
    expect(tools).toHaveLength(21)
    expect(categories).toHaveLength(6)
    expect(tools.filter((tool) => tool.status !== 'available')).toEqual([])
  })

  it('gives every tool its own route, registered in App.tsx', () => {
    for (const tool of tools) {
      expect(tool.path).toBe(`/tools/${tool.id}`)
      expect(app, tool.id).toContain(`path="${tool.path}"`)
    }
  })

  it('finds tools by name, alias and category', () => {
    expect(searchTools('senha').map((tool) => tool.id).sort()).toEqual(['password-generator', 'password-strength'])
    expect(searchTools('cpf').map((tool) => tool.id)).toEqual(['cpf'])
    expect(searchTools('md5').map((tool) => tool.id)).toEqual(['hash-generator'])
    expect(searchTools('', 'css')).toHaveLength(3)
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
    // Every tool is available today; a planned one would still link to the catalog.
    const plannedTool = { ...tools[0], status: 'planned' as const }
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
    const tail = firstPlanned === -1 ? [] : results.slice(firstPlanned)
    expect(tail.every((tool) => tool.status === 'planned')).toBe(true)
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
  // Every tool is available today, so planned ones are built from real entries.
  const planned = { ...tools[0], status: 'planned' as const }

  it('separates available from planned tools', () => {
    expect(formatToolCount([tools[0], tools[1], planned])).toBe('2 disponíveis · 1 em breve')
  })

  it('omits the empty side', () => {
    expect(formatToolCount()).toBe(`${tools.length} disponíveis`)
    expect(formatToolCount([planned])).toBe('1 em breve')
  })
})
