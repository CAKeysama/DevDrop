import { useDeferredValue, useId, useMemo, useState } from 'react'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { ClearButton, EmptyState, Notice, StrengthMeter, ToolPanel, ToolShell } from '../../components/tools/shared'
import { fieldControl, fieldLabel } from '../../components/tools/shared/fieldStyles'
import { getTool } from '../../data/tools'
import { cn } from '../../lib/cn'
import { analyzePassword } from '../../lib/security/passwordStrength'

const tool = getTool('password-strength')

export default function PasswordStrengthPage() {
  const id = useId()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const deferred = useDeferredValue(password)
  const analysis = useMemo(() => analyzePassword(deferred), [deferred])
  const empty = deferred === ''

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolPanel title="Senha" actions={<ClearButton onClear={() => setPassword('')} disabled={password === ''} />}>
          <label htmlFor={id} className={fieldLabel}>
            Digite a senha que quer avaliar
          </label>
          <div className="relative mt-1.5">
            <input
              id={id}
              type={visible ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className={cn(fieldControl, 'h-12 pr-12 font-mono text-[16px]')}
            />
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              aria-pressed={visible}
              aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-ink"
            >
              {visible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
            </button>
          </div>
          <StrengthMeter score={analysis.score} empty={empty} className="mt-5" />
          {!empty && <p className="mt-1 text-[12px] text-slate-500">Estimativa: cerca de {analysis.bits} bits, já descontados os padrões previsíveis.</p>}
          <p className="mt-5 text-[12px] text-slate-500">
            A análise acontece nesta página, enquanto você digita. A senha não é enviada, salva nem comparada com bases
            externas. É uma estimativa: uma senha “forte” aqui ainda pode ter aparecido em vazamentos.
          </p>
        </ToolPanel>

        <ToolPanel title="Por que essa avaliação">
          {empty ? (
            <EmptyState>Digite uma senha para ver os pontos fortes e fracos.</EmptyState>
          ) : (
            <div aria-live="polite">
              <ul className="flex flex-col gap-2.5">
                {analysis.findings.map((finding) => (
                  <li key={finding.text} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink">
                    <span
                      className={cn(
                        'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                        finding.kind === 'good' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700',
                      )}
                    >
                      {finding.kind === 'good' ? <Check aria-hidden="true" className="size-3.5" /> : <X aria-hidden="true" className="size-3.5" />}
                    </span>
                    <span>
                      <span className="sr-only">{finding.kind === 'good' ? 'Ponto forte: ' : 'Ponto fraco: '}</span>
                      {finding.text}
                    </span>
                  </li>
                ))}
              </ul>
              {analysis.suggestions.length > 0 && (
                <Notice className="mt-5" title="Como melhorar">
                  <ul className="list-disc space-y-1 pl-4">
                    {analysis.suggestions.map((suggestion) => (
                      <li key={suggestion}>{suggestion}</li>
                    ))}
                  </ul>
                </Notice>
              )}
            </div>
          )}
        </ToolPanel>
      </div>
    </ToolShell>
  )
}
