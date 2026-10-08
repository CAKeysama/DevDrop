import { cn } from '../../lib/cn'

/** Placeholder logo: a circular mark. Replace the glyph when the final logo exists. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex w-9 h-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-[14px] text-[#0a1b33]',
        className,
      )}
    >
      ✦
    </span>
  )
}
