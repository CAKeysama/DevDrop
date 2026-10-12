import { useDeferredValue, useMemo, useState } from 'react'
import { ClearButton, CodeInput, CopyButton, ExampleButton, Notice, PasteButton, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { applyStyle, fancyStyles } from '../../lib/text/fancyLetters'

const tool = getTool('fancy-letters')
const example = 'DevDrop: ferramentas rápidas, ação e coração 2026'
const SAMPLE = 'DevDrop'

export default function FancyLettersPage() {
  const [text, setText] = useState('')
  const deferred = useDeferredValue(text)
  const source = deferred.trim() === '' ? SAMPLE : deferred

  const rows = useMemo(() => fancyStyles.map((style) => ({ id: style.id, label: style.label, text: applyStyle(source, style) })), [source])

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="flex flex-col gap-6">
        <CodeInput
          id="fancy-letters-input"
          label="Seu texto"
          value={text}
          onChange={setText}
          prose
          minHeight="min-h-[96px]"
          placeholder="Digite o texto que quer transformar"
          actions={
            <>
              <ExampleButton onLoadExample={() => setText(example)} label="Exemplo" />
              <PasteButton onPaste={setText} />
              <ClearButton onClear={() => setText('')} disabled={!text} />
            </>
          }
        />

        <Notice tone="warning" title="Use com cuidado">
          Estas letras são símbolos Unicode, não uma fonte. Leitores de tela leem cada uma de um jeito estranho, e alguns
          aparelhos e sites as mostram como quadradinhos. Prefira usá-las em enfeites e apelidos, e não em senhas, e-mails,
          nomes de arquivo ou qualquer texto que todos precisem ler.
        </Notice>

        <ToolPanel title="Estilos">
          {deferred.trim() === '' && <p className="mb-3 text-[13px] text-slate-500">Mostrando um exemplo com “{SAMPLE}”. Digite seu texto acima para ver os estilos com ele.</p>}
          <ul className="grid gap-3 md:grid-cols-2">
            {rows.map((row) => (
              <li key={row.id} className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-slate-500">{row.label}</p>
                  {/* aria-label: the styled letters are read badly, so the plain text is what is announced */}
                  <p className="mt-1 break-words text-[18px] leading-snug text-ink" aria-label={`${row.label}: ${source}`} role="img">
                    {row.text}
                  </p>
                </div>
                <CopyButton text={row.text} label="Copiar" successLabel="Copiado!" className="shrink-0" />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] text-slate-500">
            Em “Circulado” e “Largura total”, as letras com acento ficam como foram digitadas: esses alfabetos não têm
            acento e o navegador o mostraria como um quadradinho.
          </p>
        </ToolPanel>
      </div>
    </ToolShell>
  )
}
