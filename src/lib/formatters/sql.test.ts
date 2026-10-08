import { describe, expect, it } from 'vitest'
import { formatSql, SQL_EXAMPLE } from './sql'

describe('SQL Formatter lib', () => {
  it('formats a basic SQL query with uppercase keywords by default', async () => {
    const raw = 'select id, name from users where active = 1 order by id desc'
    const res = await formatSql(raw)
    expect(res.error).toBeUndefined()
    expect(res.result).toContain('SELECT')
    expect(res.result).toContain('FROM')
    expect(res.result).toContain('WHERE')
    expect(res.result).toContain('ORDER BY')
  })

  it('formats queries with specified indentation and dialect', async () => {
    const raw = 'select id from users'
    const res4 = await formatSql(raw, { indent: 4, dialect: 'postgresql' })
    expect(res4.error).toBeUndefined()
    expect(res4.result).toContain('SELECT')

    const resTab = await formatSql(raw, { indent: '\t' })
    expect(resTab.error).toBeUndefined()
  })

  it('preserves lowercase or keyword case when specified', async () => {
    const raw = 'SELECT id FROM users'
    const res = await formatSql(raw, { keywordCase: 'lower' })
    expect(res.result).toContain('select')
    expect(res.result).toContain('from')
  })

  it('formats complex query example cleanly', async () => {
    const res = await formatSql(SQL_EXAMPLE)
    expect(res.error).toBeUndefined()
    expect(res.result).toContain('COUNT(o.id)')
    expect(res.result).toContain('HAVING')
  })

  it('handles empty input gracefully', async () => {
    const res = await formatSql('   ')
    expect(res.result).toBe('')
    expect(res.error).toContain('vazia')
  })

  it('formats multiple queries separated by semicolons', async () => {
    const queries = 'SELECT 1 FROM a; INSERT INTO b (val) VALUES (2); UPDATE c SET x = 1;'
    const res = await formatSql(queries)
    expect(res.error).toBeUndefined()
    expect(res.result).toContain('SELECT')
    expect(res.result).toContain('INSERT INTO')
    expect(res.result).toContain('UPDATE')
  })
})
