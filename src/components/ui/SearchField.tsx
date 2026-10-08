import type { InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import { cn } from '../../lib/cn'

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  wrapperClassName?: string
}

/** Pill search input with an accessible (visually hidden) label. */
export function SearchField({ label, id = 'tool-search', wrapperClassName, className, ...props }: SearchFieldProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        id={id}
        type="search"
        autoComplete="off"
        spellCheck={false}
        className={cn(
          'h-14 w-full rounded-full border border-slate-200/70 bg-white pl-12 pr-5 text-[15px] text-ink shadow-sm placeholder:text-slate-400 transition-colors hover:border-slate-300 [&::-webkit-search-cancel-button]:appearance-none',
          className,
        )}
        {...props}
      />
    </div>
  )
}
