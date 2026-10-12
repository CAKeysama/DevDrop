import { useState } from 'react'
import { Checkbox, SegmentedControl, TextTransformTool } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { sortLines, type SortOrder } from '../../lib/text/sortLines'

const tool = getTool('sort-lines')
const example = 'maçã\nbanana\nÁgata\nlaranja\nbanana\nuva\nçafrão\nitem 10\nitem 2\nitem 1'

export default function SortLinesPage() {
  const [order, setOrder] = useState<SortOrder>('asc')
  const [ignoreCase, setIgnoreCase] = useState(true)
  const [ignoreAccents, setIgnoreAccents] = useState(false)
  const [numeric, setNumeric] = useState(true)
  const [removeDuplicates, setRemoveDuplicates] = useState(false)
  const [skipEmpty, setSkipEmpty] = useState(true)
  const [trimLines, setTrimLines] = useState(true)

  return (
    <TextTransformTool
      tool={tool}
      example={example}
      transform={(input) => {
        const { lines, removed } = sortLines(input, { order, ignoreCase, ignoreAccents, numeric, removeDuplicates, skipEmpty, trimLines })
        const count = `${lines.length} ${lines.length === 1 ? 'linha' : 'linhas'}`
        const summary = input ? (removed > 0 ? `${count}; ${removed} ${removed === 1 ? 'repetida removida' : 'repetidas removidas'}.` : `${count}.`) : undefined
        return { output: lines.join('\n'), summary }
      }}
      inputLabel="Lista (uma por linha)"
      outputLabel="Lista ordenada"
      placeholder="Digite ou cole uma lista, um item por linha"
      filename="devdrop-lista-ordenada.txt"
      options={
        <div className="flex flex-col gap-3">
          <SegmentedControl
            label="Ordem"
            value={order}
            onChange={setOrder}
            options={[
              { value: 'asc', label: 'A → Z' },
              { value: 'desc', label: 'Z → A' },
            ]}
          />
          <div className="flex flex-col">
            <Checkbox label="Ignorar maiúsculas e minúsculas" checked={ignoreCase} onChange={setIgnoreCase} hint="Define o que conta como linha repetida." />
            <Checkbox label="Ignorar acentos" checked={ignoreAccents} onChange={setIgnoreAccents} hint="“cafe” e “café” passam a ser a mesma linha." />
            <Checkbox label="Ordem numérica" checked={numeric} onChange={setNumeric} hint="“item 2” vem antes de “item 10”." />
            <Checkbox label="Remover linhas repetidas" checked={removeDuplicates} onChange={setRemoveDuplicates} />
            <Checkbox label="Ignorar linhas em branco" checked={skipEmpty} onChange={setSkipEmpty} />
            <Checkbox label="Aparar espaços no início e no fim de cada linha" checked={trimLines} onChange={setTrimLines} />
          </div>
        </div>
      }
      hint="Ordena em português: ç e letras acentuadas ficam junto da letra base, sem ir para o fim."
    />
  )
}
