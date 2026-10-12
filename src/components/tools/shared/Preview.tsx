import type { ReactNode } from 'react'
import { cn } from '../../../lib/cn'
import { surfacePill } from '../../ui/styles'

/** Stage where a CSS generator shows its live preview. */
export function PreviewStage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/60 bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)] bg-[length:16px_16px] p-8 sm:min-h-72',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Row of ready-made presets. */
export function Presets<T>({ presets, onSelect }: { presets: Array<{ name: string; value: T }>; onSelect: (value: T) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-slate-500">Exemplos prontos</span>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onSelect(preset.value)}
            className={cn(surfacePill, 'cursor-pointer px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:text-ink')}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  )
}
