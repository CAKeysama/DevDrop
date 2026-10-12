import { useState } from 'react'
import { Checkbox, SegmentedControl, TextField, TextTransformTool } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { cutText, parseCount, type CutMode, type CutUnit } from '../../lib/text/cut'

const tool = getTool('text-cutter')
const example = 'O DevDrop reúne formatadores, geradores e calculadoras. Tudo roda no seu navegador, sem cadastro e sem enviar o que você digita.'

const hints: Record<CutMode, string> = {
  first: 'Mantém só o começo do texto.',
  last: 'Mantém só o final do texto.',
  range: 'Mantém o trecho do início ao fim informados, contando a partir de 1 e incluindo os dois extremos.',
}

export default function TextCutterPage() {
  const [unit, setUnit] = useState<CutUnit>('characters')
  const [mode, setMode] = useState<CutMode>('first')
  const [count, setCount] = useState('50')
  const [from, setFrom] = useState('1')
  const [to, setTo] = useState('50')
  const [perLine, setPerLine] = useState(false)
  const [ellipsis, setEllipsis] = useState(false)
  const unitLabel = unit === 'characters' ? 'caracteres' : 'palavras'

  return (
    <TextTransformTool
      tool={tool}
      example={example}
      transform={(input) => {
        const result = cutText(input, { unit, mode, count: parseCount(count), from: parseCount(from), to: parseCount(to), perLine, ellipsis })
        return {
          output: result.output,
          error: result.error,
          summary: input && !result.error ? `${result.kept} de ${result.total} ${unitLabel} mantidos.` : undefined,
        }
      }}
      outputLabel="Trecho"
      filename="devdrop-trecho.txt"
      options={
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <SegmentedControl
              label="Contar"
              value={unit}
              onChange={setUnit}
              options={[
                { value: 'characters', label: 'Caracteres' },
                { value: 'words', label: 'Palavras' },
              ]}
            />
            <SegmentedControl
              label="Manter"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'first', label: 'Os primeiros' },
                { value: 'last', label: 'Os últimos' },
                { value: 'range', label: 'Do início ao fim' },
              ]}
            />
          </div>
          {mode === 'range' ? (
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Do número" value={from} onChange={setFrom} inputMode="numeric" autoComplete="off" />
              <TextField label="Ao número" value={to} onChange={setTo} inputMode="numeric" autoComplete="off" />
            </div>
          ) : (
            <TextField label={`Quantos ${unitLabel}`} value={count} onChange={setCount} inputMode="numeric" autoComplete="off" />
          )}
          <div className="flex flex-col">
            <Checkbox label="Cortar cada linha separadamente" checked={perLine} onChange={setPerLine} />
            <Checkbox label="Marcar com … onde foi cortado" checked={ellipsis} onChange={setEllipsis} />
          </div>
        </div>
      }
      hint={`${hints[mode]}${unit === 'words' ? ' Em palavras, o resultado usa um espaço entre elas.' : ''}`}
    />
  )
}
