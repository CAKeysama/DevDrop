import { Sparkles } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { surfacePill } from '../../ui/styles'

interface ExampleButtonProps {
  onLoadExample: () => void
  disabled?: boolean
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function ExampleButton({
  onLoadExample,
  disabled = false,
  label = 'Carregar exemplo',
  className,
  size = 'sm',
}: ExampleButtonProps) {
  const sizeStyle =
    size === 'sm' ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2 text-[14px]'

  return (
    <button
      type="button"
      onClick={onLoadExample}
      disabled={disabled}
      aria-label={label}
      className={cn(
        surfacePill,
        'inline-flex items-center justify-center gap-1.5 font-semibold text-slate-700 hover:text-ink hover:border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
        sizeStyle,
        className,
      )}
    >
      <Sparkles className="size-3.5 text-amber-500" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
