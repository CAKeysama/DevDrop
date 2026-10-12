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
import { formatXml, minifyXml, XML_EXAMPLE, type XmlIndent } from '../../lib/formatters/xml'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'

type Action = 'format' | 'minify'

export default function XmlFormatterPage() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState<XmlIndent>(2)
  const [action, setAction] = useState<Action>('format')
  const [source, flush] = useDebouncedValue(input)

  // The output is derived from the input, so it can never show the result of an older input.
  const result = useMemo(() => {
    if (!source.trim()) return null
    return action === 'format' ? formatXml(source, indent) : minifyXml(source)
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
      toolId="xml-formatter"
      title="Formatador XML"
      description="Formata, minifica e valida a estrutura de um XML enquanto você digita."
      categoryId="developer"
      metaDescription="Formatador XML online: formate tags e atributos, minifique e valide a sintaxe XML com indicação detalhada de erros."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeInput
          id="xml-input"
          label="XML de entrada"
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          placeholder="<root><item id='1'>valor</item></root>…"
          error={isPending ? null : error}
          errorTitle="XML inválido"
          errorLine={result?.line}
          errorColumn={result?.column}
          actions={
            <>
              <ExampleButton onLoadExample={() => handleInsert(XML_EXAMPLE)} label="Exemplo" />
              <PasteButton onPaste={handleInsert} />
              <ClearButton onClear={() => handleInsert('')} disabled={!input} />
            </>
          }
          footer={
            <div className="flex flex-col gap-4">
              <p className="text-[12px] text-subtle">O resultado é atualizado enquanto você digita.</p>

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
            </div>
          }
        />

        <CodeOutput
          id="xml-output"
          label="Resultado"
          value={output}
          placeholder="O resultado formatado aparecerá aqui…"
          filename={action === 'minify' ? 'devdrop-minificado.xml' : 'devdrop-formatado.xml'}
          mimeType="application/xml"
          footer={
            output && !isPending ? (
              <p role="status" className="flex items-center gap-2 text-[12px] font-medium text-emerald-800">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                XML válido
              </p>
            ) : undefined
          }
        />
      </div>
    </ToolShell>
  )
}
