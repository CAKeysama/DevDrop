import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ActionButton, Checkbox, ClearButton, CodeOutput, SegmentedControl, TextField, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { formatNumber } from '../../lib/calculators/number'
import { generateLorem, loremLimits, loremUnitLabels, type LoremUnit } from '../../lib/generators/lorem'
import { getTextStats } from '../../lib/text/textStats'

const tool = getTool('lorem-ipsum')
const defaults: Record<LoremUnit, string> = { words: '50', sentences: '5', paragraphs: '3' }

export default function LoremIpsumPage() {
  const [unit, setUnit] = useState<LoremUnit>('paragraphs')
  const [countText, setCountText] = useState(defaults.paragraphs)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [text, setText] = useState(() => generateLorem({ unit: 'paragraphs', count: 3 }).result ?? '')

  const count = /^\d+$/.test(countText.trim()) ? Number(countText) : NaN
  const valid = Number.isInteger(count) && count >= 1 && count <= loremLimits[unit]
  const stats = getTextStats(text)

  function generate(nextUnit = unit, nextCount = count, nextStart = startWithLorem) {
    const generated = generateLorem({ unit: nextUnit, count: nextCount, startWithLorem: nextStart })
    if (generated.result !== null) setText(generated.result)
  }

  function changeUnit(next: LoremUnit) {
    setUnit(next)
    setCountText(defaults[next])
    generate(next, Number(defaults[next]))
  }

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <ToolPanel title="Opções">
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              generate()
            }}
          >
            <SegmentedControl
              label="Gerar em"
              value={unit}
              onChange={changeUnit}
              options={(Object.keys(loremUnitLabels) as LoremUnit[]).map((value) => ({ value, label: loremUnitLabels[value] }))}
            />
            <TextField
              label="Quantidade"
              value={countText}
              onChange={setCountText}
              inputMode="numeric"
              error={valid ? undefined : `Informe um número inteiro de 1 a ${loremLimits[unit]}.`}
              hint={`De 1 a ${loremLimits[unit]} ${loremUnitLabels[unit].toLowerCase()}.`}
              wrapperClassName="max-w-40"
            />
            <Checkbox
              label="Começar com “Lorem ipsum dolor sit amet”"
              checked={startWithLorem}
              onChange={(checked) => {
                setStartWithLorem(checked)
                if (valid) generate(unit, count, checked)
              }}
            />
            <ActionButton type="submit" variant="primary" className="self-start" disabled={!valid}>
              <RefreshCw aria-hidden="true" />
              Gerar novamente
            </ActionButton>
          </form>
        </ToolPanel>

        <CodeOutput
          id="lorem-output"
          label="Texto gerado"
          value={text}
          prose
          placeholder="Clique em Gerar novamente para criar um texto."
          filename="devdrop-lorem-ipsum.txt"
          minHeight="min-h-[260px] md:min-h-[320px]"
          actions={<ClearButton onClear={() => setText('')} disabled={!text} />}
          footer={
            text ? (
              <p className="text-[12px] text-slate-500">
                {formatNumber(stats.words)} palavras · {formatNumber(stats.sentences)} frases · {formatNumber(stats.paragraphs)} parágrafos ·{' '}
                {formatNumber(stats.characters)} caracteres
              </p>
            ) : undefined
          }
        />
      </div>
    </ToolShell>
  )
}
