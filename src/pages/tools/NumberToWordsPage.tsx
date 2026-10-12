import { useState } from 'react'
import { SegmentedControl, TextTransformTool } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { numbersToWords, wordsCurrencies, wordsModes, type WordsCurrency, type WordsGender, type WordsMode } from '../../lib/text/numberWords'

const tool = getTool('number-to-words')
const example = '1250\n3,14\n1.000.000\n2,50\n1999'

export default function NumberToWordsPage() {
  const [mode, setMode] = useState<WordsMode>('number')
  const [gender, setGender] = useState<WordsGender>('male')
  const [currency, setCurrency] = useState<WordsCurrency>('BRL')
  const current = wordsModes.find((item) => item.id === mode)!

  return (
    <TextTransformTool
      tool={tool}
      example={example}
      transform={(input) => {
        const { output, converted, firstError } = numbersToWords(input, { mode, gender, currency })
        return {
          output,
          error: firstError ? `Linha ${firstError.line}: ${firstError.message}` : undefined,
          errorTitle: 'Número inválido',
          summary: converted > 0 ? `${converted} ${converted === 1 ? 'número escrito' : 'números escritos'} por extenso.` : undefined,
        }
      }}
      inputLabel="Números (um por linha)"
      outputLabel="Por extenso"
      placeholder="Digite um número por linha, ex.: 1.234,56"
      outputPlaceholder="O número por extenso aparece aqui enquanto você digita."
      filename="devdrop-por-extenso.txt"
      options={
        <div className="flex flex-col gap-3">
          <SegmentedControl label="Escrever como" value={mode} onChange={setMode} options={wordsModes.map((item) => ({ value: item.id, label: item.label }))} />
          {mode === 'currency' ? (
            <SegmentedControl label="Moeda" value={currency} onChange={setCurrency} options={wordsCurrencies.map((item) => ({ value: item.id, label: item.label }))} />
          ) : (
            <SegmentedControl
              label="Gênero"
              value={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: 'Masculino (um, dois)' },
                { value: 'female', label: 'Feminino (uma, duas)' },
              ]}
            />
          )}
        </div>
      }
      hint={`${current.description} Use ponto para milhares e vírgula para decimais (1.234,56). Até 42 dígitos.`}
    />
  )
}
