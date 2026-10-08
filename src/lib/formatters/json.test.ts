import { describe, expect, it } from 'vitest'
import { formatJson, JSON_EXAMPLE, minifyJson, validateJson } from './json'

describe('JSON Formatter lib', () => {
  it('formats valid JSON with default 2 spaces indentation', () => {
    const raw = '{"name":"DevDrop","tags":["dev","tools"]}'
    const formatted = formatJson(raw)
    expect(formatted.error).toBeUndefined()
    expect(formatted.result).toBe(`{\n  "name": "DevDrop",\n  "tags": [\n    "dev",\n    "tools"\n  ]\n}`)
  })

  it('formats valid JSON with 4 spaces and tabs', () => {
    const raw = '{"a":1}'
    expect(formatJson(raw, 4).result).toBe(`{\n    "a": 1\n}`)
    expect(formatJson(raw, '\t').result).toBe(`{\n\t"a": 1\n}`)
  })

  it('minifies valid JSON correctly', () => {
    const raw = `{\n  "a": 1,\n  "b": [2, 3]\n}`
    const minified = minifyJson(raw)
    expect(minified.error).toBeUndefined()
    expect(minified.result).toBe('{"a":1,"b":[2,3]}')
  })

  it('validates valid JSON successfully', () => {
    const val = validateJson(JSON_EXAMPLE)
    expect(val.isValid).toBe(true)
    expect(val.error).toBeUndefined()
  })

  it('reports error on invalid JSON with line and column', () => {
    const invalid = '{\n  "name": "DevDrop",,\n}'
    const val = validateJson(invalid)
    expect(val.isValid).toBe(false)
    expect(val.error).toBeDefined()
    expect(typeof val.line).toBe('number')
  })

  it('does not format invalid JSON silently', () => {
    const invalid = '{ broken: json }'
    const formatted = formatJson(invalid)
    expect(formatted.result).toBe('')
    expect(formatted.error).toBeDefined()
  })

  it('handles empty input gracefully', () => {
    const empty = '   '
    expect(validateJson(empty).isValid).toBe(false)
    expect(formatJson(empty).error).toContain('vazia')
    expect(minifyJson(empty).error).toContain('vazia')
  })

  it('formats large JSON input without error', () => {
    const largeObj = Array.from({ length: 500 }, (_, i) => ({
      id: i,
      title: `Item de teste número ${i} com caracteres acentuados: áéíóú ç 🚀`,
      active: i % 2 === 0,
      metadata: { count: i * 10, nested: [i, i + 1] },
    }))
    const raw = JSON.stringify(largeObj)
    const formatted = formatJson(raw)
    expect(formatted.error).toBeUndefined()
    expect(formatted.result.length).toBeGreaterThan(raw.length)
    expect(JSON.parse(formatted.result)).toEqual(largeObj)
  })

  it('preserves unicode characters and escapes correctly', () => {
    const raw = '{"mensagem": "Olá mundo! 🇧🇷 café & coração"}'
    const formatted = formatJson(raw)
    expect(formatted.result).toContain('Olá mundo! 🇧🇷 café & coração')
  })
})
