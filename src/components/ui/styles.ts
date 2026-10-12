/**
 * How every control changes state: only colour, shadow and the press scale animate, never
 * `all` (it would also animate layout, e.g. a textarea being resized).
 */
export const controlTransition = 'transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out'

/** Press feedback for anything clickable: a subtle scale confirms the click landed. */
export const pressable = 'active:scale-[0.97]'

/**
 * Shared surface treatment: white pill, hairline border, soft shadow.
 * Used by the "Get in touch" nav button and the marquee cards so they stay identical.
 */
export const surfacePill = `rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 ${controlTransition}`

/** Small pill used for tool names and filters. */
export const chip =
  'inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors'
