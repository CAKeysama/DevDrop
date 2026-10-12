import { useState } from 'react'
import { Clipboard, Check } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { pressable, surfacePill } from '../../ui/styles'

interface PasteButtonProps {
  onPaste: (text: string) => void
  label?: string
  className?: string
  disabled?: boolean
}

export function PasteButton({
  onPaste,
  label = 'Colar',
  className,
  disabled = false,
}: PasteButtonProps) {
  const [pasted, setPasted] = useState(false)

  async function handlePaste() {
    if (disabled) return

    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText()
        if (text) {
          onPaste(text)
          setPasted(true)
          setTimeout(() => setPasted(false), 1500)
        }
      }
    } catch {
      // Permission denied or not supported
    }
  }

  return (
    <button
      type="button"
      onClick={handlePaste}
      disabled={disabled}
      aria-label={label}
      className={cn(
        surfacePill,
        pressable,
        'inline-flex cursor-pointer items-center justify-center gap-1.5 px-3 py-1 text-[12px] font-semibold text-slate-700 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed',
        pasted && 'border-emerald-200 bg-emerald-50/80 text-emerald-700',
        className,
      )}
    >
      {pasted ? (
        <>
          <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
          <span>Colado!</span>
        </>
      ) : (
        <>
          <Clipboard className="size-3.5 text-slate-500" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
