import { useState } from 'react'
import { Info, Loader2 } from 'lucide-react'
import {
  ClearButton,
  CodeInput,
  CodeOutput,
  ErrorMessage,
  ExampleButton,
  PasteButton,
  ToolShell,
} from '../../components/tools/shared'
import {
  compactSql,
  formatSql,
  SQL_DIALECT_OPTIONS,
  SQL_EXAMPLE,
  type SqlDialect,
  type SqlKeywordCase,
} from '../../lib/formatters/sql'
import { cn } from '../../lib/cn'

export default function SqlFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [dialect, setDialect] = useState<SqlDialect>('sql')
  const [indent, setIndent] = useState<2 | 4>(2)
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
        indent,
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

  function handleCompact() {
    if (!input.trim()) {
      setError('Insira uma consulta SQL para compactar.')
      setOutput('')
      return
    }

    setError(null)
    const res = compactSql(input)
    if (res.error) {
      setError(res.error)
    } else {
      setOutput(res.result)
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleFormat()
    }
  }

  return (
    <ToolShell
      toolId="sql-formatter"
      title="Formatador SQL"
      description="Organiza consultas SQL em vários dialetos e compacta em uma linha."
      categoryId="developer"
      metaDescription="Formatador SQL online: embeleze queries SQL para PostgreSQL, MySQL, SQLite, T-SQL e mais. Organização de palavras-chave e indentação."
    >
      <div className="flex flex-col gap-6">
        {/* Error message */}
        {error && <ErrorMessage title="Erro de Formatação SQL" error={error} />}

        {/* 2-Column Responsive Workspace */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Input Card */}
          <CodeInput
            id="sql-input"
            label="SQL de entrada"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="SELECT c.nome, COUNT(p.id) AS pedidos FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id WHERE c.ativo = true GROUP BY c.nome…"
            error={error}
            actions={
              <>
                <ExampleButton onLoadExample={handleLoadExample} label="Exemplo" disabled={loading} />
                <PasteButton onPaste={(text) => handleInputChange(text)} disabled={loading} />
                <ClearButton onClear={handleClear} disabled={(!input && !output) || loading} />
              </>
            }
            footer={
              <div className="flex flex-col gap-4">
                <p className="text-[12px] text-slate-400">
                  Atalho: <kbd className="font-sans font-medium text-slate-600">Ctrl + Enter</kbd> (
                  <kbd className="font-sans font-medium text-slate-600">⌘ + Enter</kbd> no Mac) executa a ação principal.
                </p>

                {/* Options: Dialeto, Indentação, Palavras-chave */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Dialeto */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="sql-dialect" className="text-[12px] font-medium text-slate-500">
                      Dialeto
                    </label>
                    <select
                      id="sql-dialect"
                      value={dialect}
                      onChange={(e) => setDialect(e.target.value as SqlDialect)}
                      className="cursor-pointer rounded-full border border-slate-200/80 bg-white px-3.5 py-1 text-[12px] font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-sm"
                    >
                      {SQL_DIALECT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Indentação */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-medium text-slate-500">Indentação</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIndent(2)}
                        className={cn(
                          'cursor-pointer rounded-full px-3 py-1 text-[12px] font-semibold transition-all',
                          indent === 2
                            ? 'bg-[#0a152d] text-white shadow-sm'
                            : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                        )}
                      >
                        2 espaços
                      </button>
                      <button
                        type="button"
                        onClick={() => setIndent(4)}
                        className={cn(
                          'cursor-pointer rounded-full px-3 py-1 text-[12px] font-semibold transition-all',
                          indent === 4
                            ? 'bg-[#0a152d] text-white shadow-sm'
                            : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                        )}
                      >
                        4 espaços
                      </button>
                    </div>
                  </div>

                  {/* Palavras-chave */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-medium text-slate-500">Palavras-chave</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setKeywordCase('upper')}
                        className={cn(
                          'cursor-pointer rounded-full px-3 py-1 text-[12px] font-semibold transition-all',
                          keywordCase === 'upper'
                            ? 'bg-[#0a152d] text-white shadow-sm'
                            : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                        )}
                      >
                        MAIÚSCULAS
                      </button>
                      <button
                        type="button"
                        onClick={() => setKeywordCase('lower')}
                        className={cn(
                          'cursor-pointer rounded-full px-3 py-1 text-[12px] font-semibold transition-all',
                          keywordCase === 'lower'
                            ? 'bg-[#0a152d] text-white shadow-sm'
                            : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                        )}
                      >
                        minúsculas
                      </button>
                      <button
                        type="button"
                        onClick={() => setKeywordCase('preserve')}
                        className={cn(
                          'cursor-pointer rounded-full px-3 py-1 text-[12px] font-semibold transition-all',
                          keywordCase === 'preserve'
                            ? 'bg-[#0a152d] text-white shadow-sm'
                            : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                        )}
                      >
                        Manter
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleFormat()}
                    disabled={loading}
                    className="cursor-pointer rounded-full bg-[#0a152d] px-5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                        <span>Formatando…</span>
                      </span>
                    ) : (
                      'Formatar'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCompact}
                    disabled={loading}
                    className="cursor-pointer rounded-full border border-slate-200/80 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300 hover:text-ink transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    Compactar em uma linha
                  </button>
                </div>

                {/* Notice message */}
                <div className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-[12px] text-slate-500 leading-relaxed border border-slate-200/60">
                  <Info className="size-4 shrink-0 text-slate-400 mt-0.5" aria-hidden="true" />
                  <p>
                    Esta ferramenta apenas reorganiza o texto da consulta. Ela não executa o SQL nem confere se tabelas,
                    colunas ou a sintaxe estão corretas. Ao compactar, os comentários são removidos.
                  </p>
                </div>
              </div>
            }
          />

          {/* Right Column: Output Card */}
          <CodeOutput
            id="sql-output"
            label="Resultado"
            value={output}
            placeholder="A consulta formatada aparecerá aqui…"
            filename="devdrop-consulta.sql"
            mimeType="application/sql"
          />
        </div>
      </div>
    </ToolShell>
  )
}
