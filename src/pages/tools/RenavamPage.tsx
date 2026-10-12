import { DocumentTool, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { renavam } from '../../lib/generators/renavam'

const tool = getTool('renavam')

export default function RenavamPage() {
  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <DocumentTool
        name="RENAVAM"
        numericInput
        maskable={false}
        authority="o Detran"
        generate={() => renavam.generate(false)}
        display={renavam.display}
        validate={renavam.validate}
        placeholder="00000000000"
        example="42219273036"
        note="O RENAVAM não tem pontuação: são 11 dígitos seguidos."
      />
    </ToolShell>
  )
}
