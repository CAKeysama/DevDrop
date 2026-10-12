// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { isChunkLoadError } from '../../lib/staleBuild'
import { AppErrorBoundary } from './AppErrorBoundary'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  window.history.replaceState(null, '')
})

function Throws({ error }: { error: Error }): never {
  throw error
}

function renderWith(error: Error) {
  vi.spyOn(console, 'error').mockImplementation(() => undefined) // React logs caught errors
  render(
    <MemoryRouter>
      <AppErrorBoundary>
        <Throws error={error} />
      </AppErrorBoundary>
    </MemoryRouter>,
  )
}

describe('AppErrorBoundary', () => {
  it('shows a recoverable screen instead of a blank page', () => {
    renderWith(new Error('boom'))
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Algo deu errado nesta página')
    expect(screen.getByRole('button', { name: /Recarregar a página/ })).toBeTruthy()
  })

  it('explains an outdated tab when it already reloaded once', () => {
    // A reload just happened: the guard must not loop, so the message shows instead.
    window.history.replaceState({ devdropReloadedAt: Date.now() }, '')
    renderWith(new TypeError('Failed to fetch dynamically imported module: /assets/ToolsPage-old.js'))
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('O DevDrop foi atualizado')
  })
})

describe('isChunkLoadError', () => {
  it.each([
    'Failed to fetch dynamically imported module: https://x/assets/a.js', // Chromium
    'error loading dynamically imported module', // Firefox
    'Importing a module script failed.', // Safari
    'Unable to preload CSS for /assets/a.css', // Vite
  ])('recognises "%s"', (message) => {
    expect(isChunkLoadError(new TypeError(message))).toBe(true)
  })

  it('ignores ordinary errors', () => {
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false)
    expect(isChunkLoadError('not an error')).toBe(false)
  })
})
