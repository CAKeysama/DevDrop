import { AlertCircle } from 'lucide-react'
import { cn } from '../../../lib/cn'

interface ErrorMessageProps {
  /** Lets a field point at this message with `aria-describedby`. */
  id?: string
  error?: string | null
  title?: string
  line?: number
  column?: number
  className?: string
}

export function ErrorMessage({
  id,
  error,
  title = 'Erro de sintaxe',
  line,
  column,
  className,
}: ErrorMessageProps) {
  if (!error) return null

  const hasPosition = typeof line === 'number' && line > 0

  return (
    <div
      id={id}
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 rounded-2xl border border-rose-200/90 bg-rose-50/70 p-4 text-[13px] text-rose-900',
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-rose-950">{title}</span>
          {hasPosition && (
            <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-0.5 font-mono text-[11px] font-medium text-rose-800">
              Linha {line}
              {typeof column === 'number' && column > 0 ? `, Coluna ${column}` : ''}
            </span>
          )}
        </div>
        <p className="font-mono text-[12px] leading-relaxed break-words text-rose-900/90 whitespace-pre-wrap">
          {error}
        </p>
      </div>
    </div>
  )
}
