import { useState } from 'react'
import { AlertTriangle, Clock } from 'lucide-react'
import {
  ClearButton,
  CopyButton,
  ErrorMessage,
  ExampleButton,
  PasteButton,
  ToolShell,
} from '../../components/tools/shared'
import {
  decodeJwt,
  JWT_EXAMPLE,
  type DecodedJwt,
} from '../../lib/codecs/jwt'

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

  function handleLoadExample() {
    setToken(JWT_EXAMPLE)
    processToken(JWT_EXAMPLE)
  }

  return (
    <ToolShell
      toolId="jwt-decoder"
      title="Decodificador JWT"
      description="Mostra o header, o payload e as datas de um JWT, sem verificar a assinatura."
      categoryId="developer"
      metaDescription="Decodificador JWT online: visualize Header, Payload, claims de expiração e dados de tokens JWT de forma 100% segura e no cliente."
    >
      <div className="flex flex-col gap-6">
        {/* Token Input Card */}
        <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-2 pb-3">
            <label htmlFor="jwt-input" className="text-[14px] font-semibold tracking-tight text-ink">
              Token JWT
            </label>
            <div className="flex items-center gap-1.5">
              <ExampleButton onLoadExample={handleLoadExample} label="Exemplo" />
              <PasteButton onPaste={(text) => handleInputChange(text)} />
              <ClearButton onClear={handleClear} disabled={!token} />
            </div>
          </div>

          <div className="relative">
            <textarea
              id="jwt-input"
              value={token}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Cole seu token JWT aqui (ex: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIi...)…"
              spellCheck={false}
              autoComplete="off"
              className="w-full resize-y rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 font-mono text-[13px] leading-relaxed text-ink min-h-[140px] focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 break-all"
            />
          </div>

          <p className="mt-2.5 text-[11px] text-slate-400">
            O exemplo usa dados fictícios. Evite colar tokens de produção em qualquer site; aqui eles não saem do navegador.
          </p>
        </div>

        {/* Error message */}
        {error && <ErrorMessage title="Erro ao Decodificar JWT" error={error} />}

        {/* Yellow Security Warning */}
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 text-[13px] text-amber-950">
          <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">A assinatura não foi verificada.</p>
            <p className="text-[12px] leading-relaxed text-amber-900/90">
              Esta ferramenta apenas decodifica o token. Qualquer pessoa pode montar um JWT com este conteúdo: não confie nele sem validar a assinatura no seu servidor, com a chave correta.
            </p>
          </div>
        </div>

        {/* Inspection Details */}
        {decoded && (
          <div className="space-y-6">
            {/* Resumo Card */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card">
              <h2 className="text-[14px] font-semibold text-ink mb-4">Resumo</h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pb-4 border-b border-slate-100">
                {/* Alg */}
                <div>
                  <span className="text-[11px] text-slate-400">Algoritmo declarado (alg)</span>
                  <p className="mt-0.5 font-mono text-[14px] font-semibold text-ink">{decoded.algorithm}</p>
                </div>

                {/* Typ */}
                <div>
                  <span className="text-[11px] text-slate-400">Tipo do token (typ)</span>
                  <p className="mt-0.5 font-mono text-[14px] font-semibold text-ink">{decoded.type}</p>
                </div>

                {/* iat */}
                <div>
                  <span className="text-[11px] text-slate-400">Emitido em (iat)</span>
                  <p className="mt-0.5 text-[13px] font-medium text-ink">
                    {decoded.issuedAt ? decoded.issuedAt.toLocaleString('pt-BR') : 'Não informado'}
                  </p>
                  {decoded.payload.iat && (
                    <span className="font-mono text-[11px] text-slate-400">{String(decoded.payload.iat)}</span>
                  )}
                </div>

                {/* exp */}
                <div>
                  <span className="text-[11px] text-slate-400">Expira em (exp)</span>
                  <p className="mt-0.5 text-[13px] font-medium text-ink">
                    {decoded.expiresAt ? decoded.expiresAt.toLocaleString('pt-BR') : 'Sem data de expiração'}
                  </p>
                  {decoded.payload.exp && (
                    <span className="font-mono text-[11px] text-slate-400">{String(decoded.payload.exp)}</span>
                  )}
                </div>
              </div>

              {/* Expiry summary line */}
              <div className="mt-3.5 flex items-center gap-2 text-[12px] text-slate-600">
                <Clock className="size-3.5 text-slate-400" aria-hidden="true" />
                <span>
                  {decoded.isExpired === true
                    ? 'O token está expirado.'
                    : decoded.isExpired === false
                      ? 'Pelas datas declaradas, o token está dentro do prazo. Isso não diz se ele é autêntico.'
                      : 'O token não possui claim de expiração.'}
                </span>
              </div>
            </div>

            {/* Header & Payload Cards */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Header */}
              <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card">
                <div className="flex items-center justify-between gap-2 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-rose-800 uppercase">
                      HEADER
                    </span>
                    <h3 className="text-[14px] font-semibold text-ink">Header</h3>
                  </div>
                  <CopyButton text={decoded.formattedHeader} />
                </div>
                <pre className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 font-mono text-[13px] leading-relaxed text-ink">
                  <code>{decoded.formattedHeader}</code>
                </pre>
              </div>

              {/* Payload */}
              <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card">
                <div className="flex items-center justify-between gap-2 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-purple-800 uppercase">
                      PAYLOAD
                    </span>
                    <h3 className="text-[14px] font-semibold text-ink">Payload</h3>
                  </div>
                  <CopyButton text={decoded.formattedPayload} />
                </div>
                <pre className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 font-mono text-[13px] leading-relaxed text-ink">
                  <code>{decoded.formattedPayload}</code>
                </pre>
              </div>
            </div>

            {/* Signature Block */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-2 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-sky-800 uppercase">
                    SIGNATURE
                  </span>
                  <h3 className="text-[14px] font-semibold text-ink">Assinatura (não verificada)</h3>
                </div>
                <CopyButton text={decoded.signature} disabled={!decoded.signature} />
              </div>
              <p className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 font-mono text-[12px] text-slate-600 break-all">
                {decoded.signature || 'assinatura-vazia'}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  )
}
