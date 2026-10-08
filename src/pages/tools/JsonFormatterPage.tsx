import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import {
  ClearButton,
  CodeInput,
  CodeOutput,
  ErrorMessage,
  ExampleButton,
  PasteButton,
  ToolShell,
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
import { cn } from '../../lib/cn'

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState<JsonIndent>(2)
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
      setErrorInfo({ error: 'Insira um código JSON para formatar.' })
      setOutput('')
      return
    }

    const res: FormatResult = formatJson(input, indent)
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
    const formatted = formatJson(JSON_EXAMPLE, indent)
    if (formatted.result) {
      setOutput(formatted.result)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleFormat()
    }
  }

  return (
    <ToolShell
      toolId="json-formatter"
      title="Formatador JSON"
      description="Formata, minifica e valida JSON, apontando a linha do erro."
      categoryId="developer"
      metaDescription="Formatador JSON online: embeleze, valide a sintaxe e minifique arquivos e payloads JSON com suporte a 2 espaços, 4 espaços ou tabulação."
    >
      <div className="flex flex-col gap-6">
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

        {/* 2-Column Responsive Workspace */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Input Card */}
          <CodeInput
            id="json-input"
            label="JSON de entrada"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='{"produto": "DevDrop", "versao": 1, "publico": ["desenvolvedores"]}…'
            error={errorInfo?.error}
            actions={
              <>
                <ExampleButton onLoadExample={handleLoadExample} label="Exemplo" />
                <PasteButton onPaste={(text) => handleInputChange(text)} />
                <ClearButton onClear={handleClear} disabled={!input && !output} />
              </>
            }
            footer={
              <div className="flex flex-col gap-4">
                <p className="text-[12px] text-slate-400">
                  Atalho: <kbd className="font-sans font-medium text-slate-600">Ctrl + Enter</kbd> (
                  <kbd className="font-sans font-medium text-slate-600">⌘ + Enter</kbd> no Mac) executa a ação principal.
                </p>

                {/* Indentation Selector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-slate-500">Indentação</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIndent(2)}
                      className={cn(
                        'cursor-pointer rounded-full px-3.5 py-1 text-[12px] font-semibold transition-all',
                        indent === 2
                          ? 'bg-[#0a152d] text-white shadow-sm'
                          : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                      )}
                    >
                      2 espaços
                    </button>
                    <button
                      type="button"
                      onClick={() => setIndent(4)}
                      className={cn(
                        'cursor-pointer rounded-full px-3.5 py-1 text-[12px] font-semibold transition-all',
                        indent === 4
                          ? 'bg-[#0a152d] text-white shadow-sm'
                          : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                      )}
                    >
                      4 espaços
                    </button>
                    <button
                      type="button"
                      onClick={() => setIndent('\t')}
                      className={cn(
                        'cursor-pointer rounded-full px-3.5 py-1 text-[12px] font-semibold transition-all',
                        indent === '\t'
                          ? 'bg-[#0a152d] text-white shadow-sm'
                          : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                      )}
                    >
                      Tab
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleFormat}
                    className="cursor-pointer rounded-full bg-[#0a152d] px-5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98]"
                  >
                    Formatar
                  </button>
                  <button
                    type="button"
                    onClick={handleMinify}
                    className="cursor-pointer rounded-full border border-slate-200/80 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300 hover:text-ink transition-all active:scale-[0.98]"
                  >
                    Minificar
                  </button>
                  <button
                    type="button"
                    onClick={handleValidate}
                    className="cursor-pointer rounded-full border border-slate-200/80 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300 hover:text-ink transition-all active:scale-[0.98]"
                  >
                    Validar
                  </button>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-400">
                  Só os espaços mudam: números grandes, textos e a ordem das chaves são mantidos exatamente como você colou.
                </p>
              </div>
            }
          />

          {/* Right Column: Output Card */}
          <CodeOutput
            id="json-output"
            label="Resultado"
            value={output}
            placeholder="O resultado formatado aparecerá aqui…"
            filename="devdrop-formatado.json"
            mimeType="application/json"
          />
        </div>
      </div>
    </ToolShell>
  )
}
