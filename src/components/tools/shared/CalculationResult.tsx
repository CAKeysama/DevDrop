import type { ReactNode } from 'react'
import { CopyButton } from './CopyButton'
import { EmptyState } from './EmptyState'
import { ToolPanel } from './ToolPanel'

export interface Calculation {
  display: string
  summary: string
  formula: string
  steps: string[]
}

interface CalculationResultProps {
  /** Null while the inputs are incomplete or invalid. */
  calculation: Calculation | null
  emptyText: ReactNode
}

/** Result of a calculator: the number, a sentence, the formula and the steps. */
export function CalculationResult({ calculation, emptyText }: CalculationResultProps) {
  return (
    <ToolPanel title="Resultado" actions={<CopyButton text={calculation?.display ?? ''} disabled={!calculation} />}>
      {calculation ? (
        <div aria-live="polite" aria-atomic="true">
          <output className="block break-words font-display text-[42px] font-medium leading-none tracking-tight text-ink sm:text-[52px]">
            {calculation.display}
          </output>
          <p className="mt-3 text-[14px] leading-relaxed text-ink">{calculation.summary}</p>
          <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Fórmula</h3>
            <p className="mt-1 font-mono text-[13px] text-ink">{calculation.formula}</p>
            <h3 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Passo a passo</h3>
            <ol className="mt-1 list-decimal space-y-1 pl-5 font-mono text-[13px] text-ink">
              {calculation.steps.map((step, index) => (
                <li key={index} className="break-words">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <EmptyState>{emptyText}</EmptyState>
      )}
    </ToolPanel>
  )
}
