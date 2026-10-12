/** Pure builders for the CSS generators. Each returns the declarations and a style object. */

export const isHexColor = (value: string) => /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())

/** "#abc" → "#aabbcc". Returns null for anything that is not a hex colour. */
export function normalizeHex(value: string): string | null {
  const hex = value.trim().toLowerCase()
  if (!isHexColor(hex)) return null
  return hex.length === 4 ? '#' + [...hex.slice(1)].map((char) => char + char).join('') : hex
}

/** Hex colour plus opacity (0–100) as an rgb()/rgba() value. */
export function hexToRgba(hex: string, opacity = 100): string {
  const normalized = normalizeHex(hex) ?? '#000000'
  const [r, g, b] = [1, 3, 5].map((start) => parseInt(normalized.slice(start, start + 2), 16))
  const alpha = Math.min(100, Math.max(0, opacity)) / 100
  return alpha === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(2))})`
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
const px = (value: number) => (value === 0 ? '0' : `${value}px`)

// ---------------------------------------------------------------- box-shadow
export interface ShadowOptions {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

export const defaultShadow: ShadowOptions = { x: 0, y: 12, blur: 32, spread: -8, color: '#0a1b33', opacity: 25, inset: false }

export const shadowPresets: Array<{ name: string; value: ShadowOptions }> = [
  { name: 'Suave', value: { x: 0, y: 2, blur: 8, spread: 0, color: '#0a1b33', opacity: 10, inset: false } },
  { name: 'Média', value: defaultShadow },
  { name: 'Elevada', value: { x: 0, y: 28, blur: 60, spread: -12, color: '#0a1b33', opacity: 35, inset: false } },
  { name: 'Dura', value: { x: 8, y: 8, blur: 0, spread: 0, color: '#0a1b33', opacity: 100, inset: false } },
  { name: 'Interna', value: { x: 0, y: 4, blur: 12, spread: 0, color: '#0a1b33', opacity: 20, inset: true } },
]

export function buildBoxShadow(options: ShadowOptions): string {
  const blur = clamp(options.blur, 0, 1000) // blur cannot be negative in CSS
  const parts = [px(options.x), px(options.y), px(blur), px(options.spread), hexToRgba(options.color, options.opacity)]
  return (options.inset ? 'inset ' : '') + parts.join(' ')
}

export const shadowCss = (options: ShadowOptions) => `box-shadow: ${buildBoxShadow(options)};`

// ------------------------------------------------------------------ gradient
export interface GradientStop {
  id: string
  color: string
  position: number
}

export interface GradientOptions {
  type: 'linear' | 'radial'
  angle: number
  shape: 'circle' | 'ellipse'
  stops: GradientStop[]
}

export const GRADIENT_MIN_STOPS = 2
export const GRADIENT_MAX_STOPS = 6

export const gradientPresets: Array<{ name: string; value: Omit<GradientOptions, 'stops'> & { stops: Array<[string, number]> } }> = [
  { name: 'Oceano', value: { type: 'linear', angle: 135, shape: 'circle', stops: [['#38bdf8', 0], ['#4f46e5', 100]] } },
  { name: 'Pôr do sol', value: { type: 'linear', angle: 90, shape: 'circle', stops: [['#f97316', 0], ['#ec4899', 50], ['#8b5cf6', 100]] } },
  { name: 'Menta', value: { type: 'linear', angle: 160, shape: 'circle', stops: [['#a7f3d0', 0], ['#0d9488', 100]] } },
  { name: 'Foco', value: { type: 'radial', angle: 0, shape: 'circle', stops: [['#fde68a', 0], ['#f59e0b', 45], ['#7c2d12', 100]] } },
]

export function buildGradient(options: GradientOptions): string {
  const stops = [...options.stops]
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${normalizeHex(stop.color) ?? '#000000'} ${clamp(stop.position, 0, 100)}%`)
    .join(', ')
  return options.type === 'linear'
    ? `linear-gradient(${((Math.round(options.angle) % 360) + 360) % 360}deg, ${stops})`
    : `radial-gradient(${options.shape}, ${stops})`
}

export const gradientCss = (options: GradientOptions) => `background: ${buildGradient(options)};`

// -------------------------------------------------------------------- border
export const borderStyles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'] as const
export type BorderStyle = (typeof borderStyles)[number]

export const borderSides = ['top', 'right', 'bottom', 'left'] as const
export const borderCorners = ['top-left', 'top-right', 'bottom-right', 'bottom-left'] as const
export type BorderSide = (typeof borderSides)[number]
export type BorderCorner = (typeof borderCorners)[number]

export interface BorderOptions {
  width: number
  style: BorderStyle
  color: string
  radius: number
  /** When true, each side uses its own width from `sideWidths`. */
  individualSides: boolean
  sideWidths: Record<BorderSide, number>
  /** When true, each corner uses its own radius from `cornerRadii`. */
  individualCorners: boolean
  cornerRadii: Record<BorderCorner, number>
}

export const defaultBorder: BorderOptions = {
  width: 2,
  style: 'solid',
  color: '#0a1b33',
  radius: 16,
  individualSides: false,
  sideWidths: { top: 2, right: 2, bottom: 2, left: 2 },
  individualCorners: false,
  cornerRadii: { 'top-left': 16, 'top-right': 16, 'bottom-right': 16, 'bottom-left': 16 },
}

/** Declarations for the border, as [property, value] pairs in output order. */
export function buildBorder(options: BorderOptions): Array<[string, string]> {
  const color = normalizeHex(options.color) ?? '#000000'
  const declarations: Array<[string, string]> = []

  const widths = borderSides.map((side) => clamp(options.sideWidths[side], 0, 200))
  if (options.individualSides && new Set(widths).size > 1) {
    declarations.push(['border-style', options.style], ['border-color', color], ['border-width', widths.map(px).join(' ')])
  } else {
    const width = options.individualSides ? widths[0] : clamp(options.width, 0, 200)
    declarations.push(['border', `${px(width)} ${options.style} ${color}`])
  }

  const radii = borderCorners.map((corner) => clamp(options.cornerRadii[corner], 0, 1000))
  if (options.individualCorners && new Set(radii).size > 1) {
    declarations.push(['border-radius', radii.map(px).join(' ')])
  } else {
    const radius = options.individualCorners ? radii[0] : clamp(options.radius, 0, 1000)
    if (radius > 0) declarations.push(['border-radius', px(radius)])
  }
  return declarations
}

export const borderCss = (options: BorderOptions) =>
  buildBorder(options)
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n')
