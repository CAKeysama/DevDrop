import { useId } from 'react'
import { cn } from '../../../lib/cn'

interface ToggleOption<T> {
  value: T
  label: string
}

interface ToggleGroupProps<T> {
  label: string
  options: ToggleOption<T>[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
}

/** Pill buttons where exactly one option is pressed (indentation, operation, keyword case). */
export function ToggleGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: ToggleGroupProps<T>) {
  const labelId = useId()

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span id={labelId} className="text-[12px] font-medium text-muted">
        {label}
      </span>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap items-center gap-1.5">
        {options.map((option) => {
          const pressed = option.value === value
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={pressed}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                'cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out enabled:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50',
                pressed
                  ? 'border-navy bg-navy text-white shadow-sm'
                  : 'border-line-strong bg-white text-slate-700 hover:border-ink hover:text-ink',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
