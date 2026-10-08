export interface ValidationResult {
  isValid: boolean
  error?: string
  line?: number
  column?: number
}

export interface FormatResult {
  result: string
  error?: string
  line?: number
  column?: number
}

export type JsonIndent = 2 | 4 | '\t'

/**
 * Extracts line and column from JSON error message or string position.
 */
function extractPosition(error: Error, input: string): { line?: number; column?: number } {
  // Check for "line X column Y" in error message
  const lineColMatch = /line\s+(\d+)\s+column\s+(\d+)/i.exec(error.message)
  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1], 10),
      column: parseInt(lineColMatch[2], 10),
    }
  }

  // Check for "position X" in error message
  const posMatch = /position\s+(\d+)/i.exec(error.message)
  if (posMatch) {
    const position = parseInt(posMatch[1], 10)
    const clampedPos = Math.min(Math.max(0, position), input.length)
    const lines = input.slice(0, clampedPos).split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1
    return { line, column }
  }

  return {}
}

export function validateJson(input: string): ValidationResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { isValid: false, error: 'A entrada está vazia. Insira um JSON para validar.' }
  }

  try {
    JSON.parse(trimmed)
    return { isValid: true }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    const { line, column } = extractPosition(error, trimmed)
    return {
      isValid: false,
      error: error.message,
      line,
      column,
    }
  }
}

export function formatJson(input: string, indent: JsonIndent = 2): FormatResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { result: '', error: 'A entrada está vazia. Insira um código JSON para formatar.' }
  }

  const validation = validateJson(trimmed)
  if (!validation.isValid) {
    return {
      result: '',
      error: validation.error,
      line: validation.line,
      column: validation.column,
    }
  }

  try {
    const parsed = JSON.parse(trimmed)
    const indentation = indent === '\t' ? '\t' : indent
    return { result: JSON.stringify(parsed, null, indentation) }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return { result: '', error: error.message }
  }
}

export function minifyJson(input: string): FormatResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { result: '', error: 'A entrada está vazia. Insira um código JSON para minificar.' }
  }

  const validation = validateJson(trimmed)
  if (!validation.isValid) {
    return {
      result: '',
      error: validation.error,
      line: validation.line,
      column: validation.column,
    }
  }

  try {
    const parsed = JSON.parse(trimmed)
    return { result: JSON.stringify(parsed) }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return { result: '', error: error.message }
  }
}

export const JSON_EXAMPLE = `{
  "projeto": "DevDrop",
  "versao": "0.1.0",
  "ativo": true,
  "ferramentas": [
    {
      "id": "json-formatter",
      "nome": "Formatador JSON",
      "categoria": "developer",
      "tags": ["json", "formatter", "format"]
    },
    {
      "id": "xml-formatter",
      "nome": "Formatador XML",
      "categoria": "developer",
      "tags": ["xml", "formatter"]
    },
    {
      "id": "sql-formatter",
      "nome": "Formatador SQL",
      "categoria": "developer",
      "tags": ["sql", "query"]
    }
  ],
  "configuracoes": {
    "tema": "dark",
    "maxItens": 50,
    "notificacoes": null
  }
}`
