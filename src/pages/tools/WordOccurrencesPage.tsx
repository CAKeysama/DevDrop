import { useDeferredValue, useMemo, useState } from 'react'
import { Checkbox, ClearButton, CodeInput, ExampleButton, PasteButton, StatGrid, TextField, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { formatNumber } from '../../lib/calculators/number'
import { findOccurrences, highlightSegments } from '../../lib/text/occurrences'

const tool = getTool('word-occurrences')
const example = 'O sol nasce cedo. No verão, o sol de dezembro é forte, e o girassol acompanha o sol o dia todo. Solo seco, sol a pino.'

/** The preview stops here: thousands of highlighted pieces would slow the page down. */
const PREVIEW_LIMIT = 20_000

export default function WordOccurrencesPage() {
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [ignoreCase, setIgnoreCase] = useState(true)
  const [ignoreAccents, setIgnoreAccents] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const deferredText = useDeferredValue(text)

  const result = useMemo(
    () => findOccurrences(deferredText, query, { ignoreCase, ignoreAccents, wholeWord }),
    [deferredText, query, ignoreCase, ignoreAccents, wholeWord],
  )

  const preview = useMemo(() => {
    const visible = deferredText.slice(0, PREVIEW_LIMIT)
    return highlightSegments(visible, result.ranges.filter((range) => range.end <= PREVIEW_LIMIT))
  }, [deferredText, result.ranges])

  const hasQuery = query.trim() !== ''

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeInput
          id="word-occurrences-input"
          label="Texto"
          value={text}
          onChange={setText}
          prose
          placeholder="Digite ou cole o texto aqui"
          actions={
            <>
              <ExampleButton
                onLoadExample={() => {
                  setText(example)
                  setQuery('sol')
                }}
                label="Exemplo"
              />
              <PasteButton onPaste={setText} />
              <ClearButton onClear={() => setText('')} disabled={!text} />
            </>
          }
          footer={
            <div className="flex flex-col gap-3">
              <TextField label="Palavra ou frase para contar" value={query} onChange={setQuery} autoComplete="off" spellCheck={false} />
              <div className="flex flex-col">
                <Checkbox label="Ignorar maiúsculas e minúsculas" checked={ignoreCase} onChange={setIgnoreCase} />
                <Checkbox label="Ignorar acentos" checked={ignoreAccents} onChange={setIgnoreAccents} hint="“cafe” também acha “café”." />
                <Checkbox label="Só palavras inteiras" checked={wholeWord} onChange={setWholeWord} hint="“sol” não conta em “solo” nem em “girassol”." />
              </div>
            </div>
          }
        />

        <ToolPanel title="Resultado">
          <div aria-live="polite" aria-atomic="true">
            <StatGrid
              className="sm:grid-cols-2"
              stats={[
                { label: result.count === 1 ? 'Ocorrência' : 'Ocorrências', value: hasQuery ? formatNumber(result.count) : '—', primary: true },
                { label: 'Palavras no texto', value: formatNumber(result.words) },
              ]}
            />
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <h3 className="text-[12px] font-medium text-slate-500">Texto com as ocorrências destacadas</h3>
            {deferredText === '' ? (
              <p className="mt-2 text-[13px] text-slate-500">O texto aparece aqui, com o que foi encontrado em destaque.</p>
            ) : (
              <div
                tabIndex={0}
                role="region"
                aria-label="Texto com as ocorrências destacadas"
                className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-[14px] leading-relaxed text-ink"
              >
                {preview.map((segment, index) =>
                  segment.match ? (
                    <mark key={index} className="rounded bg-amber-200 px-0.5 text-ink">
                      {segment.text}
                    </mark>
                  ) : (
                    <span key={index}>{segment.text}</span>
                  ),
                )}
              </div>
            )}
            {deferredText.length > PREVIEW_LIMIT && (
              <p className="mt-2 text-[12px] text-slate-500">
                A prévia mostra os primeiros {formatNumber(PREVIEW_LIMIT)} caracteres; a contagem considera o texto inteiro.
              </p>
            )}
          </div>
          <p className="mt-5 text-[12px] text-slate-500">
            A busca é por texto, não por padrão: pontos, parênteses e outros símbolos valem como estão. Uma frase só é
            encontrada dentro de uma mesma linha.
          </p>
        </ToolPanel>
      </div>
    </ToolShell>
  )
}
