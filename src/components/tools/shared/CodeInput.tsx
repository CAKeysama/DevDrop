import { useId, type ReactNode } from 'react'
import { cn } from '../../../lib/cn'

interface CodeInputProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string | null
  actions?: ReactNode
  footer?: ReactNode
  className?: string
  readOnly?: boolean
  minHeight?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export function CodeInput({
  id: explicitId,
  label = 'Entrada',
  value,
  onChange,
  placeholder = 'Cole ou digite seu código aqui…',
  error,
  actions,
  footer,
  className,
  readOnly = false,
  minHeight = 'min-h-[220px] md:min-h-[260px]',
  onKeyDown,
}: CodeInputProps) {
  const generatedId = useId()
  const inputId = explicitId || generatedId
  const errorId = `${inputId}-error`

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card transition-colors',
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 pb-3">
          <label htmlFor={inputId} className="text-[14px] font-semibold tracking-tight text-ink">
            {label}
          </label>
          {actions && <div className="flex items-center gap-1.5">{actions}</div>}
        </div>

        <div className="relative">
          <textarea
            id={inputId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            readOnly={readOnly}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className={cn(
              'w-full resize-y rounded-2xl border bg-slate-50/60 p-4 font-mono text-[13px] leading-relaxed text-ink transition-all placeholder:text-slate-400',
              minHeight,
              'focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400',
              error ? 'border-rose-300 bg-rose-50/20 focus:border-rose-400 focus:ring-rose-400' : 'border-slate-200/80',
            )}
          />
        </div>
      </div>

      {footer && <div className="mt-4 pt-3 border-t border-slate-100">{footer}</div>}
    </div>
  )
}
