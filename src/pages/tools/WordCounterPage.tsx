import { useDeferredValue, useMemo, useState } from 'react'
import { ClearButton, CodeInput, CopyButton, ExampleButton, PasteButton, StatGrid, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { formatNumber } from '../../lib/calculators/number'
import { formatDuration, getTextStats, getTopWords, textExample } from '../../lib/text/textStats'

const tool = getTool('word-counter')

export default function WordCounterPage() {
  const [text, setText] = useState('')
  const deferredText = useDeferredValue(text)
  const stats = useMemo(() => getTextStats(deferredText), [deferredText])
  const topWords = useMemo(() => getTopWords(deferredText), [deferredText])

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeInput
          id="word-counter-input"
          label="Texto"
          value={text}
          onChange={setText}
          prose
          placeholder="Digite ou cole o texto aqui"
          actions={
            <>
              <ExampleButton onLoadExample={() => setText(textExample)} label="Exemplo" />
              <PasteButton onPaste={setText} />
              <CopyButton text={text} disabled={!text} />
              <ClearButton onClear={() => setText('')} disabled={!text} />
            </>
          }
        />

        <ToolPanel title="Contagem">
          <div aria-live="polite" aria-atomic="true">
            <StatGrid
              stats={[
                { label: 'Palavras', value: formatNumber(stats.words), primary: true },
                { label: 'Caracteres', value: formatNumber(stats.characters) },
                { label: 'Sem espaços', value: formatNumber(stats.charactersNoSpaces) },
                { label: 'Linhas', value: formatNumber(stats.lines) },
                { label: 'Frases', value: formatNumber(stats.sentences) },
                { label: 'Parágrafos', value: formatNumber(stats.paragraphs) },
              ]}
            />
          </div>
          <p className="mt-4 text-[14px] text-ink">
            Tempo de leitura estimado: <strong>{formatDuration(stats.readingSeconds)}</strong>
            <span className="text-slate-500"> (200 palavras por minuto)</span>
          </p>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <h3 className="text-[12px] font-medium text-slate-500">Palavras mais frequentes</h3>
            {topWords.length === 0 ? (
              <p className="mt-2 text-[13px] text-slate-500">Aparecem aqui quando houver texto (palavras com 3 letras ou mais).</p>
            ) : (
              <ol className="mt-2 flex flex-wrap gap-2">
                {topWords.map((item) => (
                  <li key={item.word} className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/60 py-1 pl-3 pr-1 text-[13px] text-ink">
                    <span className="max-w-40 truncate">{item.word}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[12px] font-semibold ring-1 ring-slate-200/70">
                      {item.count}
                      <span className="sr-only"> {item.count === 1 ? 'vez' : 'vezes'}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <p className="mt-5 text-[12px] text-slate-500">
            Palavras compostas ou com apóstrofo, como “guarda-chuva” e “d’água”, contam como uma só. Números também
            contam como palavras. A contagem de frases é aproximada: abreviações como “Dr.” podem contar a mais.
          </p>
        </ToolPanel>
      </div>
    </ToolShell>
  )
}
