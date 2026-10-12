import { useDeferredValue, useEffect, useState } from 'react'
import { Checkbox, ClearButton, CodeInput, CopyButton, ErrorMessage, ExampleButton, Notice, PasteButton, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { cn } from '../../lib/cn'
import { hashAlgorithms, hashText, type HashAlgorithm } from '../../lib/generators/hash'

const tool = getTool('hash-generator')

type Hashes = Partial<Record<HashAlgorithm, string>>

export default function HashGeneratorPage() {
  const [text, setText] = useState('')
  const [uppercase, setUppercase] = useState(false)
  const [state, setState] = useState<{ source: string; hashes: Hashes; error: string | null }>({ source: '', hashes: {}, error: null })
  const deferredText = useDeferredValue(text)

  useEffect(() => {
    let cancelled = false
    if (deferredText === '') return
    Promise.all(hashAlgorithms.map(async (algorithm) => [algorithm.id, await hashText(deferredText, algorithm.id)] as const))
      .then((entries) => {
        if (!cancelled) setState({ source: deferredText, hashes: Object.fromEntries(entries), error: null })
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ source: deferredText, hashes: {}, error: error instanceof Error ? error.message : String(error) })
      })
    return () => {
      cancelled = true
    }
  }, [deferredText])

  const empty = text === ''
  // While a new hash is computed the previous one stays on screen, dimmed.
  const stale = !empty && state.source !== text
  const hashes = empty ? {} : state.hashes
  const format = (hash: string | undefined) => (hash ? (uppercase ? hash.toUpperCase() : hash) : '')

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="flex flex-col gap-6">
        <CodeInput
          id="hash-input"
          label="Texto"
          value={text}
          onChange={setText}
          prose
          minHeight="min-h-[140px]"
          placeholder="Digite ou cole o texto"
          actions={
            <>
              <ExampleButton onLoadExample={() => setText('Olá, DevDrop!')} label="Exemplo" />
              <PasteButton onPaste={setText} />
              <ClearButton onClear={() => setText('')} disabled={empty} />
            </>
          }
          footer={
            <div className="flex flex-col gap-1">
              <Checkbox label="Mostrar em letras maiúsculas" checked={uppercase} onChange={setUppercase} />
              <p className="text-[12px] text-slate-500">
                O hash é calculado sobre o texto exato, em UTF-8. Um espaço ou uma quebra de linha a mais muda o
                resultado inteiro.
              </p>
            </div>
          }
        />

        {!empty && state.error && <ErrorMessage title="Não foi possível calcular os hashes" error={state.error} />}

        <div className="grid gap-6 lg:grid-cols-2" aria-busy={stale}>
          {hashAlgorithms.map((algorithm) => {
            const hash = format(hashes[algorithm.id])
            return (
              <ToolPanel
                key={algorithm.id}
                title={
                  <span className="flex flex-wrap items-center gap-2">
                    {algorithm.id}
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70">
                      {algorithm.bits} bits
                    </span>
                    {!algorithm.secure && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
                        Não use para segurança
                      </span>
                    )}
                  </span>
                }
                actions={<CopyButton text={hash} disabled={!hash} />}
              >
                <div
                  role="group"
                  aria-label={`Hash ${algorithm.id}`}
                  className={cn(
                    'min-h-14 break-all rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 font-mono text-[13px] leading-relaxed transition-opacity',
                    hash ? 'text-ink' : 'text-slate-400',
                    stale && 'opacity-50',
                  )}
                >
                  {hash || (empty ? 'Digite um texto para ver o hash.' : 'Calculando…')}
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{algorithm.description}</p>
              </ToolPanel>
            )
          })}
        </div>

        <Notice title="Hash não é criptografia.">
          Um hash é uma impressão digital de mão única: não dá para recuperar o texto a partir dele. Para guardar senhas,
          não use MD5 nem SHA diretamente — use um algoritmo próprio para isso, como Argon2, scrypt ou bcrypt.
        </Notice>
      </div>
    </ToolShell>
  )
}
