import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Moon, Sun } from 'lucide-react'
import { cn } from '../../lib/cn'
import { getTheme, setTheme, subscribeTheme, type Theme } from '../../lib/theme'
import { pressable, surfacePill } from './styles'

/**
 * Switches between light and dark. The page crossfades between themes (see lib/theme.ts);
 * the press scale is the immediate feedback.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>(getTheme)

  // flushSync: the icon has to be in the DOM when the browser captures the new screen,
  // otherwise it would swap after the crossfade.
  useEffect(() => subscribeTheme((value) => flushSync(() => setThemeState(value))), [])

  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  const Icon = theme === 'dark' ? Sun : Moon

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={next === 'dark' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      title={next === 'dark' ? 'Modo escuro' : 'Modo claro'}
      className={cn(surfacePill, pressable, 'flex size-9 shrink-0 cursor-pointer items-center justify-center text-ink', className)}
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  )
}
