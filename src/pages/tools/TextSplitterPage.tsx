import { useState } from 'react'
import { Checkbox, SegmentedControl, TextField, TextTransformTool } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { separators, splitText, type SeparatorId } from '../../lib/text/split'

const tool = getTool('text-splitter')
const example = 'maçã, banana, laranja, , uva,  pêra ,manga'

export default function TextSplitterPage() {
  const [separator, setSeparator] = useState<SeparatorId>('comma')
  const [custom, setCustom] = useState('')
  const [trim, setTrim] = useState(true)
  const [skipEmpty, setSkipEmpty] = useState(true)

  return (
    <TextTransformTool
      tool={tool}
      example={example}
      transform={(input) => {
        const { parts, needsSeparator } = splitText(input, { separator, custom, trim, skipEmpty })
        if (needsSeparator) return { output: '', summary: 'Digite o separador acima para dividir o texto.' }
        return { output: parts.join('\n'), summary: input ? `${parts.length} ${parts.length === 1 ? 'parte' : 'partes'}, uma por linha.` : undefined }
      }}
      outputLabel="Partes"
      outputPlaceholder="As partes aparecem aqui, uma por linha."
      filename="devdrop-partes.txt"
      options={
        <div className="flex flex-col gap-3">
          <SegmentedControl label="Dividir por" value={separator} onChange={setSeparator} options={separators.map((item) => ({ value: item.id, label: item.label }))} />
          {separator === 'custom' && (
            <TextField label="Separador" value={custom} onChange={setCustom} spellCheck={false} autoComplete="off" hint="Pode ter mais de um caractere. Use \n para quebra de linha e \t para tab." code />
          )}
          <div className="flex flex-col">
            <Checkbox label="Aparar espaços de cada parte" checked={trim} onChange={setTrim} />
            <Checkbox label="Ignorar partes vazias" checked={skipEmpty} onChange={setSkipEmpty} />
          </div>
        </div>
      }
      hint="O separador não aparece no resultado. Diferencia maiúsculas de minúsculas."
    />
  )
}
