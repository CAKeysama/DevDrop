import { useMemo, useState } from 'react'
import { ClearButton, CodeInput, CodeOutput, ExampleButton, PasteButton, SegmentedControl, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { caseModes, convertCase, type CaseMode } from '../../lib/text/caseConvert'

const tool = getTool('case-converter')
const example = 'a volta ao mundo em 80 dias. ESCRITO por júlio verne! uma aventura de phileas fogg.'

export default function CaseConverterPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<CaseMode>('upper')
  const output = useMemo(() => convertCase(input, mode), [input, mode])
  const description = caseModes.find((item) => item.id === mode)!.description

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeInput
          id="case-converter-input"
          label="Texto original"
          value={input}
          onChange={setInput}
          prose
          placeholder="Digite ou cole o texto aqui"
          actions={
            <>
              <ExampleButton onLoadExample={() => setInput(example)} label="Exemplo" />
              <PasteButton onPaste={setInput} />
              <ClearButton onClear={() => setInput('')} disabled={!input} />
            </>
          }
          footer={
            <div className="flex flex-col gap-2">
              <SegmentedControl label="Formato" value={mode} onChange={setMode} options={caseModes.map((item) => ({ value: item.id, label: item.label }))} />
              <p className="text-[12px] text-slate-500">{description} Acentos, números, emoji e pontuação não são alterados.</p>
            </div>
          }
        />
        <CodeOutput
          id="case-converter-output"
          label="Texto convertido"
          value={output}
          prose
          placeholder="O texto convertido aparece aqui enquanto você digita."
          filename="devdrop-texto.txt"
        />
      </div>
    </ToolShell>
  )
}
