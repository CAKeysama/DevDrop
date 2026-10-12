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
import { calculatePercentage, percentageModes, type PercentageMode } from '../../lib/calculators/percentage'

const tool = getTool('percentage')

export default function PercentagePage() {
  const [mode, setMode] = useState<PercentageMode>('percent-of')
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const info = percentageModes.find((item) => item.id === mode)!

  // A field only shows an error once something was typed in it.
  const a = first.trim() === '' ? null : parseNumber(first, info.fields[0])
  const b = second.trim() === '' ? null : parseNumber(second, info.fields[1])
  const calculation = a?.result != null && b?.result != null ? calculatePercentage(mode, a.result, b.result) : null

  function changeMode(next: PercentageMode) {
    setMode(next)
    setFirst('')
    setSecond('')
  }

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="flex flex-col gap-6">
        <SegmentedControl label="Tipo de cálculo" value={mode} onChange={changeMode} options={percentageModes.map((item) => ({ value: item.id, label: item.label }))} />
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolPanel
            title={info.question}
            actions={
              <>
                <ExampleButton
                  label="Exemplo"
                  onLoadExample={() => {
                    setFirst(info.example[0])
                    setSecond(info.example[1])
                  }}
                />
                <ClearButton
                  onClear={() => {
                    setFirst('')
                    setSecond('')
                  }}
                  disabled={first === '' && second === ''}
                />
              </>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <DecimalField label={info.fields[0]} value={first} onChange={setFirst} placeholder={info.example[0]} error={a?.error} hint={describeDotReading(first)} />
              <DecimalField label={info.fields[1]} value={second} onChange={setSecond} placeholder={info.example[1]} error={b?.error} hint={describeDotReading(second)} />
            </div>
            <p className="mt-4 text-[12px] text-slate-500">
              Use vírgula para os decimais. O ponto separa milhares: 1.250 é mil duzentos e cinquenta. O resultado é
              calculado enquanto você digita.
            </p>
            {calculation?.error && <ErrorMessage className="mt-4" title={calculation.error} error={calculation.hint ?? 'Revise os valores.'} />}
          </ToolPanel>
          <CalculationResult calculation={calculation?.result ?? null} emptyText="Preencha os dois campos para ver o resultado, a fórmula e o passo a passo." />
        </div>
      </div>
    </ToolShell>
  )
}
