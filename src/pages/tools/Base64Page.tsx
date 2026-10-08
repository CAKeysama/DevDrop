import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
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
  BASE64_ENCODED_EXAMPLE,
  BASE64_TEXT_EXAMPLE,
  decodeBase64,
  encodeBase64,
} from '../../lib/codecs/base64'
import { cn } from '../../lib/cn'

type Mode = 'encode' | 'decode'

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  function processConversion(val: string, currentMode: Mode) {
    if (!val.trim()) {
      setOutput('')
      setError(null)
      return
    }

    if (currentMode === 'encode') {
      const res = encodeBase64(val)
      if (res.error) {
        setError(res.error)
        setOutput('')
      } else {
        setError(null)
        setOutput(res.result)
      }
    } else {
      const res = decodeBase64(val)
      if (res.error) {
        setError(res.error)
        setOutput('')
      } else {
        setError(null)
        setOutput(res.result)
      }
    }
  }

  function handleInputChange(val: string) {
    setInput(val)
    processConversion(val, mode)
  }

  function handleModeChange(nextMode: Mode) {
    if (nextMode === mode) return
    setMode(nextMode)
    if (output) {
      setInput(output)
      processConversion(output, nextMode)
    } else {
      processConversion(input, nextMode)
    }
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setError(null)
  }

  function handleLoadExample() {
    const exampleVal = mode === 'encode' ? BASE64_TEXT_EXAMPLE : BASE64_ENCODED_EXAMPLE
    setInput(exampleVal)
    processConversion(exampleVal, mode)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      processConversion(input, mode)
    }
  }

  return (
    <ToolShell
      toolId="base64"
      title="Base64"
      description="Codifica texto em Base64 e decodifica Base64 em texto, com suporte a Unicode."
      categoryId="developer"
      metaDescription="Codifique e decodifique Base64 online com suporte total a Unicode e UTF-8. Rápido, seguro e 100% executado no cliente."
    >
      <div className="flex flex-col gap-6">
        {/* Error message */}
        {error && <ErrorMessage title="Erro na conversão Base64" error={error} />}

        {/* 2-Column Responsive Workspace */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Input Card */}
          <CodeInput
            id="base64-input"
            label={mode === 'encode' ? 'Texto de entrada' : 'Base64 de entrada'}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'encode'
                ? 'Digite ou cole o texto que deseja codificar…'
                : 'Cole o código Base64 para decodificar (ex: SGVsbG8gV29ybGQ=)…'
            }
            error={error}
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

                {/* Mode Selector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-slate-500">Operação</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleModeChange('encode')}
                      className={cn(
                        'cursor-pointer rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all',
                        mode === 'encode'
                          ? 'bg-[#0a152d] text-white shadow-sm'
                          : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                      )}
                    >
                      Texto → Base64 (Codificar)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange('decode')}
                      className={cn(
                        'cursor-pointer rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all',
                        mode === 'decode'
                          ? 'bg-[#0a152d] text-white shadow-sm'
                          : 'border border-slate-200/80 bg-white text-slate-600 hover:text-ink',
                      )}
                    >
                      Base64 → Texto (Decodificar)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange(mode === 'encode' ? 'decode' : 'encode')}
                      className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 hover:text-ink transition-all"
                    >
                      <ArrowRightLeft className="size-3" aria-hidden="true" />
                      <span>Inverter</span>
                    </button>
                  </div>
                </div>
              </div>
            }
          />

          {/* Right Column: Output Card */}
          <CodeOutput
            id="base64-output"
            label="Resultado"
            value={output}
            placeholder={
              mode === 'encode'
                ? 'O Base64 resultante aparecerá aqui…'
                : 'O texto decodificado aparecerá aqui…'
            }
            filename={mode === 'encode' ? 'devdrop-base64.txt' : 'devdrop-texto.txt'}
            mimeType="text/plain"
          />
        </div>
      </div>
    </ToolShell>
  )
}
