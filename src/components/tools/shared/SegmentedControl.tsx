import { useId } from 'react'
import { cn } from '../../../lib/cn'
import { fieldLabel } from './fieldStyles'

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
  className?: string
}

/**
 * Single choice among a few options, with the look of the mode buttons used across the tools.
 * Built on native radio inputs, so arrow keys and screen readers work out of the box.
 */
export function SegmentedControl<T extends string>({ label, value, onChange, options, className }: SegmentedControlProps<T>) {
  const name = useId()
  return (
    <fieldset className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <legend className={cn(fieldLabel, 'mb-1.5')}>{label}</legend>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="flex min-h-9 cursor-pointer items-center rounded-full border border-slate-200/80 bg-white px-4 text-[12px] font-semibold text-slate-600 transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out active:scale-[0.97] hover:text-ink peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-checked:hover:text-white peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
