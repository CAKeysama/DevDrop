import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { surfacePill } from '../../ui/styles'

interface CopyButtonProps {
  text: string
  label?: string
  successLabel?: string
  size?: 'sm' | 'md'
  variant?: 'surface' | 'primary' | 'ghost'
  className?: string
  disabled?: boolean
}

export function CopyButton({
  text,
  label = 'Copiar',
  successLabel = 'Copiado!',
  size = 'sm',
  variant = 'surface',
  className,
  disabled = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!text || disabled) return

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for non-secure contexts or older environments
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // If copying fails, fallback
      setCopied(false)
    }
  }

  const baseStyle =
    'inline-flex items-center justify-center gap-1.5 font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'

  const sizeStyle =
    size === 'sm' ? 'px-3 py-1.5 text-[12px] rounded-full' : 'px-5 py-2 text-[14px] rounded-full'

  const variantStyle =
    variant === 'surface'
      ? surfacePill
      : variant === 'primary'
        ? 'bg-navy text-white hover:bg-slate-800'
        : 'text-slate-600 hover:text-ink hover:bg-slate-100 rounded-full'

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled || !text}
      aria-label={copied ? successLabel : label}
      className={cn(
        baseStyle,
        sizeStyle,
        variantStyle,
        copied && 'text-emerald-700 border-emerald-200 bg-emerald-50/80',
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
          <span>{successLabel}</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Código copiado para a área de transferência' : ''}
      </span>
    </button>
  )
}
