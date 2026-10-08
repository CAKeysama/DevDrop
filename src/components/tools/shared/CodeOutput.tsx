import { useId, type ReactNode } from 'react'
import { cn } from '../../../lib/cn'
import { CopyButton } from './CopyButton'

interface CodeOutputProps {
  value: string
  label?: string
  placeholder?: string
  actions?: ReactNode
  className?: string
  id?: string
}

export function CodeOutput({
  value,
  label = 'Resultado',
  placeholder = 'O resultado formatado aparecerá aqui…',
  actions,
  className,
  id: explicitId,
}: CodeOutputProps) {
  const generatedId = useId()
  const outputId = explicitId || generatedId

  const lineCount = value ? value.split('\n').length : 0
  const charCount = value.length

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={outputId} className="text-[13px] font-semibold text-ink">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {value && (
            <span className="text-[11px] font-medium text-slate-600 sm:text-[12px]">
              {lineCount} {lineCount === 1 ? 'linha' : 'linhas'} • {charCount} carac.
            </span>
          )}
          {actions}
          <CopyButton text={value} disabled={!value} />
        </div>
      </div>

      <div className="relative">
        <textarea
          id={outputId}
          value={value}
          readOnly
          placeholder={placeholder}
          aria-label={label}
          spellCheck={false}
          className={cn(
            'w-full resize-y rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 font-mono text-[13px] leading-relaxed text-ink transition-all placeholder:text-slate-500',
            'min-h-[260px] md:min-h-[380px]',
            'focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400',
            !value && 'text-slate-400',
          )}
        />
      </div>
    </div>
  )
}
