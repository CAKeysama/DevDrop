/**
 * After a deploy, a tab opened before it still asks for the old page chunks, which no longer
 * exist: the import fails and the page would go blank. Reloading fetches the new build.
 *
 * The "already reloaded" mark lives in the tab's history state, not in sessionStorage, so the
 * site still stores nothing but the theme (see /cookies). It survives the reload, and a
 * second failure within a minute is shown as an error instead of reloading in a loop.
 */
const MARK = 'devdropReloadedAt'
const LOOP_WINDOW_MS = 60_000

function lastReload(): number {
  const state: unknown = window.history.state
  if (state && typeof state === 'object' && MARK in state) return Number((state as Record<string, unknown>)[MARK]) || 0
  return 0
}

/** Reloads to pick up the new build, unless it just did. Returns whether it reloaded. */
export function reloadForNewVersion(): boolean {
  if (Date.now() - lastReload() < LOOP_WINDOW_MS) return false
  const state: unknown = window.history.state
  window.history.replaceState({ ...(state && typeof state === 'object' ? state : {}), [MARK]: Date.now() }, '')
  window.location.reload()
  return true
}

/** Browsers word a failed dynamic import differently; these cover Chromium, Firefox and Safari. */
export function isChunkLoadError(error: unknown): boolean {
  return (
    error instanceof Error &&
    /dynamically imported module|importing a module script failed|error loading dynamically imported module|unable to preload css/i.test(
      error.message,
    )
  )
}
