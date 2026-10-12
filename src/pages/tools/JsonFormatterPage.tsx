import { useMemo, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import {
  ClearButton,
  CodeInput,
  CodeOutput,
  ExampleButton,
  PasteButton,
  ToggleGroup,
  ToolShell,
} from '../../components/tools/shared'
import { formatJson, JSON_EXAMPLE, minifyJson, type JsonIndent } from '../../lib/formatters/json'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'

type Action = 'format' | 'minify'

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState<JsonIndent>(2)
  const [action, setAction] = useState<Action>('format')
  const [source, flush] = useDebouncedValue(input)

  // The output is derived from the input, so it can never show the result of an older input.
  const result = useMemo(() => {
    if (!source.trim()) return null
    return action === 'format' ? formatJson(source, indent) : minifyJson(source)
  }, [source, indent, action])

  const isPending = source !== input
  const output = result && !result.error ? result.result : ''
  const error = result?.error

  function handleInsert(value: string) {
    setInput(value)
    flush(value)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      flush()
    }
  }

  return (
    <ToolShell
      toolId="json-formatter"
      title="Formatador JSON"
      description="Formata, minifica e valida JSON enquanto você digita, apontando a linha do erro."
      categoryId="developer"
      metaDescription="Formatador JSON online: embeleze, valide a sintaxe e minifique arquivos e payloads JSON com suporte a 2 espaços, 4 espaços ou tabulação."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeInput
          id="json-input"
          label="JSON de entrada"
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          placeholder='{"produto": "DevDrop", "versao": 1, "publico": ["desenvolvedores"]}…'
          error={isPending ? null : error}
          errorTitle="JSON inválido"
          errorLine={result?.line}
          errorColumn={result?.column}
          actions={
            <>
              <ExampleButton onLoadExample={() => handleInsert(JSON_EXAMPLE)} label="Exemplo" />
              <PasteButton onPaste={handleInsert} />
              <ClearButton onClear={() => handleInsert('')} disabled={!input} />
            </>
          }
          footer={
            <div className="flex flex-col gap-4">
              <p className="text-[12px] text-subtle">
                O resultado é atualizado enquanto você digita.
              </p>

              <div className="flex flex-wrap items-start gap-4">
                <ToggleGroup
                  label="Ação"
                  value={action}
                  onChange={setAction}
                  options={[
                    { value: 'format', label: 'Formatar' },
                    { value: 'minify', label: 'Minificar' },
                  ]}
                />
                <ToggleGroup
                  label="Indentação"
                  value={indent}
                  onChange={setIndent}
                  disabled={action === 'minify'}
                  options={[
                    { value: 2, label: '2 espaços' },
                    { value: 4, label: '4 espaços' },
                    { value: '\t', label: 'Tab' },
                  ]}
                />
              </div>

              <p className="text-[12px] leading-relaxed text-subtle">
                Só os espaços mudam: números grandes, textos e a ordem das chaves são mantidos exatamente como você colou.
              </p>
            </div>
          }
        />

        <CodeOutput
          id="json-output"
          label="Resultado"
          value={output}
          placeholder="O resultado formatado aparecerá aqui…"
          filename={action === 'minify' ? 'devdrop-minificado.json' : 'devdrop-formatado.json'}
          mimeType="application/json"
          footer={
            output && !isPending ? (
              <p role="status" className="flex items-center gap-2 text-[12px] font-medium text-emerald-800">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                JSON válido
              </p>
            ) : undefined
          }
        />
      </div>
    </ToolShell>
  )
}
