import { useState } from 'react'
import { Check, Download } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { surfacePill } from '../../ui/styles'

interface DownloadButtonProps {
  content: string
  filename: string
  mimeType?: string
  label?: string
  className?: string
  disabled?: boolean
}

export function DownloadButton({
  content,
  filename,
  mimeType = 'text/plain',
  label = 'Baixar',
  className,
  disabled = false,
}: DownloadButtonProps) {
  const [downloaded, setDownloaded] = useState(false)

  function handleDownload() {
    if (!content || disabled) return

    try {
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2000)
    } catch {
      setDownloaded(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || !content}
      aria-label={label}
      className={cn(
        surfacePill,
        'inline-flex cursor-pointer items-center justify-center gap-1.5 px-3 py-1 text-[12px] font-semibold text-slate-700 hover:text-ink transition-all disabled:opacity-40 disabled:cursor-not-allowed',
        downloaded && 'border-emerald-200 bg-emerald-50/80 text-emerald-700',
        className,
      )}
    >
      {downloaded ? (
        <>
          <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
          <span>Baixado!</span>
        </>
      ) : (
        <>
          <Download className="size-3.5 text-slate-500" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
