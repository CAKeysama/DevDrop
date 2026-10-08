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
  decodeUrl,
  encodeUrl,
  URL_ENCODED_EXAMPLE,
  URL_RAW_EXAMPLE,
  type UrlEncodeType,
} from '../../lib/codecs/url'
import { cn } from '../../lib/cn'

type Mode = 'encode' | 'decode'

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<Mode>('encode')
  const [encodeType, setEncodeType] = useState<UrlEncodeType>('component')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  function processConversion(val: string, currentMode: Mode, currentType: UrlEncodeType) {
    if (!val.trim()) {
      setOutput('')
      setError(null)
      return
    }

    if (currentMode === 'encode') {
      const res = encodeUrl(val, currentType)
      if (res.error) {
        setError(res.error)
        setOutput('')
      } else {
        setError(null)
        setOutput(res.result)
      }
    } else {
      const res = decodeUrl(val)
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
    processConversion(val, mode, encodeType)
  }

  function handleModeChange(nextMode: Mode) {
    if (nextMode === mode) return
    setMode(nextMode)
    if (output) {
      setInput(output)
      processConversion(output, nextMode, encodeType)
    } else {
      processConversion(input, nextMode, encodeType)
    }
  }

  function handleEncodeTypeChange(nextType: UrlEncodeType) {
    setEncodeType(nextType)
    if (mode === 'encode') {
      processConversion(input, 'encode', nextType)
    }
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setError(null)
  }

  function handleLoadExample() {
    const exampleVal = mode === 'encode' ? URL_RAW_EXAMPLE : URL_ENCODED_EXAMPLE
    setInput(exampleVal)
    processConversion(exampleVal, mode, encodeType)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      processConversion(input, mode, encodeType)
    }
  }

  return (
    <ToolShell
      toolId="url-encoder"
      title="URL Encode/Decode"
      description="Codifica e decodifica textos para uso em URLs (percent-encoding)."
      categoryId="developer"
      metaDescription="Codifique e decodifique parâmetros de URLs online. Suporte a encodeURIComponent e encodeURI com tratamento completo de erros."
    >
      <div className="flex flex-col gap-6">
        {/* Error message */}
        {error && <ErrorMessage title="Erro na conversão de URL" error={error} />}

        {/* 2-Column Responsive Workspace */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Input Card */}
          <CodeInput
            id="url-input"
            label={mode === 'encode' ? 'Texto ou URL de entrada' : 'URL codificada de entrada'}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'encode'
                ? 'Cole ou digite a URL/texto para codificar…'
                : 'Cole a URL percent-encoded para decodificar (ex: https%3A%2F%2Fexemplo.com)…'
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

                {/* Mode Selector and Type */}
                <div className="flex flex-wrap items-center gap-4">
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
                        Codificar (Encode)
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
                        Decodificar (Decode)
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

                  {mode === 'encode' && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="url-encode-type" className="text-[12px] font-medium text-slate-500">
                        Tipo de codificação
                      </label>
                      <select
                        id="url-encode-type"
                        value={encodeType}
                        onChange={(e) => handleEncodeTypeChange(e.target.value as UrlEncodeType)}
                        className="cursor-pointer rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-sm"
                      >
                        <option value="component">Componente (Parâmetros / Query strings)</option>
                        <option value="full">URL Completa (preserva :// e caminhos)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            }
          />

          {/* Right Column: Output Card */}
          <CodeOutput
            id="url-output"
            label="Resultado"
            value={output}
            placeholder={
              mode === 'encode'
                ? 'O resultado codificado aparecerá aqui…'
                : 'O texto decodificado aparecerá aqui…'
            }
            filename="devdrop-url.txt"
            mimeType="text/plain"
          />
        </div>
      </div>
    </ToolShell>
  )
}
