import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { cn } from '../../../lib/cn'
import { isHexColor, normalizeHex } from '../../../lib/css/generators'
import { fieldControl, fieldControlError, fieldLabel } from './fieldStyles'

function FieldMessage({ id, hint, error }: { id: string; hint?: ReactNode; error?: ReactNode }) {
  if (error) {
    return (
      <p id={id} role="alert" className="text-[12px] font-medium text-rose-700">
        {error}
      </p>
    )
  }
  if (!hint) return null
  return (
    <p id={id} className="text-[12px] text-slate-500">
      {hint}
    </p>
  )
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: ReactNode
  error?: ReactNode
  /** Monospaced font, for codes and documents. */
  code?: boolean
  wrapperClassName?: string
}

/** Single-line field with label, hint and error. */
export function TextField({ label, value, onChange, hint, error, code, wrapperClassName, className, id, ...props }: TextFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', wrapperClassName)}>
      <label htmlFor={fieldId} className={fieldLabel}>
        {label}
      </label>
      <input
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? messageId : undefined}
        className={cn(fieldControl, 'h-11', code && 'font-mono', !!error && fieldControlError, className)}
        {...props}
      />
      <FieldMessage id={messageId} hint={hint} error={error} />
    </div>
  )
}

/** Field for a number typed by a person: accepts comma or dot for decimals. */
export function DecimalField(props: TextFieldProps) {
  return <TextField inputMode="decimal" autoComplete="off" {...props} />
}

interface RangeFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  className?: string
}

/** Slider paired with a number box, so the value can be dragged or typed. */
export function RangeField({ label, value, onChange, min, max, step = 1, unit, className }: RangeFieldProps) {
  const id = useId()
  const clamp = (next: number) => Math.min(max, Math.max(min, Number.isFinite(next) ? next : min))
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className={fieldLabel}>
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            aria-label={`${label}${unit ? ` (${unit})` : ''}`}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(event) => {
              if (event.target.value !== '') onChange(clamp(Number(event.target.value)))
            }}
            className="h-9 w-[4.5rem] rounded-xl border border-slate-200/80 bg-slate-50/60 px-2 text-right font-mono text-[13px] text-ink focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          {unit && <span className="w-5 text-[12px] text-slate-500">{unit}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(clamp(Number(event.target.value)))}
        className="h-6 w-full cursor-pointer accent-navy"
      />
    </div>
  )
}

interface CheckboxProps {
  label: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: ReactNode
  className?: string
}

export function Checkbox({ label, checked, onChange, hint, className }: CheckboxProps) {
  return (
    <label className={cn('flex min-h-9 cursor-pointer items-start gap-2.5 py-1.5 text-[13px] text-ink', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-navy"
      />
      <span>
        <span className="font-medium">{label}</span>
        {hint && <span className="block text-[12px] text-slate-500">{hint}</span>}
      </span>
    </label>
  )
}

interface SelectFieldProps<T extends string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label: string
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
  wrapperClassName?: string
}

export function SelectField<T extends string>({ label, value, onChange, options, wrapperClassName, className, ...props }: SelectFieldProps<T>) {
  const id = useId()
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', wrapperClassName)}>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(fieldControl, 'h-11 cursor-pointer pr-8', className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface ColorFieldProps {
  label: string
  /** Hex colour; may be temporarily invalid while it is being typed. */
  value: string
  onChange: (value: string) => void
  className?: string
}

/** Colour picker plus hex box. An invalid hex is reported, never silently ignored. */
export function ColorField({ label, value, onChange, className }: ColorFieldProps) {
  const id = useId()
  const valid = isHexColor(value)
  const messageId = `${id}-message`
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label}: seletor de cor`}
          value={normalizeHex(value) ?? '#000000'}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-200/80 bg-white p-1"
        />
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={valid ? undefined : true}
          aria-describedby={valid ? undefined : messageId}
          spellCheck={false}
          autoComplete="off"
          maxLength={7}
          className={cn(fieldControl, 'h-11 font-mono', !valid && fieldControlError)}
        />
      </div>
      <FieldMessage id={messageId} error={valid ? undefined : 'Cor inválida. Use o formato hexadecimal, como #0a1b33.'} />
    </div>
  )
}
