/**
 * Light/dark theme. The first paint is handled by the inline script in index.html (same
 * storage key and class), so the page never flashes the wrong theme; this module takes
 * over once React runs.
 *
 * With no saved choice the theme follows the system and keeps following it. Toggling saves
 * the choice and stops following the system.
 */
export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'devdrop-theme'

const systemQuery = '(prefers-color-scheme: dark)'

/** Address bar colour per theme: the page canvas. Mirrors --color-canvas. */
const themeColors: Record<Theme, string> = { light: '#f9fafb', dark: '#0b1120' }

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null // storage blocked (private mode, disabled cookies): fall back to the system
  }
}

/** `matchMedia` is missing in some environments (jsdom in tests, very old browsers). */
const canQuerySystem = () => typeof window.matchMedia === 'function'

function systemTheme(): Theme {
  return canQuerySystem() && window.matchMedia(systemQuery).matches ? 'dark' : 'light'
}

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** Everything that shows the theme (the toggles) and must change with it. */
type Listener = (theme: Theme, stored: boolean) => void
const listeners = new Set<Listener>()

/** Bumped on every switch, so only the latest one clears `theme-switching`. */
let switchId = 0

/**
 * Switches the theme with a crossfade between the old and new screen (View Transitions, see
 * `::view-transition-*` in styles/index.css): a whole page jumping between white and near
 * black is harsh. Listeners run inside the swap, so anything React shows about the theme
 * (the toggle's icon) changes with the page instead of before the fade starts — they must
 * commit synchronously (flushSync).
 *
 * During the switch `theme-switching` turns off the controls' own colour transitions: the
 * crossfade already blends everything, and a button easing on its own would lag behind.
 * Without View Transitions support the switch is instant, as before.
 */
function apply(theme: Theme) {
  const root = document.documentElement
  const id = ++switchId
  const swap = () => {
    root.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
    const stored = readStored() !== null
    listeners.forEach((listener) => listener(theme, stored))
  }
  const done = () => {
    if (id === switchId) root.classList.remove('theme-switching')
  }

  root.classList.add('theme-switching')
  if (typeof document.startViewTransition === 'function') {
    // A second click mid-fade skips the first transition and starts from where it is.
    document.startViewTransition(swap).finished.finally(done)
  } else {
    swap()
    requestAnimationFrame(() => requestAnimationFrame(done))
  }
}

/** Whether the visitor picked a theme (the only thing DevDrop stores; see /cookies). */
export function hasStoredTheme(): boolean {
  return readStored() !== null
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Not saved: the choice still holds for this visit.
  }
  apply(theme)
}

/** Forgets the saved choice and goes back to following the system. */
export function clearThemePreference() {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY)
  } catch {
    // Nothing could have been saved either.
  }
  apply(systemTheme())
}

let stopFollowingSystem: (() => void) | null = null

/** While the visitor has not picked a theme, system changes switch it too. */
function followSystem() {
  if (!canQuerySystem()) return () => undefined
  const media = window.matchMedia(systemQuery)
  const listener = () => {
    if (!readStored()) apply(systemTheme())
  }
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}

/**
 * Calls `listener` whenever the theme changes, from any source: a toggle, the system, or the
 * preference being cleared. Returns the cleanup.
 */
export function subscribeTheme(listener: Listener) {
  listeners.add(listener)
  stopFollowingSystem ??= followSystem()
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      stopFollowingSystem?.()
      stopFollowingSystem = null
    }
  }
}
