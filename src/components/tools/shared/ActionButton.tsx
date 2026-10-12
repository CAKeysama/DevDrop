import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../../lib/cn'
import { surfacePill } from '../../ui/styles'

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` for the main action of a tool, `surface` for secondary ones. */
  variant?: 'primary' | 'surface'
}

/** Main and secondary actions of a tool (Gerar, Calcular…), in the same pill style as the other buttons. */
export function ActionButton({ variant = 'surface', className, type = 'button', ...props }: ActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-3.5 [&_svg]:shrink-0',
        variant === 'primary' ? 'bg-[#0a152d] text-white shadow-sm hover:bg-slate-800' : cn(surfacePill, 'text-slate-700 hover:text-ink'),
        className,
      )}
      {...props}
    />
  )
}
