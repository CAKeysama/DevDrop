import { useState } from 'react'
import {
  CalculationResult,
  ClearButton,
  DecimalField,
  ErrorMessage,
  ExampleButton,
  SegmentedControl,
  ToolPanel,
  ToolShell,
} from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { describeDotReading, parseNumber } from '../../lib/calculators/number'
import { solveRuleOfThree, type Proportion } from '../../lib/calculators/ruleOfThree'

const tool = getTool('rule-of-three')
const empty = { a: '', b: '', c: '' }

export default function RuleOfThreePage() {
  const [proportion, setProportion] = useState<Proportion>('direct')
  const [values, setValues] = useState(empty)
  const set = (key: keyof typeof empty) => (value: string) => setValues((current) => ({ ...current, [key]: value }))

  const parse = (key: keyof typeof empty, label: string) => (values[key].trim() === '' ? null : parseNumber(values[key], label))
  const a = parse('a', 'O valor A')
  const b = parse('b', 'O valor B')
  const c = parse('c', 'O valor C')
  const calculation = a?.result != null && b?.result != null && c?.result != null ? solveRuleOfThree(a.result, b.result, c.result, proportion) : null
  const isEmpty = values.a === '' && values.b === '' && values.c === ''
  const x = calculation?.result?.display

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="flex flex-col gap-6">
        <SegmentedControl
          label="Tipo de proporção"
          value={proportion}
          onChange={setProportion}
          options={[
            { value: 'direct', label: 'Direta' },
            { value: 'inverse', label: 'Inversa' },
          ]}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolPanel
            title="A está para B, assim como C está para X"
            actions={
              <>
                <ExampleButton
                  label="Exemplo"
                  onLoadExample={() => setValues(proportion === 'direct' ? { a: '2', b: '10', c: '5' } : { a: '4', b: '6', c: '8' })}
                />
                <ClearButton onClear={() => setValues(empty)} disabled={isEmpty} />
              </>
            }
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-x-2 gap-y-4 sm:gap-x-3">
              <DecimalField label="A" value={values.a} onChange={set('a')} placeholder="2" error={a?.error} hint={describeDotReading(values.a)} />
              <span aria-hidden="true" className="pt-8 text-[12px] font-medium text-slate-500">
                está para
              </span>
              <DecimalField label="B" value={values.b} onChange={set('b')} placeholder="10" error={b?.error} hint={describeDotReading(values.b)} />
              <DecimalField label="C" value={values.c} onChange={set('c')} placeholder="5" error={c?.error} hint={describeDotReading(values.c)} />
              <span aria-hidden="true" className="pt-8 text-[12px] font-medium text-slate-500">
                está para
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[12px] font-medium text-slate-500">X</span>
                <span className="block h-11 truncate rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-4 font-mono text-[15px] font-semibold leading-[2.75rem] text-ink" title={x}>
                  {x ?? '?'}
                </span>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
              {proportion === 'direct'
                ? 'Direta: quando uma grandeza aumenta, a outra aumenta na mesma proporção. Ex.: 2 kg custam R$ 10; quanto custam 5 kg?'
                : 'Inversa: quando uma grandeza aumenta, a outra diminui. Ex.: 4 pessoas fazem o trabalho em 6 dias; em quantos dias 8 pessoas fazem?'}
            </p>
            <p className="mt-2 text-[12px] text-slate-500">Use vírgula para os decimais. O ponto separa milhares: 1.250 é mil duzentos e cinquenta.</p>
            {calculation?.error && <ErrorMessage className="mt-4" title={calculation.error} error={calculation.hint ?? 'Revise os valores.'} />}
          </ToolPanel>
          <CalculationResult calculation={calculation?.result ?? null} emptyText="Preencha A, B e C para descobrir o valor de X." />
        </div>
      </div>
    </ToolShell>
  )
}
