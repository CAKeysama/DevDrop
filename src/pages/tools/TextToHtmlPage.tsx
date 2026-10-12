import { useState } from 'react'
import { Checkbox, SegmentedControl, TextTransformTool } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { htmlStructures, textToHtml, type HtmlStructure } from '../../lib/text/html'

const tool = getTool('text-to-html')
const example = 'Olá, mundo! Aqui vai um texto com <símbolos> & acentos: ação, coração.\nSegunda linha do mesmo parágrafo.\n\nVeja mais em https://devdrop-tools.vercel.app/tools.'

export default function TextToHtmlPage() {
  const [structure, setStructure] = useState<HtmlStructure>('paragraphs')
  const [linkify, setLinkify] = useState(false)
  const [entities, setEntities] = useState(false)
  const current = htmlStructures.find((item) => item.id === structure)!

  return (
    <TextTransformTool
      tool={tool}
      example={example}
      transform={(input) => {
        const { output, paragraphs } = textToHtml(input, { structure, linkify, entities })
        return { output, summary: paragraphs > 0 ? `${paragraphs} ${paragraphs === 1 ? 'parágrafo' : 'parágrafos'}.` : undefined }
      }}
      outputLabel="HTML"
      outputPlaceholder="O HTML aparece aqui enquanto você digita."
      filename="devdrop-texto.html"
      monospaceOutput
      options={
        <div className="flex flex-col gap-3">
          <SegmentedControl label="Estrutura" value={structure} onChange={setStructure} options={htmlStructures.map((item) => ({ value: item.id, label: item.label }))} />
          <div className="flex flex-col">
            <Checkbox label={<>Transformar endereços em links ({'<a>'})</>} checked={linkify} onChange={setLinkify} hint="Só http:// e https://." />
            <Checkbox
              label={<>Escrever acentos e símbolos como entidades ({'&aacute;'}, {'&ccedil;'}…)</>}
              checked={entities}
              onChange={setEntities}
              hint="Útil para sistemas antigos que não leem UTF-8."
            />
          </div>
        </div>
      }
      hint={`${current.description} Sempre escapa & < > e aspas, então o resultado é seguro para colar numa página.`}
    />
  )
}
