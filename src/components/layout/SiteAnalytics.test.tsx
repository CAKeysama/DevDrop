// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { redactEvent } from '../../lib/analytics'
import { SiteAnalytics } from './SiteAnalytics'

describe('redactEvent', () => {
  it('drops the typed search but keeps the category filter', () => {
    const event = redactEvent({ type: 'pageview', url: 'https://devdrop-tools.vercel.app/tools?q=meu+token&category=developer' })
    expect(event.url).toBe('https://devdrop-tools.vercel.app/tools?category=developer')
  })

  it('leaves other pages untouched', () => {
    const url = 'https://devdrop-tools.vercel.app/tools/json-formatter'
    expect(redactEvent({ type: 'pageview', url }).url).toBe(url)
  })
})

describe('SiteAnalytics', () => {
  it('renders nothing outside the production deploy', () => {
    const { container } = render(<SiteAnalytics />)
    expect(container.innerHTML).toBe('')
    expect(document.querySelector('script[src*="insights"], script[src*="vercel-scripts"]')).toBeNull()
  })
})
