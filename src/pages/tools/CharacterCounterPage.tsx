import { useDeferredValue, useMemo, useState } from 'react'
import {
  ClearButton,
  CodeInput,
  CopyButton,
  ErrorMessage,
  ExampleButton,
  Notice,
  PasteButton,
  StatGrid,
  TextField,
  ToolPanel,
  ToolShell,
} from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { formatNumber } from '../../lib/calculators/number'
import { getTextStats, textExample } from '../../lib/text/textStats'

const tool = getTool('character-counter')

export default function CharacterCounterPage() {
  const [text, setText] = useState('')
  const [limitText, setLimitText] = useState('')
  // Counting follows typing without blocking it, even with very long texts.
  const deferredText = useDeferredValue(text)
  const stats = useMemo(() => getTextStats(deferredText), [deferredText])

  const limit = /^\d+$/.test(limitText.trim()) ? Number(limitText) : null
  const limitError = limitText.trim() !== '' && (limit === null || limit === 0) ? 'Informe um número inteiro maior que zero.' : undefined
  const remaining = limit ? limit - stats.characters : null

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeInput
          id="character-counter-input"
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
                { label: 'Caracteres', value: formatNumber(stats.characters), primary: true },
                { label: 'Sem espaços', value: formatNumber(stats.charactersNoSpaces) },
                { label: 'Palavras', value: formatNumber(stats.words) },
                { label: 'Linhas', value: formatNumber(stats.lines) },
                { label: 'Bytes (UTF-8)', value: formatNumber(stats.bytes) },
              ]}
            />
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <TextField
              label="Limite de caracteres (opcional)"
              value={limitText}
              onChange={setLimitText}
              inputMode="numeric"
              placeholder="Ex.: 280"
              error={limitError}
              hint="Útil para posts, SMS, meta descriptions e campos com tamanho máximo."
              wrapperClassName="max-w-xs"
            />
            {limit !== null && limit > 0 && remaining !== null && (
              <div className="mt-3">
                {remaining < 0 ? (
                  <ErrorMessage
                    title="Passou do limite"
                    error={`${formatNumber(-remaining)} ${remaining === -1 ? 'caractere' : 'caracteres'} além de ${formatNumber(limit)}.`}
                  />
                ) : (
                  <Notice tone="success" title="Dentro do limite">
                    {remaining === 1 ? 'Resta 1 caractere.' : `Restam ${formatNumber(remaining)} caracteres.`}
                  </Notice>
                )}
              </div>
            )}
          </div>
          <p className="mt-5 text-[12px] text-slate-500">
            Um emoji ou uma letra acentuada conta como um caractere, como você vê na tela. O tamanho em bytes mostra
            quanto o texto ocupa em UTF-8.
          </p>
        </ToolPanel>
      </div>
    </ToolShell>
  )
}
