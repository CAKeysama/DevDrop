import { useId, type ReactNode } from 'react'
import { cn } from '../../../lib/cn'

interface CodeInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  error?: string | null
  actions?: ReactNode
  className?: string
  readOnly?: boolean
  id?: string
}

export function CodeInput({
  value,
  onChange,
  label = 'Entrada',
  placeholder = 'Cole ou digite seu código aqui…',
  error,
  actions,
  className,
  readOnly = false,
  id: explicitId,
}: CodeInputProps) {
  const generatedId = useId()
  const inputId = explicitId || generatedId
  const errorId = `${inputId}-error`

  const lineCount = value ? value.split('\n').length : 0
  const charCount = value.length

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-[13px] font-semibold text-ink">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-slate-600 sm:text-[12px]">
            {lineCount} {lineCount === 1 ? 'linha' : 'linhas'} • {charCount} carac.
          </span>
          {actions}
        </div>
      </div>

      <div className="relative">
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className={cn(
            'w-full resize-y rounded-2xl border bg-slate-50/50 p-4 font-mono text-[13px] leading-relaxed text-ink transition-all placeholder:text-slate-500',
            'min-h-[260px] md:min-h-[380px]',
            'focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400',
            error ? 'border-rose-300 bg-rose-50/20 focus:border-rose-400 focus:ring-rose-400' : 'border-slate-200/80',
          )}
        />
      </div>
    </div>
  )
}
