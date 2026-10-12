import { DocumentTool, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { cnh } from '../../lib/generators/cnh'

const tool = getTool('cnh')

export default function CnhPage() {
  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <DocumentTool
        name="CNH"
        feminine
        numericInput
        maskable={false}
        authority="o Detran"
        generate={() => cnh.generate(false)}
        display={cnh.display}
        validate={cnh.validate}
        placeholder="00000000000"
        example="58316794534"
        note="Aqui vale o número de registro da CNH, de 11 dígitos, e não o número do espelho nem o código de segurança."
      />
    </ToolShell>
  )
}
