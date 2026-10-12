import { useState } from 'react'
import { SegmentedControl, TextTransformTool } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { reverseModes, reverseText, type ReverseMode } from '../../lib/text/reverse'

const tool = getTool('text-reverser')
const example = 'Olá, mundo! Este texto vai de trás para frente.\nSegunda linha, com 🚀 emoji.'

export default function TextReverserPage() {
  const [mode, setMode] = useState<ReverseMode>('characters')
  const current = reverseModes.find((item) => item.id === mode)!

  return (
    <TextTransformTool
      tool={tool}
      example={example}
      transform={(input) => ({ output: reverseText(input, mode) })}
      outputLabel="Texto invertido"
      filename="devdrop-texto-invertido.txt"
      options={
        <SegmentedControl label="O que inverter" value={mode} onChange={setMode} options={reverseModes.map((item) => ({ value: item.id, label: item.label }))} />
      }
      hint={current.description}
    />
  )
}
