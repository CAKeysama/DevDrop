import { cn } from '../../../lib/cn'
import { surfacePill } from '../../ui/styles'

export type IndentOption = 2 | 4 | '\t'

interface IndentSelectProps {
  value: IndentOption
  onChange: (value: IndentOption) => void
  className?: string
  id?: string
}

export function IndentSelect({
  value,
  onChange,
  className,
  id = 'indent-select',
}: IndentSelectProps) {
  return (
    <div className={cn('inline-flex items-center gap-1.5 text-[12px]', className)}>
      <label htmlFor={id} className="font-medium text-muted whitespace-nowrap">
        Indentação:
      </label>
      <select
        id={id}
        value={value === '\t' ? 'tab' : value}
        onChange={(e) => {
          const val = e.target.value
          if (val === 'tab') onChange('\t')
          else onChange(Number(val) as 2 | 4)
        }}
        className={cn(
          surfacePill,
          'cursor-pointer border-line-strong px-3 py-1 text-[12px] font-medium text-ink',
        )}
      >
        <option value={2}>2 espaços</option>
        <option value={4}>4 espaços</option>
        <option value="tab">1 tabulação</option>
      </select>
    </div>
  )
}
