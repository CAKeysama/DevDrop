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
  BASE64_ENCODED_EXAMPLE,
  BASE64_TEXT_EXAMPLE,
  decodeBase64,
  encodeBase64,
} from '../../lib/codecs/base64'
import { surfacePill } from '../../components/ui/styles'
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
    // Invert input and output if there is already output
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

  return (
    <ToolShell
      title="Codificador e Decodificador Base64"
      description="Converta textos para Base64 e vice-versa diretamente no navegador com suporte completo a caracteres UTF-8 e emojis."
      categoryId="developer"
      metaDescription="Codifique e decodifique Base64 online com suporte total a Unicode e UTF-8. Rápido, seguro e 100% executado no cliente."
      actions={
        <>
          <ExampleButton onLoadExample={handleLoadExample} />
          <ClearButton onClear={handleClear} disabled={!input && !output} />
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Mode Selector Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
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
                Texto → Base64 (Codificar)
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
                Base64 → Texto (Decodificar)
              </button>
            </div>
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
        {error && <ErrorMessage title="Erro na conversão Base64" error={error} />}

        {/* Workspace: 2 columns */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CodeInput
            id="base64-input"
            label={mode === 'encode' ? 'Texto Original (UTF-8)' : 'Código Base64'}
            value={input}
            onChange={handleInputChange}
            placeholder={
              mode === 'encode'
                ? 'Digite ou cole o texto que deseja codificar…'
                : 'Cole o código Base64 para decodificar (ex: SGVsbG8gV29ybGQ=)…'
            }
            error={error}
          />

          <CodeOutput
            id="base64-output"
            label={mode === 'encode' ? 'Resultado em Base64' : 'Texto Decodificado'}
            value={output}
            placeholder={
              mode === 'encode'
                ? 'O Base64 resultante aparecerá aqui…'
                : 'O texto decodificado aparecerá aqui…'
            }
          />
        </div>
      </div>
    </ToolShell>
  )
}
