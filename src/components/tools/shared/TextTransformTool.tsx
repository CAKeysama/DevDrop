import { useState, type ReactNode } from 'react'
import type { Tool } from '../../../data/tools'
import { ClearButton } from './ClearButton'
import { CodeInput } from './CodeInput'
import { CodeOutput } from './CodeOutput'
import { ExampleButton } from './ExampleButton'
import { PasteButton } from './PasteButton'
import { ToolShell } from './ToolShell'

export interface TransformResult {
  output: string
  /** Shown under the input when the options cannot be applied (an invalid pattern, say). */
  error?: string
  /** One line under the result: a count, what changed. Announced politely. */
  summary?: ReactNode
}

interface TextTransformToolProps {
  tool: Tool
  /** Pure function of the typed text; the page closes over its options. Must accept ''. */
  transform: (input: string) => TransformResult
  example: string
  /** Option controls, shown under the input. */
  options?: ReactNode
  /** What the current options do, in one sentence. */
  hint?: ReactNode
  inputLabel?: string
  outputLabel?: string
  placeholder?: string
  outputPlaceholder?: string
  filename?: string
  /** Code-like result (HTML, escapes): monospaced font instead of the reading font. */
  monospaceOutput?: boolean
}

/**
 * Input -> options -> result, for the tools that rewrite a text while the visitor types
 * (reverse, remove accents, sort lines…). The page owns the options and the pure function;
 * this owns everything the tools share, so they stay thin and look the same.
 */
export function TextTransformTool({
  tool,
  transform,
  example,
  options,
  hint,
  inputLabel = 'Texto original',
  outputLabel = 'Resultado',
  placeholder = 'Digite ou cole o texto aqui',
  outputPlaceholder = 'O resultado aparece aqui enquanto você digita.',
  filename = 'devdrop-texto.txt',
  monospaceOutput = false,
}: TextTransformToolProps) {
  const [input, setInput] = useState('')
  const result = transform(input)

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeInput
          id={`${tool.id}-input`}
          label={inputLabel}
          value={input}
          onChange={setInput}
          prose
          placeholder={placeholder}
          error={result.error}
          errorTitle="Opção inválida"
          actions={
            <>
              <ExampleButton onLoadExample={() => setInput(example)} label="Exemplo" />
              <PasteButton onPaste={setInput} />
              <ClearButton onClear={() => setInput('')} disabled={!input} />
            </>
          }
          footer={
            options || hint ? (
              <div className="flex flex-col gap-2">
                {options}
                {hint && <p className="text-[12px] text-slate-500">{hint}</p>}
              </div>
            ) : undefined
          }
        />
        <CodeOutput
          id={`${tool.id}-output`}
          label={outputLabel}
          value={result.output}
          prose={!monospaceOutput}
          placeholder={outputPlaceholder}
          filename={filename}
          footer={
            result.summary ? (
              <p aria-live="polite" className="text-[12px] text-slate-500">
                {result.summary}
              </p>
            ) : undefined
          }
        />
      </div>
    </ToolShell>
  )
}
