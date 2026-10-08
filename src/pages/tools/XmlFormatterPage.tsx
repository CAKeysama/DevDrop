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
  formatXml,
  minifyXml,
  validateXml,
  XML_EXAMPLE,
  type XmlIndent,
} from '../../lib/formatters/xml'
import { surfacePill } from '../../components/ui/styles'
import { cn } from '../../lib/cn'
import type { FormatResult, ValidationResult } from '../../lib/formatters/json'

export default function XmlFormatterPage() {
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
    if (errorInfo) setErrorInfo(null)
    if (validationSuccess) setValidationSuccess(false)
  }

  function handleFormat() {
    setValidationSuccess(false)
    if (!input.trim()) {
      setErrorInfo({ error: 'Insira um código XML para formatar.' })
      setOutput('')
      return
    }

    const res: FormatResult = formatXml(input, indent as XmlIndent)
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
      setErrorInfo({ error: 'Insira um código XML para minificar.' })
      setOutput('')
      return
    }

    const res: FormatResult = minifyXml(input)
    if (res.error) {
      setErrorInfo({ error: res.error, line: res.line, column: res.column })
    } else {
      setErrorInfo(null)
      setOutput(res.result)
    }
  }

  function handleValidate() {
    if (!input.trim()) {
      setErrorInfo({ error: 'Insira um código XML para validar.' })
      setValidationSuccess(false)
      return
    }

    const val: ValidationResult = validateXml(input)
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
    setInput(XML_EXAMPLE)
    setErrorInfo(null)
    setValidationSuccess(false)
    const formatted = formatXml(XML_EXAMPLE, indent as XmlIndent)
    if (formatted.result) {
      setOutput(formatted.result)
    }
  }

  return (
    <ToolShell
      title="Formatador XML"
      description="Formate, indente, minifique e valide documentos XML com validação de sintaxe e tags."
      categoryId="developer"
      metaDescription="Formatador XML online: formate tags e atributos, minifique e valide a sintaxe XML com indicação detalhada de erros de fechamento ou atributos."
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
            title="XML Inválido"
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
            <span>XML válido! Todas as tags, namespaces e atributos estão bem estruturados.</span>
          </div>
        )}

        {/* Workspace: 2-column input/output */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CodeInput
            id="xml-input"
            label="XML de Entrada"
            value={input}
            onChange={handleInputChange}
            placeholder="Cole seu XML aqui (ex: <root><item>valor</item></root>)…"
            error={errorInfo?.error}
          />

          <CodeOutput
            id="xml-output"
            label="XML Formatado / Minificado"
            value={output}
            placeholder="O resultado formatado ou minificado será exibido aqui…"
          />
        </div>
      </div>
    </ToolShell>
  )
}
