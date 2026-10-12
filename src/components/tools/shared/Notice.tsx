import type { ReactNode } from 'react'
import { CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { cn } from '../../../lib/cn'

type Tone = 'info' | 'success' | 'warning'

const tones: Record<Tone, { className: string; icon: typeof Info; iconClass: string; label: string }> = {
  info: { className: 'border-slate-200 bg-slate-50/80 text-slate-700', icon: Info, iconClass: 'text-slate-500', label: 'Informação' },
  success: { className: 'border-emerald-200/90 bg-emerald-50/70 text-emerald-900', icon: CircleCheck, iconClass: 'text-emerald-600', label: 'Sucesso' },
  warning: { className: 'border-amber-200/90 bg-amber-50/70 text-amber-900', icon: TriangleAlert, iconClass: 'text-amber-600', label: 'Atenção' },
}

interface NoticeProps {
  tone?: Tone
  title?: ReactNode
  children?: ReactNode
  className?: string
}

/**
 * Informative, success or warning message. Errors use ErrorMessage. The tone is carried by
 * the icon and a spoken label, not by colour alone.
 */
export function Notice({ tone = 'info', title, children, className }: NoticeProps) {
  const { className: toneClass, icon: Icon, iconClass, label } = tones[tone]
  return (
    <div
      role={tone === 'success' ? 'status' : undefined}
      className={cn('flex items-start gap-3 rounded-2xl border p-4 text-[13px] leading-relaxed', toneClass, className)}
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', iconClass)} aria-hidden="true" />
      <div className="min-w-0 flex-1 break-words">
        <span className="sr-only">{label}: </span>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(!!title && 'mt-0.5')}>{children}</div>}
      </div>
    </div>
  )
}
