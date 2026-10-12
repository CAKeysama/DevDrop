/**
 * Motion tokens for `motion/react`, mirroring the CSS ones in styles/index.css so JS and CSS
 * animations share the same feel. Keep both in sync.
 */

/** Strong ease-out (`--ease-out`): things entering or leaving. */
export const easeOut = [0.23, 1, 0.32, 1] as const

/** Strong ease-in-out (`--ease-in-out`): things moving to a new place on screen. */
export const easeInOut = [0.77, 0, 0.175, 1] as const

/**
 * A list that changes while the user types (catalog search). It changes tens of times a
 * minute, so it stays fast and subtle: enter in 200ms, leave faster than it came, and move
 * the cards that stay instead of letting them jump.
 */
export const listItem = {
  initial: { opacity: 0, scale: 0.97, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15, ease: easeOut } },
}

export const listItemTransition = {
  duration: 0.2,
  ease: easeOut,
  layout: { duration: 0.25, ease: easeInOut },
}

/** Stagger between entering cards, capped so a long list never waits on itself. */
export function staggerDelay(index: number) {
  return Math.min(index, 8) * 0.03
}
