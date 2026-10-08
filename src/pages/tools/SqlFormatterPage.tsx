import { useState } from 'react'
import { Code2, Info, Loader2 } from 'lucide-react'
import {
  ClearButton,
  CodeInput,
  CodeOutput,
  ErrorMessage,
  ExampleButton,
  IndentSelect,
  ToolShell,
  type IndentOption,
} from '../../components/tools/shared'
import {
  formatSql,
  SQL_DIALECT_OPTIONS,
  SQL_EXAMPLE,
  SQL_SEMANTIC_NOTICE,
  type SqlDialect,
  type SqlKeywordCase,
} from '../../lib/formatters/sql'
import { surfacePill } from '../../components/ui/styles'
import { cn } from '../../lib/cn'

export default function SqlFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [dialect, setDialect] = useState<SqlDialect>('sql')
  const [indent, setIndent] = useState<IndentOption>(2)
  const [keywordCase, setKeywordCase] = useState<SqlKeywordCase>('upper')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleInputChange(value: string) {
    setInput(value)
    if (error) setError(null)
  }

  async function handleFormat(textToFormat?: string) {
    const source = textToFormat !== undefined ? textToFormat : input
    if (!source.trim()) {
      setError('Insira uma consulta SQL para formatar.')
      setOutput('')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await formatSql(source, {
        dialect,
        indent: indent as 2 | 4 | '\t',
        keywordCase,
      })

      if (res.error) {
        setError(res.error)
      } else {
        setOutput(res.result)
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(`Erro inesperado ao formatar: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setError(null)
  }

  async function handleLoadExample() {
    setInput(SQL_EXAMPLE)
    setError(null)
    await handleFormat(SQL_EXAMPLE)
  }

  return (
    <ToolShell
      title="Formatador SQL"
      description="Formate, indente e embeleze consultas SQL com suporte a múltiplos dialetos e palavras-chave padronizadas."
      categoryId="developer"
      metaDescription="Formatador SQL online: embeleze queries SQL para PostgreSQL, MySQL, SQLite, T-SQL e mais. Organização de palavras-chave e indentação."
      notice={
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 size-4 shrink-0 text-sky-700" aria-hidden="true" />
          <p className="leading-relaxed">{SQL_SEMANTIC_NOTICE}</p>
        </div>
      }
      actions={
        <>
          <ExampleButton onLoadExample={handleLoadExample} disabled={loading} />
          <ClearButton onClear={handleClear} disabled={(!input && !output) || loading} />
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleFormat()}
              disabled={loading}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-navy px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Code2 className="size-4" aria-hidden="true" />
              )}
              <span>{loading ? 'Formatando…' : 'Formatar SQL'}</span>
            </button>
          </div>

          {/* Options: Dialect, Case and Indent */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-[12px]">
              <label htmlFor="sql-dialect" className="font-medium text-slate-500 whitespace-nowrap">
                Dialeto:
              </label>
              <select
                id="sql-dialect"
                value={dialect}
                onChange={(e) => setDialect(e.target.value as SqlDialect)}
                className={cn(
                  surfacePill,
                  'cursor-pointer px-3 py-1 text-[12px] font-medium text-ink focus:outline-none focus:ring-1 focus:ring-slate-400',
                )}
              >
                {SQL_DIALECT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="inline-flex items-center gap-1.5 text-[12px]">
              <label htmlFor="sql-case" className="font-medium text-slate-500 whitespace-nowrap">
                Palavras-chave:
              </label>
              <select
                id="sql-case"
                value={keywordCase}
                onChange={(e) => setKeywordCase(e.target.value as SqlKeywordCase)}
                className={cn(
                  surfacePill,
                  'cursor-pointer px-3 py-1 text-[12px] font-medium text-ink focus:outline-none focus:ring-1 focus:ring-slate-400',
                )}
              >
                <option value="upper">MAIÚSCULAS</option>
                <option value="lower">minúsculas</option>
                <option value="preserve">Preservar</option>
              </select>
            </div>

            <IndentSelect value={indent} onChange={setIndent} id="sql-indent" />
          </div>
        </div>

        {/* Error message */}
        {error && <ErrorMessage title="Erro de Formatação" error={error} />}

        {/* Workspace: 2-column input/output */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CodeInput
            id="sql-input"
            label="Consulta SQL de Entrada"
            value={input}
            onChange={handleInputChange}
            placeholder="Cole sua consulta SQL aqui (ex: SELECT * FROM tabela WHERE status = 'ativo')…"
            error={error}
          />

          <CodeOutput
            id="sql-output"
            label="SQL Formatado"
            value={output}
            placeholder="A consulta formatada será exibida aqui…"
          />
        </div>
      </div>
    </ToolShell>
  )
}
