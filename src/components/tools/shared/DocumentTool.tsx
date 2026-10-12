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
  /** "CPF", "CNPJ", "PIS/PASEP"… as it is written in the page. */
  name: string
  /** The document is feminine in Portuguese ("uma CNH", "geradas"). */
  feminine?: boolean
  /** Used in element ids and file names; defaults to the lowercase name. */
  slug?: string
  /** The number is typed with digits only, so phones show the numeric keypad. */
  numericInput?: boolean
  /** The document has a canonical mask; when it does not, the mask option is hidden. */
  maskable?: boolean
  /** What the mask adds, shown under the option. */
  maskHint?: string
  /** Who issues the document, for the note that the check is only mathematical. */
  authority?: string
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

/** Generator + validator shared by the tools of documents with check digits (CPF, CNPJ, PIS, CNH…). */
export function DocumentTool({
  name,
  feminine = false,
  slug = name.toLowerCase(),
  numericInput = name === 'CPF',
  maskable = true,
  maskHint = 'Pontos, barra e hífen.',
  authority = 'a Receita Federal',
  generate,
  display,
  validate,
  placeholder,
  example,
  options,
  variant = '',
  note,
}: DocumentToolProps) {
  const article = feminine ? 'uma' : 'um'
  const generatedWord = feminine ? 'geradas' : 'gerados'
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
                  {maskable && <Checkbox label="Com máscara" hint={maskHint} checked={masked} onChange={setMasked} />}
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
            id={`${slug}-generated`}
            label={`${name} ${generatedWord}`}
            value={output}
            placeholder={`Clique em Gerar para criar ${article} ${name}.`}
            filename={`devdrop-${slug}.txt`}
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
            inputMode={numericInput ? 'numeric' : 'text'}
            autoComplete="off"
            spellCheck={false}
            code
            hint="Com ou sem pontuação. A conferência acontece enquanto você digita."
          />
          <div className="mt-4" aria-live="polite">
            {validation === null ? (
              <EmptyState className="min-h-24">Digite {article} {name} para conferir os dígitos verificadores.</EmptyState>
            ) : validation.valid ? (
              <Notice tone="success" title={validation.message}>
                <span className="font-mono">{validation.formatted}</span>
              </Notice>
            ) : (
              <ErrorMessage title={validation.message} error={validation.hint ?? 'Confira os dígitos informados.'} />
            )}
          </div>
          <p className="mt-4 text-[12px] text-slate-500">
            A validação é matemática: confere o formato e os dígitos verificadores. Ela não consulta {authority} e,
            portanto, não diz se {feminine ? 'a' : 'o'} {name} existe ou está em vigor.
          </p>
        </ToolPanel>
      </div>

      <Notice tone="warning" title="Somente para desenvolvimento e testes.">
        Os números gerados são aleatórios e apenas matematicamente válidos. Por coincidência, podem corresponder a {article} {name}{' '}
        real. Não os use em cadastros, compras ou qualquer situação que exija um documento verdadeiro. {note}
      </Notice>
    </div>
  )
}
