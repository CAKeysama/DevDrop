import { useDeferredValue, useMemo, useState } from 'react'
import { ClearButton, CodeInput, CopyButton, EmptyState, ExampleButton, PasteButton, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { formatNumber } from '../../lib/calculators/number'
import { describeCharacters } from '../../lib/text/charInfo'

const tool = getTool('char-info')
const example = 'Olá, ação! 😀 €5 · Á'
const LIMIT = 100

const columns = ['Caractere', 'Unicode', 'Decimal', 'UTF-8', 'UTF-16', 'HTML', 'Categoria']

export default function CharInfoPage() {
  const [text, setText] = useState('')
  const deferred = useDeferredValue(text)
  const { items, total } = useMemo(() => describeCharacters(deferred, LIMIT), [deferred])

  // Tab-separated, so it pastes straight into a spreadsheet.
  const table = useMemo(
    () =>
      [columns.join('\t'), ...items.map((item) => [item.invisible ? item.unicode : item.character, item.unicode, item.codePoint, item.utf8, item.utf16, item.entity, item.category].join('\t'))].join('\n'),
    [items],
  )

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="flex flex-col gap-6">
        <CodeInput
          id="char-info-input"
          label="Texto ou caractere"
          value={text}
          onChange={setText}
          prose
          minHeight="min-h-[120px]"
          placeholder="Digite ou cole um ou mais caracteres"
          actions={
            <>
              <ExampleButton onLoadExample={() => setText(example)} label="Exemplo" />
              <PasteButton onPaste={setText} />
              <ClearButton onClear={() => setText('')} disabled={!text} />
            </>
          }
        />

        <ToolPanel title="Caracteres" actions={<CopyButton text={table} disabled={items.length === 0} label="Copiar tabela" />}>
          {items.length === 0 ? (
            <EmptyState>Digite ou cole um texto para ver o código, os bytes e a categoria de cada caractere.</EmptyState>
          ) : (
            <>
              <div className="-mx-1 overflow-x-auto px-1">
                <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
                  <caption className="sr-only">Informações de cada caractere do texto</caption>
                  <thead>
                    <tr className="border-b border-slate-200/80 text-[12px] font-medium text-slate-500">
                      {columns.map((column) => (
                        <th key={column} scope="col" className="px-3 py-2 font-medium">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-slate-100 last:border-0">
                        <th scope="row" className="px-3 py-2 font-display text-[20px] font-medium text-ink">
                          <span aria-hidden={item.invisible || undefined}>{item.shown}</span>
                          {item.invisible && <span className="sr-only">invisível</span>}
                        </th>
                        <td className="px-3 py-2 font-mono text-ink">{item.unicode}</td>
                        <td className="px-3 py-2 font-mono tabular-nums text-ink">{item.codePoint}</td>
                        <td className="px-3 py-2 font-mono text-ink">{item.utf8}</td>
                        <td className="px-3 py-2 font-mono text-ink">{item.utf16}</td>
                        <td className="px-3 py-2 font-mono text-ink">{item.entity}</td>
                        <td className="px-3 py-2 text-slate-700">{item.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p aria-live="polite" className="mt-3 text-[12px] text-slate-500">
                {total > items.length
                  ? `Mostrando os primeiros ${formatNumber(items.length)} de ${formatNumber(total)} caracteres.`
                  : `${formatNumber(total)} ${total === 1 ? 'caractere' : 'caracteres'}.`}
              </p>
            </>
          )}
          <p className="mt-4 text-[12px] text-slate-500">
            Cada linha é um ponto de código Unicode: um emoji composto ou uma letra com acento digitado em duas partes aparece
            em mais de uma linha. Espaços e caracteres de controle aparecem com um símbolo no lugar (␣, ↵, ⇥).
          </p>
        </ToolPanel>
      </div>
    </ToolShell>
  )
}
