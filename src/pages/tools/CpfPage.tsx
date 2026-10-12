import { DocumentTool, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { displayCpf, generateCpf, validateCpf } from '../../lib/generators/cpf'

const tool = getTool('cpf')

export default function CpfPage() {
  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <DocumentTool
        name="CPF"
        generate={() => generateCpf(false)}
        display={displayCpf}
        validate={validateCpf}
        placeholder="000.000.000-00"
        example="529.982.247-25"
      />
    </ToolShell>
  )
}
