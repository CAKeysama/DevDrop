import { useId, type ReactNode } from 'react'
import { cn } from '../../../lib/cn'
import { CopyButton } from './CopyButton'
import { DownloadButton } from './DownloadButton'

interface CodeOutputProps {
  id?: string
  label?: string
  value: string
  placeholder?: string
  actions?: ReactNode
  footer?: ReactNode
  filename?: string
  mimeType?: string
  className?: string
  minHeight?: string
  /** Regular text instead of code: reading font, spell-friendly. */
  prose?: boolean
}

export function CodeOutput({
  id: explicitId,
  label = 'Resultado',
  value,
  placeholder = 'O resultado formatado aparecerá aqui…',
  actions,
  footer,
  filename = 'devdrop-resultado.txt',
  mimeType = 'text/plain',
  className,
  minHeight = 'min-h-[220px] md:min-h-[260px]',
  prose = false,
}: CodeOutputProps) {
  const generatedId = useId()
  const outputId = explicitId || generatedId

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card transition-colors',
        className,
      )}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          <label htmlFor={outputId} className="text-[14px] font-semibold tracking-tight text-ink">
            {label}
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {actions}
            <CopyButton text={value} disabled={!value} />
            <DownloadButton content={value} filename={filename} mimeType={mimeType} disabled={!value} />
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
              'w-full resize-y rounded-2xl border border-line-strong bg-slate-50/60 p-4 leading-relaxed text-ink transition-all placeholder:text-subtle',
              prose ? 'font-sans text-[15px]' : 'font-mono text-[13px]',
              minHeight,
              'focus:bg-white',
            )}
          />
        </div>
      </div>

      {footer && <div className="mt-4 pt-3 border-t border-slate-100">{footer}</div>}
    </div>
  )
}
