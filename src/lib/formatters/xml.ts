import { XMLValidator } from 'fast-xml-parser'
import type { FormatResult, ValidationResult } from './json'

export type XmlIndent = 2 | 4 | '\t'

export function validateXml(input: string): ValidationResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { isValid: false, error: 'A entrada está vazia. Insira um XML para validar.' }
  }

  const result = XMLValidator.validate(trimmed, {
    allowBooleanAttributes: true,
  })

  if (result === true) {
    return { isValid: true }
  }

  return {
    isValid: false,
    error: result.err.msg,
    line: result.err.line,
    column: result.err.col,
  }
}

export function minifyXml(input: string): FormatResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { result: '', error: 'A entrada está vazia. Insira um código XML para minificar.' }
  }

  const validation = validateXml(trimmed)
  if (!validation.isValid) {
    return {
      result: '',
      error: validation.error,
      line: validation.line,
      column: validation.column,
    }
  }

  // Minify while preserving CDATA blocks
  const cdataPlaceholders: string[] = []
  let processed = trimmed.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, (match) => {
    cdataPlaceholders.push(match)
    return `___CDATA_${cdataPlaceholders.length - 1}___`
  })

  // Strip whitespaces between tags
  processed = processed
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .replace(/>\s+([^\s<])/g, '>$1')
    .replace(/([^\s>])\s+</g, '$1<')
    .trim()

  // Restore CDATA
  processed = processed.replace(/___CDATA_(\d+)___/g, (_, index) => cdataPlaceholders[Number(index)])

  return { result: processed }
}

export function formatXml(input: string, indent: XmlIndent = 2): FormatResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { result: '', error: 'A entrada está vazia. Insira um código XML para formatar.' }
  }

  const validation = validateXml(trimmed)
  if (!validation.isValid) {
    return {
      result: '',
      error: validation.error,
      line: validation.line,
      column: validation.column,
    }
  }

  const indentStr = indent === '\t' ? '\t' : ' '.repeat(indent)

  // Tokenize preserving comments and CDATA
  const tokens: string[] = []
  // Matches CDATA, comments, declarations, processing instructions, tags, or text
  const regex = /(<!\[CDATA\[[\s\S]*?\]\]>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!DOCTYPE[\s\S]*?>|<\/?[a-zA-Z0-9_:-]+(?:\s+[^<>]*?)?\/?>|[^<]+)/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(trimmed)) !== null) {
    const token = match[0].trim()
    if (token) {
      tokens.push(token)
    }
  }

  const lines: string[] = []
  let depth = 0

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.startsWith('<?') || token.startsWith('<!DOCTYPE')) {
      // Declarations and doctype: level 0
      lines.push(token)
    } else if (token.startsWith('<!--') || token.startsWith('<![CDATA[')) {
      // Comments & CDATA: current depth
      lines.push(`${indentStr.repeat(depth)}${token}`)
    } else if (token.startsWith('</')) {
      // Closing tag: decrease depth first
      depth = Math.max(0, depth - 1)
      lines.push(`${indentStr.repeat(depth)}${token}`)
    } else if (token.startsWith('<') && (token.endsWith('/>') || token.endsWith('/ >'))) {
      // Self-closing tag: stays at current depth
      lines.push(`${indentStr.repeat(depth)}${token}`)
    } else if (token.startsWith('<')) {
      // Opening tag
      // Check if immediate next token is text and token after is the corresponding closing tag: <tag>text</tag>
      const nextToken = tokens[i + 1]
      const afterNextToken = tokens[i + 2]

      const tagNameMatch = /^<([a-zA-Z0-9_:-]+)/.exec(token)
      const tagName = tagNameMatch ? tagNameMatch[1] : ''

      if (
        nextToken &&
        !nextToken.startsWith('<') &&
        afterNextToken === `</${tagName}>`
      ) {
        // Render simple element inline
        lines.push(`${indentStr.repeat(depth)}${token}${nextToken}${afterNextToken}`)
        i += 2 // Skip next two tokens
      } else {
        lines.push(`${indentStr.repeat(depth)}${token}`)
        depth++
      }
    } else {
      // Loose text node inside an element
      lines.push(`${indentStr.repeat(depth)}${token}`)
    }
  }

  return { result: lines.join('\n') }
}

export const XML_EXAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<hub nome="DevDrop" versao="1.0">
  <!-- Ferramentas de desenvolvimento -->
  <categoria id="developer" titulo="Desenvolvimento">
    <ferramenta id="json-formatter" status="available">
      <nome>Formatador JSON</nome>
      <descricao>Formata, valida e minifica JSON.</descricao>
    </ferramenta>
    <ferramenta id="xml-formatter" status="available">
      <nome>Formatador XML</nome>
      <descricao>Formata, valida e minifica XML.</descricao>
    </ferramenta>
    <ferramenta id="sql-formatter" status="available">
      <nome>Formatador SQL</nome>
      <descricao>Formata consultas SQL com dialetos.</descricao>
    </ferramenta>
  </categoria>
  <metadados>
    <autor>DevDrop Team</autor>
    <compatibilidade>
      <navegador>Modern Browsers</navegador>
      <licenca>MIT</licenca>
    </compatibilidade>
  </metadados>
</hub>`
