import { useState } from 'react'
import { CheckCircle2, Code2, Minimize2 } from 'lucide-react'
import {
  ClearButton,
  CodeInput,
  CodeOutput,
  ErrorMessage,
  ExampleButton,
  IndentSelect,
  ToolShell,
  type IndentOption,
} from '../../components/tools/shared'
import {
  formatJson,
  JSON_EXAMPLE,
  minifyJson,
  validateJson,
  type FormatResult,
  type JsonIndent,
  type ValidationResult,
} from '../../lib/formatters/json'
import { surfacePill } from '../../components/ui/styles'
import { cn } from '../../lib/cn'

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState<IndentOption>(2)
  const [errorInfo, setErrorInfo] = useState<{
    error?: string
    line?: number
    column?: number
  } | null>(null)
  const [validationSuccess, setValidationSuccess] = useState(false)

  function handleInputChange(value: string) {
    setInput(value)
    // Clear alerts on edit
    if (errorInfo) setErrorInfo(null)
    if (validationSuccess) setValidationSuccess(false)
  }

  function handleFormat() {
    setValidationSuccess(false)
    if (!input.trim()) {
      setErrorInfo({ error: 'Insira um código JSON para formatar.' })
      setOutput('')
      return
    }

    const res: FormatResult = formatJson(input, indent as JsonIndent)
    if (res.error) {
      setErrorInfo({ error: res.error, line: res.line, column: res.column })
    } else {
      setErrorInfo(null)
      setOutput(res.result)
    }
  }

  function handleMinify() {
    setValidationSuccess(false)
    if (!input.trim()) {
      setErrorInfo({ error: 'Insira um código JSON para minificar.' })
      setOutput('')
      return
    }

    const res: FormatResult = minifyJson(input)
    if (res.error) {
      setErrorInfo({ error: res.error, line: res.line, column: res.column })
    } else {
      setErrorInfo(null)
      setOutput(res.result)
    }
  }

  function handleValidate() {
    if (!input.trim()) {
      setErrorInfo({ error: 'Insira um código JSON para validar.' })
      setValidationSuccess(false)
      return
    }

    const val: ValidationResult = validateJson(input)
    if (val.isValid) {
      setErrorInfo(null)
      setValidationSuccess(true)
    } else {
      setValidationSuccess(false)
      setErrorInfo({ error: val.error, line: val.line, column: val.column })
    }
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setErrorInfo(null)
    setValidationSuccess(false)
  }

  function handleLoadExample() {
    setInput(JSON_EXAMPLE)
    setErrorInfo(null)
    setValidationSuccess(false)
    const formatted = formatJson(JSON_EXAMPLE, indent as JsonIndent)
    if (formatted.result) {
      setOutput(formatted.result)
    }
  }

  return (
    <ToolShell
      title="Formatador JSON"
      description="Formate, minifique e valide objetos e estruturas JSON com controle de indentação."
      categoryId="developer"
      metaDescription="Formatador JSON online: embeleze, valide a sintaxe e minifique arquivos e payloads JSON com suporte a 2 espaços, 4 espaços ou tabulação."
      actions={
        <>
          <ExampleButton onLoadExample={handleLoadExample} />
          <ClearButton onClear={handleClear} disabled={!input && !output} />
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFormat}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-navy px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Code2 className="size-4" aria-hidden="true" />
              <span>Formatar</span>
            </button>

            <button
              type="button"
              onClick={handleMinify}
              className={cn(
                surfacePill,
                'inline-flex cursor-pointer items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-ink',
              )}
            >
              <Minimize2 className="size-3.5" aria-hidden="true" />
              <span>Minificar</span>
            </button>

            <button
              type="button"
              onClick={handleValidate}
              className={cn(
                surfacePill,
                'inline-flex cursor-pointer items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-ink',
              )}
            >
              <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden="true" />
              <span>Validar</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <IndentSelect value={indent} onChange={setIndent} />
          </div>
        </div>

        {/* Validation or Error Banners */}
        {errorInfo?.error && (
          <ErrorMessage
            title="JSON Inválido"
            error={errorInfo.error}
            line={errorInfo.line}
            column={errorInfo.column}
          />
        )}

        {validationSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2.5 rounded-2xl border border-emerald-200/90 bg-emerald-50/70 p-4 text-[13px] font-medium text-emerald-900"
          >
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>JSON válido! A sintaxe está perfeitamente correta.</span>
          </div>
        )}

        {/* Workspace: 2-column input/output */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CodeInput
            id="json-input"
            label="JSON de Entrada"
            value={input}
            onChange={handleInputChange}
            placeholder="Cole seu JSON aqui (ex: {'chave': 'valor'})…"
            error={errorInfo?.error}
          />

          <CodeOutput
            id="json-output"
            label="JSON Formatado / Minificado"
            value={output}
            placeholder="O resultado formatado ou minificado será exibido aqui…"
          />
        </div>
      </div>
    </ToolShell>
  )
}
