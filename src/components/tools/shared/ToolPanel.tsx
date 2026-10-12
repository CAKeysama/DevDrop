import type { ReactNode } from 'react'
import { cn } from '../../../lib/cn'

interface ToolPanelProps {
  /** Heading of the card. Rendered as an h2. */
  title?: ReactNode
  /** Buttons shown next to the title (copy, clear, example…). */
  actions?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Card used by tools whose input is not a single code field (options, previews, results).
 * Same surface as CodeInput and CodeOutput.
 */
export function ToolPanel({ title, actions, footer, children, className }: ToolPanelProps) {
  return (
    <section
      className={cn(
        'flex min-w-0 flex-col rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card transition-colors',
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          {title && <h2 className="text-[14px] font-semibold tracking-tight text-ink">{title}</h2>}
          {actions && <div className="flex flex-wrap items-center gap-1.5">{actions}</div>}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      {footer && <div className="mt-4 border-t border-slate-100 pt-3">{footer}</div>}
    </section>
  )
}
