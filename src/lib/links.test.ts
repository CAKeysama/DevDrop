import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { links } from './links'

describe('issue links', () => {
  it.each([
    ['suggest', links.suggest],
    ['privacyContact', links.privacyContact],
  ])('%s opens an issue form that exists in the repository', (_, href) => {
    const template = new URL(href).searchParams.get('template')
    expect(template).toBeTruthy()
    expect(existsSync(resolve(process.cwd(), '.github/ISSUE_TEMPLATE', template!))).toBe(true)
  })
})
