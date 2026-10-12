// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { THEME_STORAGE_KEY } from '../lib/theme'
import CookiesPage from './CookiesPage'
import PrivacyPage from './PrivacyPage'

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

function open(Page: () => React.JSX.Element) {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>,
  )
  return user
}

describe('privacy policy', () => {
  it('states what the site does and links to the cookie policy', () => {
    open(PrivacyPage)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Política de Privacidade')
    expect(screen.getByRole('heading', { name: 'Seus direitos' })).toBeTruthy()
    expect(screen.getAllByRole('link', { name: 'Política de Cookies' })[0].getAttribute('href')).toBe('/cookies')
  })
})

describe('cookie policy', () => {
  it('names the only stored key, the one the theme module uses', () => {
    open(CookiesPage)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Política de Cookies')
    expect(screen.getByText(THEME_STORAGE_KEY)).toBeTruthy()
  })

  it('forgets a saved theme', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    document.documentElement.classList.add('dark')
    const user = open(CookiesPage)

    await user.click(screen.getByRole('button', { name: 'Esquecer minha preferência de tema' }))

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
    expect(screen.getByRole('status').textContent).toMatch(/Nada guardado/)
    // jsdom has no system theme: it falls back to light.
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('says so when nothing is stored', () => {
    open(CookiesPage)
    expect(screen.queryByRole('button', { name: /Esquecer/ })).toBeNull()
    expect(screen.getByRole('status').textContent).toMatch(/Nada guardado/)
  })
})

describe('routes', () => {
  it('registers both pages and links them from the footer', () => {
    // jsdom gives import.meta.url an http scheme, so read from the project root instead.
    const read = (path: string) => readFileSync(resolve(process.cwd(), 'src', path), 'utf8')
    const app = read('App.tsx')
    const footer = read('components/layout/SiteFooter.tsx')
    const linksFile = read('lib/links.ts')
    expect(linksFile).toContain("privacy: '/privacidade'")
    expect(linksFile).toContain("cookies: '/cookies'")
    expect(app).toContain('path="/privacidade"')
    expect(app).toContain('path="/cookies"')
    expect(footer).toContain('links.privacy')
    expect(footer).toContain('links.cookies')
  })
})
