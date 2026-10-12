import { useState } from 'react'
import { Checkbox, DocumentTool, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { displayCnpj, generateCnpj, validateCnpj } from '../../lib/generators/cnpj'

const tool = getTool('cnpj')

export default function CnpjPage() {
  const [alphanumeric, setAlphanumeric] = useState(false)

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <DocumentTool
        name="CNPJ"
        generate={() => generateCnpj({ masked: false, alphanumeric })}
        display={displayCnpj}
        validate={validateCnpj}
        placeholder="00.000.000/0000-00"
        example="11.222.333/0001-81"
        variant={alphanumeric ? 'alphanumeric' : 'numeric'}
        options={
          <Checkbox
            label="Formato alfanumérico"
            hint="Letras e números nas 12 primeiras posições (IN RFB nº 2.229/2024)."
            checked={alphanumeric}
            onChange={setAlphanumeric}
          />
        }
        note="A validação aceita tanto o formato numérico quanto o alfanumérico."
      />
    </ToolShell>
  )
}
