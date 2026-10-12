import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ActionButton, Checkbox, ClearButton, CodeOutput, TextField, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { UUID_MAX_QUANTITY, formatUuid, generateUuids } from '../../lib/generators/uuid'

const tool = getTool('uuid')

export default function UuidGeneratorPage() {
  const [quantityText, setQuantityText] = useState('1')
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [ids, setIds] = useState<string[]>(() => generateUuids({ quantity: 1 }).result ?? [])

  const quantity = /^\d+$/.test(quantityText.trim()) ? Number(quantityText) : NaN
  const quantityValid = Number.isInteger(quantity) && quantity >= 1 && quantity <= UUID_MAX_QUANTITY
  // Letter case and hyphens are display options: toggling them reformats the same UUIDs.
  const output = ids.map((id) => formatUuid(id, { uppercase, hyphens })).join('\n')

  function generate() {
    const generated = generateUuids({ quantity })
    if (generated.result) setIds(generated.result)
  }

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <ToolPanel title="Opções">
          <form
            className="flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              generate()
            }}
          >
            <TextField
              label="Quantidade"
              value={quantityText}
              onChange={setQuantityText}
              inputMode="numeric"
              error={quantityValid ? undefined : `Informe um número inteiro de 1 a ${UUID_MAX_QUANTITY}.`}
              hint={`De 1 a ${UUID_MAX_QUANTITY}.`}
              wrapperClassName="max-w-40"
            />
            <Checkbox label="Letras maiúsculas" checked={uppercase} onChange={setUppercase} />
            <Checkbox label="Com hifens" hint="Desmarque para 32 caracteres seguidos." checked={hyphens} onChange={setHyphens} />
            <ActionButton type="submit" variant="primary" className="mt-2 self-start" disabled={!quantityValid}>
              <RefreshCw aria-hidden="true" />
              Gerar
            </ActionButton>
          </form>
          <p className="mt-5 text-[12px] text-slate-500">
            UUID versão 4: 122 bits aleatórios vindos do gerador criptográfico do navegador. A chance de repetição é
            desprezível na prática.
          </p>
        </ToolPanel>

        <CodeOutput
          id="uuid-output"
          label={ids.length === 1 ? '1 UUID gerado' : `${ids.length} UUIDs gerados`}
          value={output}
          placeholder="Clique em Gerar para criar novos UUIDs."
          filename="devdrop-uuids.txt"
          actions={<ClearButton onClear={() => setIds([])} disabled={ids.length === 0} />}
        />
      </div>
    </ToolShell>
  )
}
