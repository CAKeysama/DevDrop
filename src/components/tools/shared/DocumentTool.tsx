import { useState, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import type { DocumentValidation } from '../../../lib/generators/cpf'
import { ActionButton } from './ActionButton'
import { ClearButton } from './ClearButton'
import { CodeOutput } from './CodeOutput'
import { EmptyState } from './EmptyState'
import { ErrorMessage } from './ErrorMessage'
import { ExampleButton } from './ExampleButton'
import { Checkbox, TextField } from './Fields'
import { Notice } from './Notice'
import { ToolPanel } from './ToolPanel'

const MAX_QUANTITY = 100

interface DocumentToolProps {
  /** "CPF" or "CNPJ". */
  name: string
  /** Generates one number, without mask. */
  generate: () => string
  /** Shows a number with or without the mask. */
  display: (value: string, masked: boolean) => string
  validate: (value: string) => DocumentValidation
  placeholder: string
  /** A valid number for the "Exemplo" button of the validator. */
  example: string
  /** Extra generator options. */
  options?: ReactNode
  /** Identifies the extra options; when it changes, the list is generated again. */
  variant?: string
  /** Extra sentence for the disclaimer. */
  note?: ReactNode
}

/** Generator + validator shared by the CPF and CNPJ tools. */
export function DocumentTool({ name, generate, display, validate, placeholder, example, options, variant = '', note }: DocumentToolProps) {
  const [masked, setMasked] = useState(true)
  const [quantityText, setQuantityText] = useState('1')
  const [generated, setGenerated] = useState<string[]>(() => [generate()])
  const [candidate, setCandidate] = useState('')
  const [lastVariant, setLastVariant] = useState(variant)

  // The extra options change what is generated, so the list follows them at once.
  if (variant !== lastVariant) {
    setLastVariant(variant)
    setGenerated((current) => current.map(() => generate()))
  }

  const quantity = /^\d+$/.test(quantityText.trim()) ? Number(quantityText) : NaN
  const quantityValid = Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY
  // The mask is a display option: toggling it reformats the same numbers.
  const output = generated.map((value) => display(value, masked)).join('\n')
  const validation = candidate.trim() === '' ? null : validate(candidate)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <ToolPanel title={`Gerar ${name}`}>
            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                if (quantityValid) setGenerated(Array.from({ length: quantity }, () => generate()))
              }}
            >
              <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
                <TextField
                  label="Quantidade"
                  value={quantityText}
                  onChange={setQuantityText}
                  inputMode="numeric"
                  error={quantityValid ? undefined : `Informe um número inteiro de 1 a ${MAX_QUANTITY}.`}
                  wrapperClassName="w-32"
                />
                <div className="pt-5">
                  <Checkbox label="Com máscara" hint="Pontos, barra e hífen." checked={masked} onChange={setMasked} />
                  {options}
                </div>
              </div>
              <ActionButton type="submit" variant="primary" className="self-start" disabled={!quantityValid}>
                <RefreshCw aria-hidden="true" />
                Gerar
              </ActionButton>
            </form>
          </ToolPanel>
          <CodeOutput
            id={`${name.toLowerCase()}-generated`}
            label={`${name} gerados`}
            value={output}
            placeholder={`Clique em Gerar para criar um ${name}.`}
            filename={`devdrop-${name.toLowerCase()}.txt`}
            minHeight="min-h-[120px]"
            actions={<ClearButton onClear={() => setGenerated([])} disabled={generated.length === 0} />}
          />
        </div>

        <ToolPanel
          title={`Validar ${name}`}
          actions={
            <>
              <ExampleButton onLoadExample={() => setCandidate(example)} label="Exemplo" />
              <ClearButton onClear={() => setCandidate('')} disabled={candidate === ''} />
            </>
          }
        >
          <TextField
            label={`${name} para conferir`}
            value={candidate}
            onChange={setCandidate}
            placeholder={placeholder}
            inputMode={name === 'CPF' ? 'numeric' : 'text'}
            autoComplete="off"
            spellCheck={false}
            code
            hint="Com ou sem pontuação. A conferência acontece enquanto você digita."
          />
          <div className="mt-4" aria-live="polite">
            {validation === null ? (
              <EmptyState className="min-h-24">Digite um {name} para conferir os dígitos verificadores.</EmptyState>
            ) : validation.valid ? (
              <Notice tone="success" title={validation.message}>
                <span className="font-mono">{validation.formatted}</span>
              </Notice>
            ) : (
              <ErrorMessage title={validation.message} error={validation.hint ?? 'Confira os dígitos informados.'} />
            )}
          </div>
          <p className="mt-4 text-[12px] text-slate-500">
            A validação é matemática: confere o formato e os dígitos verificadores. Ela não consulta a Receita Federal e,
            portanto, não diz se o {name} existe ou está ativo.
          </p>
        </ToolPanel>
      </div>

      <Notice tone="warning" title="Somente para desenvolvimento e testes.">
        Os números gerados são aleatórios e apenas matematicamente válidos. Por coincidência, podem corresponder a um {name}{' '}
        real. Não os use em cadastros, compras ou qualquer situação que exija um documento verdadeiro. {note}
      </Notice>
    </div>
  )
}
