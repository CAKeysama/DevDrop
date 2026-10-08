import { describe, expect, it } from 'vitest'
import { formatXml, minifyXml, validateXml, XML_EXAMPLE } from './xml'

describe('XML Formatter lib', () => {
  it('formats valid XML with 2 spaces indentation', () => {
    const raw = '<root><user id="1"><name>Alice</name></user></root>'
    const formatted = formatXml(raw, 2)
    expect(formatted.error).toBeUndefined()
    expect(formatted.result).toBe(
      '<root>\n  <user id="1">\n    <name>Alice</name>\n  </user>\n</root>',
    )
  })

  it('formats valid XML with 4 spaces and tab indentation', () => {
    const raw = '<root><item>Test</item></root>'
    const formatted4 = formatXml(raw, 4)
    expect(formatted4.result).toBe('<root>\n    <item>Test</item>\n</root>')

    const formattedTab = formatXml(raw, '\t')
    expect(formattedTab.result).toBe('<root>\n\t<item>Test</item>\n</root>')
  })

  it('preserves self-closing tags and comments', () => {
    const raw = '<root><!-- comment --><br /></root>'
    const formatted = formatXml(raw)
    expect(formatted.result).toContain('<!-- comment -->')
    expect(formatted.result).toContain('<br />')
  })

  it('preserves CDATA sections', () => {
    const raw = '<root><data><![CDATA[Some <raw> content]]></data></root>'
    const formatted = formatXml(raw)
    expect(formatted.result).toContain('<![CDATA[Some <raw> content]]>')
  })

  it('minifies valid XML correctly', () => {
    const raw = `<root>\n  <item id="1">\n    <value>42</value>\n  </item>\n</root>`
    const minified = minifyXml(raw)
    expect(minified.error).toBeUndefined()
    expect(minified.result).toBe('<root><item id="1"><value>42</value></item></root>')
  })

  it('validates valid XML example', () => {
    const val = validateXml(XML_EXAMPLE)
    expect(val.isValid).toBe(true)
    expect(val.error).toBeUndefined()
  })

  it('detects syntax errors in invalid XML with line/column info', () => {
    const invalid = '<root><open>missing close</root>'
    const val = validateXml(invalid)
    expect(val.isValid).toBe(false)
    expect(val.error).toBeDefined()
  })

  it('does not format invalid XML silently', () => {
    const invalid = '<root><unclosed></root>'
    const res = formatXml(invalid)
    expect(res.result).toBe('')
    expect(res.error).toBeDefined()
  })

  it('handles empty input gracefully', () => {
    const empty = '   '
    expect(validateXml(empty).isValid).toBe(false)
    expect(formatXml(empty).error).toContain('vazia')
    expect(minifyXml(empty).error).toContain('vazia')
  })

  it('formats large XML document efficiently', () => {
    const items = Array.from(
      { length: 300 },
      (_, i) => `<registro id="${i}" status="ok"><titulo>Item ${i} com acentuação</titulo></registro>`,
    ).join('')
    const raw = `<catalogo>${items}</catalogo>`
    const formatted = formatXml(raw)
    expect(formatted.error).toBeUndefined()
    expect(formatted.result).toContain('<catalogo>')
    expect(formatted.result).toContain('<registro id="0"')
    expect(formatted.result).toContain('</catalogo>')
  })
})
