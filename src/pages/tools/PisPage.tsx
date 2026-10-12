import { DocumentTool, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { pis } from '../../lib/generators/pis'

const tool = getTool('pis-pasep')

export default function PisPage() {
  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <DocumentTool
        name="PIS/PASEP"
        slug="pis-pasep"
        numericInput
        authority="a Caixa Econômica Federal ou o Banco do Brasil"
        maskHint="Pontos e hífen: 000.00000.00-0."
        generate={() => pis.generate(false)}
        display={pis.display}
        validate={pis.validate}
        placeholder="000.00000.00-0"
        example="160.92269.74-1"
        note="PIS, PASEP e NIT usam o mesmo número de 11 dígitos e o mesmo cálculo."
      />
    </ToolShell>
  )
}
