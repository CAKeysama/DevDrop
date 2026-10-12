import { useState } from 'react'
import { Checkbox, TextTransformTool } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { removeAccents } from '../../lib/text/accents'

const tool = getTool('remove-accents')
const example = 'Ação, coração e avião: pão de açúcar, São João, à toa. Ørsted, straße.'

export default function RemoveAccentsPage() {
  const [keepCedilla, setKeepCedilla] = useState(false)

  return (
    <TextTransformTool
      tool={tool}
      example={example}
      transform={(input) => {
        const { output, changed } = removeAccents(input, { keepCedilla })
        return { output, summary: input ? `${changed} ${changed === 1 ? 'letra alterada' : 'letras alteradas'}.` : undefined }
      }}
      outputLabel="Texto sem acentos"
      filename="devdrop-sem-acentos.txt"
      options={<Checkbox label="Manter o ç" checked={keepCedilla} onChange={setKeepCedilla} />}
      hint="Tira acentos, til, trema e cedilha das letras latinas. Letras como ø, ł e ß viram o, l e ss. Outros alfabetos não são alterados."
    />
  )
}
