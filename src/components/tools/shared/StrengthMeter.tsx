import { cn } from '../../../lib/cn'
import { strengthLabels, type StrengthScore } from '../../../lib/security/passwordStrength'

const colors = ['bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-600']

/** Five-step strength meter. The label is always written, so it never relies on colour. */
export function StrengthMeter({ score, empty = false, className }: { score: StrengthScore; empty?: boolean; className?: string }) {
  return (
    <div className={className}>
      <div
        role="meter"
        aria-label="Força da senha"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={empty ? 0 : score}
        aria-valuetext={empty ? 'Sem senha' : strengthLabels[score]}
        className="flex gap-1.5"
      >
        {strengthLabels.map((label, index) => (
          <span key={label} className={cn('h-2 flex-1 rounded-full transition-colors', !empty && index <= score ? colors[score] : 'bg-slate-200')} />
        ))}
      </div>
      <p className="mt-2 text-[14px] font-semibold text-ink" aria-hidden="true">
        {empty ? 'Sem senha' : strengthLabels[score]}
      </p>
    </div>
  )
}
