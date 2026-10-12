import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { ActionButton, Checkbox, CodeOutput, ColorField, Presets, PreviewStage, RangeField, SelectField, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import {
  borderCorners,
  borderCss,
  borderSides,
  borderStyles,
  buildBorder,
  defaultBorder,
  type BorderCorner,
  type BorderOptions,
  type BorderSide,
  type BorderStyle,
} from '../../lib/css/generators'

const tool = getTool('css-border')

const styleLabels: Record<BorderStyle, string> = {
  solid: 'Sólida (solid)',
  dashed: 'Tracejada (dashed)',
  dotted: 'Pontilhada (dotted)',
  double: 'Dupla (double)',
  groove: 'Sulco (groove)',
  ridge: 'Relevo (ridge)',
  inset: 'Afundada (inset)',
  outset: 'Saltada (outset)',
}

const sideLabels: Record<BorderSide, string> = { top: 'Superior', right: 'Direita', bottom: 'Inferior', left: 'Esquerda' }
const cornerLabels: Record<BorderCorner, string> = {
  'top-left': 'Superior esquerdo',
  'top-right': 'Superior direito',
  'bottom-right': 'Inferior direito',
  'bottom-left': 'Inferior esquerdo',
}

const uniform = <K extends string>(keys: readonly K[], value: number) => Object.fromEntries(keys.map((key) => [key, value])) as Record<K, number>

const presets: Array<{ name: string; value: BorderOptions }> = [
  { name: 'Cartão', value: defaultBorder },
  { name: 'Pílula', value: { ...defaultBorder, width: 1, radius: 999, color: '#94a3b8' } },
  { name: 'Tracejada', value: { ...defaultBorder, style: 'dashed', color: '#64748b', radius: 12 } },
  { name: 'Só embaixo', value: { ...defaultBorder, radius: 0, individualSides: true, sideWidths: { top: 0, right: 0, bottom: 4, left: 0 } } },
  { name: 'Folha', value: { ...defaultBorder, individualCorners: true, cornerRadii: { 'top-left': 48, 'top-right': 4, 'bottom-right': 48, 'bottom-left': 4 } } },
]

/** Turns ["border-top-left-radius", "8px"] pairs into a React style object. */
const toStyle = (declarations: Array<[string, string]>) =>
  Object.fromEntries(declarations.map(([property, value]) => [property.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase()), value]))

export default function CssBorderPage() {
  const [border, setBorder] = useState<BorderOptions>(defaultBorder)
  const set =
    <K extends keyof BorderOptions>(key: K) =>
    (value: BorderOptions[K]) =>
      setBorder((current) => ({ ...current, [key]: value }))

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolPanel
          title="Ajustes"
          actions={
            <ActionButton onClick={() => setBorder(defaultBorder)}>
              <RotateCcw aria-hidden="true" />
              Restaurar
            </ActionButton>
          }
        >
          <div className="flex flex-col gap-4">
            <Presets presets={presets} onSelect={setBorder} />
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <SelectField label="Estilo" value={border.style} onChange={set('style')} options={borderStyles.map((value) => ({ value, label: styleLabels[value] }))} />
              <ColorField label="Cor" value={border.color} onChange={set('color')} />
            </div>

            <fieldset className="rounded-2xl border border-slate-200/80 p-4">
              <legend className="px-1 text-[12px] font-medium text-slate-500">Espessura</legend>
              <Checkbox
                label="Definir cada lado separadamente"
                checked={border.individualSides}
                onChange={(individualSides) => setBorder((current) => ({ ...current, individualSides, sideWidths: uniform(borderSides, current.width) }))}
              />
              {border.individualSides ? (
                <div className="mt-2 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {borderSides.map((side) => (
                    <RangeField
                      key={side}
                      label={sideLabels[side]}
                      unit="px"
                      min={0}
                      max={40}
                      value={border.sideWidths[side]}
                      onChange={(value) => setBorder((current) => ({ ...current, sideWidths: { ...current.sideWidths, [side]: value } }))}
                    />
                  ))}
                </div>
              ) : (
                <RangeField className="mt-2" label="Todos os lados" unit="px" min={0} max={40} value={border.width} onChange={set('width')} />
              )}
            </fieldset>

            <fieldset className="rounded-2xl border border-slate-200/80 p-4">
              <legend className="px-1 text-[12px] font-medium text-slate-500">Arredondamento</legend>
              <Checkbox
                label="Definir cada canto separadamente"
                checked={border.individualCorners}
                onChange={(individualCorners) => setBorder((current) => ({ ...current, individualCorners, cornerRadii: uniform(borderCorners, current.radius) }))}
              />
              {border.individualCorners ? (
                <div className="mt-2 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {borderCorners.map((corner) => (
                    <RangeField
                      key={corner}
                      label={cornerLabels[corner]}
                      unit="px"
                      min={0}
                      max={200}
                      value={border.cornerRadii[corner]}
                      onChange={(value) => setBorder((current) => ({ ...current, cornerRadii: { ...current.cornerRadii, [corner]: value } }))}
                    />
                  ))}
                </div>
              ) : (
                <RangeField className="mt-2" label="Todos os cantos" unit="px" min={0} max={200} value={border.radius} onChange={set('radius')} />
              )}
            </fieldset>
          </div>
        </ToolPanel>

        <div className="flex min-w-0 flex-col gap-6">
          <ToolPanel title="Prévia" className="flex-1">
            <PreviewStage>
              <div role="img" aria-label="Prévia da borda" className="h-36 w-48 bg-white sm:h-44 sm:w-60" style={toStyle(buildBorder(border))} />
            </PreviewStage>
          </ToolPanel>
          <CodeOutput id="css-border-output" label="CSS" value={borderCss(border)} filename="devdrop-borda.css" mimeType="text/css" minHeight="min-h-[96px]" />
        </div>
      </div>
    </ToolShell>
  )
}
