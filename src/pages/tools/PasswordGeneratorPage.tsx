import { useState } from 'react'
import { RefreshCw, RotateCcw } from 'lucide-react'
import {
  ActionButton,
  Checkbox,
  CopyButton,
  ErrorMessage,
  RangeField,
  StrengthMeter,
  ToolPanel,
  ToolShell,
} from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  defaultPasswordOptions,
  generatePassword,
  passwordEntropyBits,
  type PasswordOptions,
} from '../../lib/security/password'
import { analyzePassword } from '../../lib/security/passwordStrength'

const tool = getTool('password-generator')

const groups: Array<{ key: 'uppercase' | 'lowercase' | 'numbers' | 'symbols'; label: string; sample: string }> = [
  { key: 'uppercase', label: 'Letras maiúsculas', sample: 'A–Z' },
  { key: 'lowercase', label: 'Letras minúsculas', sample: 'a–z' },
  { key: 'numbers', label: 'Números', sample: '0–9' },
  { key: 'symbols', label: 'Símbolos', sample: '! @ # $ % & *' },
]

export default function PasswordGeneratorPage() {
  const [options, setOptions] = useState<PasswordOptions>(defaultPasswordOptions)
  const [generated, setGenerated] = useState(() => generatePassword(defaultPasswordOptions))

  // Any change to the options produces a new password right away.
  function update(next: PasswordOptions) {
    setOptions(next)
    setGenerated(generatePassword(next))
  }

  const password = generated.result ?? ''
  const strength = analyzePassword(password)
  const entropy = Math.round(passwordEntropyBits(options))

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <ToolPanel
          title="Senha gerada"
          actions={
            <>
              <CopyButton text={password} disabled={!password} />
              <ActionButton variant="primary" onClick={() => setGenerated(generatePassword(options))}>
                <RefreshCw aria-hidden="true" />
                Gerar outra
              </ActionButton>
            </>
          }
        >
          {generated.error ? (
            <ErrorMessage title={generated.error} error={generated.hint ?? 'Ajuste as opções.'} />
          ) : (
            <>
              <div
                role="group"
                aria-label="Senha gerada"
                className="select-all break-all rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 font-mono text-[20px] leading-snug tracking-wide text-ink sm:text-[24px]"
              >
                {password}
              </div>
              <StrengthMeter score={strength.score} className="mt-5" />
              <p className="mt-1 text-[12px] text-slate-500">
                Aproximadamente {entropy} bits de entropia: cada caractere é sorteado entre as opções marcadas.
              </p>
            </>
          )}
          <p className="mt-5 text-[12px] text-slate-500">
            A senha é sorteada com o gerador criptográfico do navegador (Web Crypto) e existe só nesta página: ela não é
            enviada nem salva. Guarde-a em um gerenciador de senhas.
          </p>
        </ToolPanel>

        <ToolPanel
          title="Opções"
          actions={
            <ActionButton onClick={() => update(defaultPasswordOptions)}>
              <RotateCcw aria-hidden="true" />
              Restaurar
            </ActionButton>
          }
        >
          <RangeField
            label="Comprimento"
            value={options.length}
            min={PASSWORD_MIN_LENGTH}
            max={PASSWORD_MAX_LENGTH}
            onChange={(length) => update({ ...options, length: Math.round(length) })}
          />
          <fieldset className="mt-4">
            <legend className="text-[12px] font-medium text-slate-500">Caracteres</legend>
            <div className="mt-1 grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {groups.map((group) => (
                <Checkbox
                  key={group.key}
                  label={group.label}
                  hint={group.sample}
                  checked={options[group.key]}
                  onChange={(checked) => update({ ...options, [group.key]: checked })}
                />
              ))}
            </div>
          </fieldset>
          <Checkbox
            className="mt-2 border-t border-slate-100 pt-3"
            label="Excluir caracteres parecidos"
            hint="Remove I, l, 1, O, 0, o e |, que se confundem ao ler ou digitar."
            checked={options.excludeAmbiguous}
            onChange={(excludeAmbiguous) => update({ ...options, excludeAmbiguous })}
          />
        </ToolPanel>
      </div>
    </ToolShell>
  )
}
