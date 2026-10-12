import { useId, type ReactNode } from 'react'
import { cn } from '../../../lib/cn'
import { ErrorMessage } from './ErrorMessage'

interface CodeInputProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string | null
  /** Title of the error message rendered under the field. */
  errorTitle?: string
  errorLine?: number
  errorColumn?: number
  actions?: ReactNode
  footer?: ReactNode
  className?: string
  readOnly?: boolean
  minHeight?: string
  /** Regular text instead of code: reading font, spell-friendly. */
  prose?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export function CodeInput({
  id: explicitId,
  label = 'Entrada',
  value,
  onChange,
  placeholder = 'Cole ou digite seu código aqui…',
  error,
  errorTitle,
  errorLine,
  errorColumn,
  actions,
  footer,
  className,
  readOnly = false,
  minHeight = 'min-h-[220px] md:min-h-[260px]',
  prose = false,
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
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          <label htmlFor={inputId} className="text-[14px] font-semibold tracking-tight text-ink">
            {label}
          </label>
          {actions && <div className="flex flex-wrap items-center gap-1.5">{actions}</div>}
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
              'w-full resize-y rounded-2xl border bg-slate-50/60 p-4 leading-relaxed text-ink transition-[background-color,border-color] duration-150 ease-out placeholder:text-subtle',
              prose ? 'font-sans text-[15px]' : 'font-mono text-[13px]',
              minHeight,
              'focus:bg-white',
              error ? 'border-rose-500 bg-rose-50/20' : 'border-line-strong',
            )}
          />
        </div>

        <ErrorMessage
          id={errorId}
          error={error}
          title={errorTitle}
          line={errorLine}
          column={errorColumn}
          className="mt-3"
        />
      </div>

      {footer && <div className="mt-4 pt-3 border-t border-slate-100">{footer}</div>}
    </div>
  )
}
