/** A category with more tools than this shows only the first few chips and a "+N" link. */
export const COLLAPSE_ABOVE = 6
export const COLLAPSED_CHIPS = 4

/**
 * Which chips a category card shows. Small categories show everything; a big one shows a few
 * and the count of the rest, so a "+1" never hides a single chip that would have fit.
 */
export function splitChips<T>(items: T[]): { visible: T[]; hidden: number } {
  if (items.length <= COLLAPSE_ABOVE) return { visible: items, hidden: 0 }
  return { visible: items.slice(0, COLLAPSED_CHIPS), hidden: items.length - COLLAPSED_CHIPS }
}
