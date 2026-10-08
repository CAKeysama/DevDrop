import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import {
  ClearButton,
  CodeInput,
  CodeOutput,
  ErrorMessage,
  ExampleButton,
  ToolShell,
} from '../../components/tools/shared'
import {
  decodeUrl,
  encodeUrl,
  URL_ENCODED_EXAMPLE,
  URL_RAW_EXAMPLE,
  type UrlEncodeType,
} from '../../lib/codecs/url'
import { surfacePill } from '../../components/ui/styles'
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

  return (
    <ToolShell
      title="URL Encode / Decode"
      description="Codifique ou decodifique URLs, parâmetros de consulta (query strings) e caracteres especiais com segurança."
      categoryId="developer"
      metaDescription="Codifique e decodifique parâmetros de URLs online. Suporte a encodeURIComponent e encodeURI com tratamento completo de erros."
      actions={
        <>
          <ExampleButton onLoadExample={handleLoadExample} />
          <ClearButton onClear={handleClear} disabled={!input && !output} />
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-500">Operação:</span>
              <div className="inline-flex rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => handleModeChange('encode')}
                  className={cn(
                    'cursor-pointer rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all',
                    mode === 'encode'
                      ? 'bg-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-ink',
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
                      ? 'bg-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-ink',
                  )}
                >
                  Decodificar (Decode)
                </button>
              </div>
            </div>

            {mode === 'encode' && (
              <div className="inline-flex items-center gap-1.5 text-[12px]">
                <label htmlFor="url-encode-type" className="font-medium text-slate-500 whitespace-nowrap">
                  Tipo:
                </label>
                <select
                  id="url-encode-type"
                  value={encodeType}
                  onChange={(e) => handleEncodeTypeChange(e.target.value as UrlEncodeType)}
                  className={cn(
                    surfacePill,
                    'cursor-pointer px-3 py-1 text-[12px] font-medium text-ink focus:outline-none focus:ring-1 focus:ring-slate-400',
                  )}
                >
                  <option value="component">Componente (Parâmetros / Query strings)</option>
                  <option value="full">URL Completa (preserva :// e rotas)</option>
                </select>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleModeChange(mode === 'encode' ? 'decode' : 'encode')}
            className={cn(
              surfacePill,
              'inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:text-ink',
            )}
          >
            <ArrowRightLeft className="size-3.5" aria-hidden="true" />
            <span>Inverter modo</span>
          </button>
        </div>

        {/* Error message */}
        {error && <ErrorMessage title="Erro na conversão de URL" error={error} />}

        {/* Workspace: 2 columns */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CodeInput
            id="url-input"
            label={mode === 'encode' ? 'Texto ou URL Original' : 'URL Codificada'}
            value={input}
            onChange={handleInputChange}
            placeholder={
              mode === 'encode'
                ? 'Cole ou digite a URL/texto para codificar…'
                : 'Cole a URL percent-encoded para decodificar (ex: https%3A%2F%2Fexemplo.com)…'
            }
            error={error}
          />

          <CodeOutput
            id="url-output"
            label={mode === 'encode' ? 'URL Codificada' : 'Texto ou URL Decodificada'}
            value={output}
            placeholder={
              mode === 'encode'
                ? 'O resultado codificado aparecerá aqui…'
                : 'O texto decodificado aparecerá aqui…'
            }
          />
        </div>
      </div>
    </ToolShell>
  )
}
