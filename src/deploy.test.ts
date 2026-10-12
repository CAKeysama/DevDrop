import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8').replace(/\r\n/g, '\n')
const vercel = JSON.parse(read('vercel.json')) as {
  buildCommand: string
  rewrites: Array<{ source: string; destination: string }>
  headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>
}
const csp = vercel.headers.flatMap((rule) => rule.headers).find((header) => header.key === 'Content-Security-Policy')!.value

describe('vercel.json', () => {
  it('allows the inline theme script by hash, so editing it without updating the CSP fails here', () => {
    // Line endings as git stores them (LF), which is what Vercel builds from.
    const scripts = [...read('index.html').matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1])
    expect(scripts.length).toBeGreaterThan(0)
    for (const script of scripts) {
      const hash = createHash('sha256').update(script, 'utf8').digest('base64')
      expect(csp).toContain(`'sha256-${hash}'`)
    }
  })

  it('serves every route from index.html (client-side routing)', () => {
    expect(vercel.rewrites).toContainEqual({ source: '/(.*)', destination: '/index.html' })
  })

  it('refuses to deploy a build that fails lint or tests', () => {
    expect(vercel.buildCommand).toMatch(/npm run lint/)
    expect(vercel.buildCommand).toMatch(/npm test/)
  })

  it('loads nothing from other origins, matching the privacy policy', () => {
    expect(csp).toMatch(/default-src 'self'/)
    expect(csp).not.toMatch(/https?:\/\//)
  })
})
