import { Trash2 } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { surfacePill } from '../../ui/styles'

interface ClearButtonProps {
  onClear: () => void
  disabled?: boolean
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function ClearButton({
  onClear,
  disabled = false,
  label = 'Limpar',
  className,
  size = 'sm',
}: ClearButtonProps) {
  const sizeStyle =
    size === 'sm' ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2 text-[14px]'

  return (
    <button
      type="button"
      onClick={onClear}
      disabled={disabled}
      aria-label={label}
      className={cn(
        surfacePill,
        'inline-flex items-center justify-center gap-1.5 font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
        sizeStyle,
        className,
      )}
    >
      <Trash2 className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
