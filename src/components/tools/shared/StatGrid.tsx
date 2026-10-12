import type { ReactNode } from 'react'
import { cn } from '../../../lib/cn'

export interface Stat {
  label: string
  value: ReactNode
  /** Highlights the main number of the tool. */
  primary?: boolean
}

/** Labelled numbers, read as a description list by assistive technology. */
export function StatGrid({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'flex flex-col-reverse justify-end gap-1 rounded-2xl border p-4',
            stat.primary ? 'border-[#0a152d] bg-[#0a152d] text-white' : 'border-slate-200/80 bg-slate-50/60 text-ink',
          )}
        >
          <dt className={cn('text-[12px] font-medium', stat.primary ? 'text-white/70' : 'text-slate-500')}>{stat.label}</dt>
          <dd className="font-display text-[26px] font-medium leading-none tracking-tight tabular-nums">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}
