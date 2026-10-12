import { useState } from 'react'
import { DocumentTool, SelectField, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { displayVoterId, generateVoterId, validateVoterId, voterStates, type VoterStateCode } from '../../lib/generators/voterId'

const tool = getTool('voter-id')

type StateChoice = VoterStateCode | 'any'

const stateOptions: Array<{ value: StateChoice; label: string }> = [
  { value: 'any', label: 'Qualquer estado' },
  ...voterStates.map((state) => ({ value: state.code as StateChoice, label: `${state.uf} — ${state.name}` })),
]

export default function VoterIdPage() {
  const [state, setState] = useState<StateChoice>('any')

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <DocumentTool
        name="Título de eleitor"
        slug="titulo-eleitor"
        numericInput
        authority="a Justiça Eleitoral"
        maskHint="Grupos de quatro dígitos: 0000 0000 0000."
        generate={() => generateVoterId(state, false)}
        display={displayVoterId}
        validate={validateVoterId}
        placeholder="0000 0000 0000"
        example="1023 8501 0671"
        variant={state}
        options={<SelectField label="Estado" value={state} onChange={setState} options={stateOptions} wrapperClassName="mt-3 max-w-64" />}
        note="O número tem 8 dígitos sequenciais, 2 do estado de inscrição e 2 verificadores. Em São Paulo e em Minas Gerais, resto 0 no cálculo gera o dígito 1."
      />
    </ToolShell>
  )
}
