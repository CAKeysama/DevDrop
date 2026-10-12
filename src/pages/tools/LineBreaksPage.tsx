import { useState } from 'react'
import { Checkbox, SegmentedControl, TextField, TextTransformTool } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { breakModes, replaceLineBreaks, type BreakMode } from '../../lib/text/lineBreaks'

const tool = getTool('line-breaks')
const example = 'Primeira linha\nSegunda linha\n\nTerceira linha, depois de uma linha em branco\n'

export default function LineBreaksPage() {
  const [mode, setMode] = useState<BreakMode>('space')
  const [custom, setCustom] = useState(', ')
  const [skipEmpty, setSkipEmpty] = useState(true)
  const [trimLines, setTrimLines] = useState(false)
  const current = breakModes.find((item) => item.id === mode)!

  return (
    <TextTransformTool
      tool={tool}
      example={example}
      transform={(input) => {
        const { output, breaks } = replaceLineBreaks(input, { mode, custom, skipEmpty, trimLines })
        const verb = mode === 'remove' ? 'removida' : 'trocada'
        return { output, summary: input ? `${breaks} ${breaks === 1 ? `quebra de linha ${verb}` : `quebras de linha ${verb}s`}.` : undefined }
      }}
      outputLabel="Texto sem quebras de linha"
      filename="devdrop-sem-quebras.txt"
      options={
        <div className="flex flex-col gap-3">
          <SegmentedControl label="O que fazer com cada quebra" value={mode} onChange={setMode} options={breakModes.map((item) => ({ value: item.id, label: item.label }))} />
          {mode === 'custom' && (
            <TextField label="Trocar por" value={custom} onChange={setCustom} spellCheck={false} autoComplete="off" hint="Use \n para quebra de linha e \t para tab." code />
          )}
          <div className="flex flex-col">
            <Checkbox label="Ignorar linhas em branco" checked={skipEmpty} onChange={setSkipEmpty} />
            <Checkbox label="Aparar espaços no início e no fim de cada linha" checked={trimLines} onChange={setTrimLines} />
          </div>
        </div>
      }
      hint={current.description}
    />
  )
}
