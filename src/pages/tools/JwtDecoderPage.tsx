import { useState } from 'react'
import { AlertTriangle, Clock, Key, ShieldAlert } from 'lucide-react'
import {
  ClearButton,
  CodeInput,
  CodeOutput,
  ErrorMessage,
  ExampleButton,
  ToolShell,
} from '../../components/tools/shared'
import {
  decodeJwt,
  JWT_EXAMPLE,
  JWT_EXPIRED_EXAMPLE,
  JWT_NOTICE,
  type DecodedJwt,
} from '../../lib/codecs/jwt'
import { surfacePill } from '../../components/ui/styles'
import { cn } from '../../lib/cn'

export default function JwtDecoderPage() {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null)
  const [error, setError] = useState<string | null>(null)

  function processToken(val: string) {
    if (!val.trim()) {
      setDecoded(null)
      setError(null)
      return
    }

    const res = decodeJwt(val)
    if (res.error) {
      setError(res.error)
      setDecoded(null)
    } else if (res.data) {
      setError(null)
      setDecoded(res.data)
    }
  }

  function handleInputChange(val: string) {
    setToken(val)
    processToken(val)
  }

  function handleClear() {
    setToken('')
    setDecoded(null)
    setError(null)
  }

  function handleLoadExample(expired = false) {
    const example = expired ? JWT_EXPIRED_EXAMPLE : JWT_EXAMPLE
    setToken(example)
    processToken(example)
  }

  return (
    <ToolShell
      title="Decodificador JWT"
      description="Decodifique e inspecione headers, payloads e claims de JSON Web Tokens (JWT) localmente no navegador."
      categoryId="developer"
      metaDescription="Decodificador JWT online: visualize Header, Payload, claims de expiração e dados de tokens JWT de forma 100% segura e no cliente."
      notice={
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="leading-relaxed text-amber-900">{JWT_NOTICE}</p>
        </div>
      }
      actions={
        <>
          <ExampleButton onLoadExample={() => handleLoadExample(false)} label="Exemplo válido" />
          <button
            type="button"
            onClick={() => handleLoadExample(true)}
            className={cn(
              surfacePill,
              'cursor-pointer px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:text-ink',
            )}
          >
            Exemplo expirado
          </button>
          <ClearButton onClear={handleClear} disabled={!token} />
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Input Area */}
        <CodeInput
          id="jwt-token-input"
          label="Token JWT Codificado"
          value={token}
          onChange={handleInputChange}
          placeholder="Cole seu token JWT aqui (ex: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIi...)"
          error={error}
          className="w-full"
        />

        {/* Error message */}
        {error && <ErrorMessage title="Erro ao Decodificar JWT" error={error} />}

        {/* Inspection Data Area */}
        {decoded && (
          <div className="space-y-6 border-t border-slate-100 pt-6">
            {/* Claims Overview / Summary Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Algoritmo
                </span>
                <p className="mt-1 font-mono text-[16px] font-semibold text-ink">
                  {decoded.algorithm}
                </p>
                <span className="text-[11px] text-muted">Tipo: {decoded.type}</span>
              </div>

              <div
                className={cn(
                  'rounded-2xl border p-4 transition-all',
                  decoded.isExpired === true
                    ? 'border-rose-200 bg-rose-50/60 text-rose-950'
                    : decoded.isExpired === false
                      ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950'
                      : 'border-slate-200/70 bg-slate-50/60 text-ink',
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden="true" />
                  <span className="text-[11px] font-semibold tracking-wider uppercase">
                    Status de Expiração
                  </span>
                </div>
                <p className="mt-1 text-[13px] font-semibold leading-tight">
                  {decoded.isExpired === true
                    ? 'Token Expirado'
                    : decoded.isExpired === false
                      ? 'Dentro da validade'
                      : 'Sem expiração'}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed opacity-85">
                  {decoded.expirationSummary}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Sujeito (sub)
                </span>
                <p className="mt-1 font-mono text-[14px] font-semibold text-ink truncate">
                  {decoded.payload.sub ? String(decoded.payload.sub) : 'Não informado'}
                </p>
                <span className="text-[11px] text-muted">
                  Emissor (iss): {decoded.payload.iss ? String(decoded.payload.iss) : '—'}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Assinatura
                </span>
                <div className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-slate-700">
                  <Key className="size-3.5" aria-hidden="true" />
                  <span>Não validada</span>
                </div>
                <span className="text-[11px] text-amber-700">Validação criptográfica ausente</span>
              </div>
            </div>

            {/* Header and Payload Split */}
            <div className="grid gap-6 lg:grid-cols-2">
              <CodeOutput
                id="jwt-header-output"
                label="Header (Cabeçalho Decodificado)"
                value={decoded.formattedHeader}
              />

              <CodeOutput
                id="jwt-payload-output"
                label="Payload (Claims e Dados Decodificados)"
                value={decoded.formattedPayload}
              />
            </div>

            {/* Signature Block */}
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-ink">Assinatura (Signature)</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                    <AlertTriangle className="size-3" aria-hidden="true" />
                    Não verificada
                  </span>
                </div>
              </div>
              <p className="mt-2 font-mono text-[12px] text-slate-600 break-all">
                {decoded.signature || '(Sem assinatura)'}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  )
}
