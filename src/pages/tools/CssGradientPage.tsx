import { useRef, useState } from 'react'
import { Plus, RotateCcw, Trash2 } from 'lucide-react'
import { ActionButton, CodeOutput, ColorField, Presets, RangeField, SegmentedControl, ToolPanel, ToolShell } from '../../components/tools/shared'
import { getTool } from '../../data/tools'
import {
  GRADIENT_MAX_STOPS,
  GRADIENT_MIN_STOPS,
  buildGradient,
  gradientCss,
  gradientPresets,
  type GradientOptions,
} from '../../lib/css/generators'

const tool = getTool('css-gradient')

type Preset = (typeof gradientPresets)[number]['value']

const fromPreset = (preset: Preset): GradientOptions => ({
  ...preset,
  stops: preset.stops.map(([color, position], index) => ({ id: `preset-${index}`, color, position })),
})

const initial = fromPreset(gradientPresets[0].value)

export default function CssGradientPage() {
  const [gradient, setGradient] = useState<GradientOptions>(initial)
  const nextId = useRef(0)

  const updateStop = (id: string, patch: Partial<{ color: string; position: number }>) =>
    setGradient((current) => ({ ...current, stops: current.stops.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)) }))

  function addStop() {
    nextId.current += 1
    const id = `stop-${nextId.current}`
    setGradient((current) => {
      // The new stop goes halfway between the last two, reusing the last colour.
      const sorted = [...current.stops].sort((a, b) => a.position - b.position)
      const last = sorted[sorted.length - 1]
      const before = sorted[sorted.length - 2]
      return { ...current, stops: [...current.stops, { id, color: last.color, position: Math.round((last.position + before.position) / 2) }] }
    })
  }

  const removeStop = (id: string) => setGradient((current) => ({ ...current, stops: current.stops.filter((stop) => stop.id !== id) }))

  return (
    <ToolShell toolId={tool.id} title={tool.name} description={tool.description} categoryId={tool.categoryId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolPanel
          title="Ajustes"
          actions={
            <ActionButton onClick={() => setGradient(initial)}>
              <RotateCcw aria-hidden="true" />
              Restaurar
            </ActionButton>
          }
        >
          <div className="flex flex-col gap-4">
            <Presets presets={gradientPresets} onSelect={(preset) => setGradient(fromPreset(preset))} />
            <SegmentedControl
              label="Tipo"
              value={gradient.type}
              onChange={(type) => setGradient((current) => ({ ...current, type }))}
              options={[
                { value: 'linear', label: 'Linear' },
                { value: 'radial', label: 'Radial' },
              ]}
            />
            {gradient.type === 'linear' ? (
              <RangeField label="Ângulo" unit="°" min={0} max={360} value={gradient.angle} onChange={(angle) => setGradient((current) => ({ ...current, angle }))} />
            ) : (
              <SegmentedControl
                label="Forma"
                value={gradient.shape}
                onChange={(shape) => setGradient((current) => ({ ...current, shape }))}
                options={[
                  { value: 'circle', label: 'Círculo' },
                  { value: 'ellipse', label: 'Elipse' },
                ]}
              />
            )}

            <fieldset>
              <legend className="text-[12px] font-medium text-slate-500">
                Cores ({gradient.stops.length} de {GRADIENT_MAX_STOPS})
              </legend>
              <ol className="mt-2 flex flex-col gap-3">
                {gradient.stops.map((stop, index) => (
                  <li key={stop.id} className="grid gap-x-4 gap-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
                    <ColorField label={`Cor ${index + 1}`} value={stop.color} onChange={(color) => updateStop(stop.id, { color })} />
                    <RangeField label="Posição" unit="%" min={0} max={100} value={stop.position} onChange={(position) => updateStop(stop.id, { position })} />
                    <button
                      type="button"
                      onClick={() => removeStop(stop.id)}
                      disabled={gradient.stops.length <= GRADIENT_MIN_STOPS}
                      aria-label={`Remover cor ${index + 1}`}
                      className="flex size-9 cursor-pointer items-center justify-center self-end rounded-full text-slate-500 hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 sm:mt-6 sm:self-start"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </li>
                ))}
              </ol>
              <ActionButton className="mt-3" onClick={addStop} disabled={gradient.stops.length >= GRADIENT_MAX_STOPS}>
                <Plus aria-hidden="true" />
                Adicionar cor
              </ActionButton>
            </fieldset>
          </div>
        </ToolPanel>

        <div className="flex min-w-0 flex-col gap-6">
          <ToolPanel title="Prévia" className="flex-1">
            <div role="img" aria-label="Prévia do gradiente" className="min-h-64 flex-1 rounded-2xl border border-slate-200/80 sm:min-h-72" style={{ background: buildGradient(gradient) }} />
          </ToolPanel>
          <CodeOutput id="css-gradient-output" label="CSS" value={gradientCss(gradient)} filename="devdrop-gradiente.css" mimeType="text/css" minHeight="min-h-[72px]" />
        </div>
      </div>
    </ToolShell>
  )
}
