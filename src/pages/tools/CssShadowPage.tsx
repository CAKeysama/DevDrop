import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { ActionButton, Checkbox, CodeOutput, ColorField, Presets, PreviewStage, RangeField, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import { buildBoxShadow, defaultShadow, shadowCss, shadowPresets, type ShadowOptions } from '../../lib/css/generators'

const tool = getTool('css-shadow')

export default function CssShadowPage() {
  const [shadow, setShadow] = useState<ShadowOptions>(defaultShadow)
  const set =
    <K extends keyof ShadowOptions>(key: K) =>
    (value: ShadowOptions[K]) =>
      setShadow((current) => ({ ...current, [key]: value }))

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolPanel
          title="Ajustes"
          actions={
            <ActionButton onClick={() => setShadow(defaultShadow)}>
              <RotateCcw aria-hidden="true" />
              Restaurar
            </ActionButton>
          }
        >
          <div className="flex flex-col gap-4">
            <Presets presets={shadowPresets} onSelect={setShadow} />
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <RangeField label="Deslocamento X" unit="px" min={-100} max={100} value={shadow.x} onChange={set('x')} />
              <RangeField label="Deslocamento Y" unit="px" min={-100} max={100} value={shadow.y} onChange={set('y')} />
              <RangeField label="Desfoque" unit="px" min={0} max={200} value={shadow.blur} onChange={set('blur')} />
              <RangeField label="Expansão" unit="px" min={-100} max={100} value={shadow.spread} onChange={set('spread')} />
              <ColorField label="Cor" value={shadow.color} onChange={set('color')} />
              <RangeField label="Opacidade" unit="%" min={0} max={100} value={shadow.opacity} onChange={set('opacity')} />
            </div>
            <Checkbox label="Sombra interna (inset)" hint="Desenha a sombra por dentro do elemento." checked={shadow.inset} onChange={set('inset')} />
          </div>
        </ToolPanel>

        <div className="flex min-w-0 flex-col gap-6">
          <ToolPanel title="Prévia" className="flex-1">
            <PreviewStage>
              <div role="img" aria-label="Prévia da sombra" className="size-36 rounded-3xl bg-white sm:size-44" style={{ boxShadow: buildBoxShadow(shadow) }} />
            </PreviewStage>
          </ToolPanel>
          <CodeOutput id="css-shadow-output" label="CSS" value={shadowCss(shadow)} filename="devdrop-sombra.css" mimeType="text/css" minHeight="min-h-[72px]" />
        </div>
      </div>
    </ToolShell>
  )
}
