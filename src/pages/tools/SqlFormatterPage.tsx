import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import {
  ClearButton,
  CodeInput,
  CodeOutput,
  ExampleButton,
  PasteButton,
  ToggleGroup,
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
import type { FormatResult } from '../../lib/formatters/json'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'

type Action = 'format' | 'compact'

export default function SqlFormatterPage() {
  const [input, setInput] = useState('')
  const [dialect, setDialect] = useState<SqlDialect>('sql')
  const [indent, setIndent] = useState<2 | 4>(2)
  const [keywordCase, setKeywordCase] = useState<SqlKeywordCase>('upper')
  const [action, setAction] = useState<Action>('format')
  const [source, flush] = useDebouncedValue(input)
  // Result tagged with the source it came from, so an older (slower) run never wins.
  const [run, setRun] = useState<{ key: string; result: FormatResult | null }>({ key: '', result: null })

  const key = JSON.stringify([source, dialect, indent, keywordCase, action])

  useEffect(() => {
    let cancelled = false
    const settle = (result: FormatResult | null) => {
      if (!cancelled) setRun({ key, result })
    }

    if (!source.trim()) {
      Promise.resolve(null).then(settle)
    } else if (action === 'compact') {
      Promise.resolve(compactSql(source)).then(settle)
    } else {
      formatSql(source, { dialect, indent, keywordCase }).then(settle, (err: unknown) =>
        settle({ result: '', error: `Erro inesperado ao formatar: ${err instanceof Error ? err.message : String(err)}` }),
      )
    }

    return () => {
      cancelled = true
    }
  }, [key, source, dialect, indent, keywordCase, action])

  const isPending = source !== input || run.key !== key
  const result = run.result
  const output = result && !result.error ? result.result : ''

  function handleInsert(value: string) {
    setInput(value)
    flush(value)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      flush()
    }
  }

  return (
    <ToolShell
      toolId="sql-formatter"
      title="Formatador SQL"
      description="Organiza consultas SQL em vários dialetos enquanto você digita, ou compacta em uma linha."
      categoryId="developer"
      metaDescription="Formatador SQL online: embeleze queries SQL para PostgreSQL, MySQL, SQLite, T-SQL e mais. Organização de palavras-chave e indentação."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeInput
          id="sql-input"
          label="SQL de entrada"
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          placeholder="SELECT c.nome, COUNT(p.id) AS pedidos FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id WHERE c.ativo = true GROUP BY c.nome…"
          error={isPending ? null : result?.error}
          errorTitle="Não foi possível formatar o SQL"
          actions={
            <>
              <ExampleButton onLoadExample={() => handleInsert(SQL_EXAMPLE)} label="Exemplo" />
              <PasteButton onPaste={handleInsert} />
              <ClearButton onClear={() => handleInsert('')} disabled={!input} />
            </>
          }
          footer={
            <div className="flex flex-col gap-4">
              <p className="text-[12px] text-subtle">O resultado é atualizado enquanto você digita.</p>

              <div className="flex flex-wrap items-start gap-4">
                <ToggleGroup
                  label="Ação"
                  value={action}
                  onChange={setAction}
                  options={[
                    { value: 'format', label: 'Formatar' },
                    { value: 'compact', label: 'Compactar em uma linha' },
                  ]}
                />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sql-dialect" className="text-[12px] font-medium text-muted">
                    Dialeto
                  </label>
                  <select
                    id="sql-dialect"
                    value={dialect}
                    disabled={action === 'compact'}
                    onChange={(e) => setDialect(e.target.value as SqlDialect)}
                    className="cursor-pointer rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {SQL_DIALECT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <ToggleGroup
                  label="Indentação"
                  value={indent}
                  onChange={setIndent}
                  disabled={action === 'compact'}
                  options={[
                    { value: 2, label: '2 espaços' },
                    { value: 4, label: '4 espaços' },
                  ]}
                />

                <ToggleGroup
                  label="Palavras-chave"
                  value={keywordCase}
                  onChange={setKeywordCase}
                  disabled={action === 'compact'}
                  options={[
                    { value: 'upper', label: 'MAIÚSCULAS' },
                    { value: 'lower', label: 'minúsculas' },
                    { value: 'preserve', label: 'Manter' },
                  ]}
                />
              </div>

              <div className="flex items-start gap-2 rounded-2xl border border-slate-200/60 bg-slate-50 p-3 text-[12px] leading-relaxed text-muted">
                <Info className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
                <p>
                  Esta ferramenta apenas reorganiza o texto da consulta. Ela não executa o SQL nem confere se tabelas,
                  colunas ou a sintaxe estão corretas. Ao compactar, os comentários são removidos.
                </p>
              </div>
            </div>
          }
        />

        <CodeOutput
          id="sql-output"
          label="Resultado"
          value={output}
          placeholder="A consulta formatada aparecerá aqui…"
          filename="devdrop-consulta.sql"
          mimeType="application/sql"
        />
      </div>
    </ToolShell>
  )
}
