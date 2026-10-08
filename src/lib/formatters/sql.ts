import type { FormatResult } from './json'

export type SqlDialect = 'sql' | 'postgresql' | 'mysql' | 'sqlite' | 'transactsql' | 'mariadb' | 'bigquery'

export type SqlIndent = 2 | 4 | '\t'

export type SqlKeywordCase = 'upper' | 'lower' | 'preserve'

export interface SqlFormatOptions {
  dialect?: SqlDialect
  indent?: SqlIndent
  keywordCase?: SqlKeywordCase
}

export const SQL_DIALECT_OPTIONS: { id: SqlDialect; label: string }[] = [
  { id: 'sql', label: 'SQL Padrão' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'mysql', label: 'MySQL' },
  { id: 'sqlite', label: 'SQLite' },
  { id: 'transactsql', label: 'T-SQL (SQL Server)' },
  { id: 'mariadb', label: 'MariaDB' },
  { id: 'bigquery', label: 'Google BigQuery' },
]

/**
 * Formats SQL queries dynamically loading `sql-formatter` on demand.
 * This guarantees the primary application bundle remains lean.
 */
export async function formatSql(input: string, options: SqlFormatOptions = {}): Promise<FormatResult> {
  const trimmed = input.trim()
  if (!trimmed) {
    return { result: '', error: 'A entrada está vazia. Insira uma consulta SQL para formatar.' }
  }

  try {
    const { format } = await import('sql-formatter')

    const formatted = format(trimmed, {
      language: options.dialect ?? 'sql',
      tabWidth: options.indent === '\t' ? 2 : (options.indent ?? 2),
      useTabs: options.indent === '\t',
      keywordCase: options.keywordCase ?? 'upper',
      linesBetweenQueries: 2,
      indentStyle: 'standard',
    })

    return { result: formatted }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return {
      result: '',
      error: `Erro ao formatar SQL: ${error.message}`,
    }
  }
}

export const SQL_SEMANTIC_NOTICE =
  'Nota: O formatador organiza a sintaxe, palavras-chave e quebras de linha da query. Ele não executa validação semântica de esquemas, tabelas ou colunas.'

export const SQL_EXAMPLE = `SELECT
  u.id AS user_id,
  u.name AS user_name,
  u.email,
  COUNT(o.id) AS total_orders,
  SUM(o.total_amount) AS total_spent,
  MAX(o.created_at) AS last_order_date
FROM users u
INNER JOIN orders o ON o.user_id = u.id
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE u.active = 1
  AND u.status IN ('verified', 'premium')
  AND o.created_at >= '2025-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 2 AND SUM(o.total_amount) >= 150.00
ORDER BY total_spent DESC, last_order_date DESC
LIMIT 50;`
