import { describe, expect, it } from 'vitest'
import {
  categories,
  getShowcaseTools,
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

  it('covers every category', () => {
    const covered = new Set(getShowcaseTools().map((tool) => tool.categoryId))
    expect(covered.size).toBe(categories.length)
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

  it('filters by category', () => {
    expect(searchTools('', 'css').every((tool) => tool.categoryId === 'css')).toBe(true)
    expect(searchTools('json', 'css')).toHaveLength(0)
  })
})
