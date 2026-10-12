import type { ReactNode } from 'react'
import { cn } from '../../../lib/cn'

/** Placeholder shown where a result will appear. */
export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex min-h-40 flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-[13px] text-slate-500',
        className,
      )}
    >
      {children}
    </div>
  )
}
