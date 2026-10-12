import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tools } from './src/data/tools'

/**
 * Public address of the site, used where URLs must be absolute (sitemap, robots, link
 * previews). On Vercel it comes from VERCEL_PROJECT_PRODUCTION_URL, the production domain
 * (custom domain once one is attached, the vercel.app one before that). SITE_URL overrides.
 */
function siteUrl() {
  const explicit = process.env.SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  return vercel ? `https://${vercel}` : 'http://localhost:4173'
}

/** Every page worth indexing. The tool routes come from the registry, so new tools are listed. */
function sitemapPaths() {
  const toolPaths = tools.flatMap((tool) => (tool.status === 'available' && tool.path ? [tool.path] : []))
  return ['/', '/tools', ...toolPaths, '/privacidade', '/cookies']
}

/** robots.txt, sitemap.xml and the absolute URLs in index.html, generated at build time. */
function seo(): Plugin {
  const url = siteUrl()
  return {
    name: 'devdrop-seo',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', url),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const entries = sitemapPaths()
        .map((path) => `  <url>\n    <loc>${url}${path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      })
    },
  }
}

/**
 * The site-wide headers from vercel.json (CSP and friends), so `npm run preview` behaves
 * like production: a CSP violation shows up locally, not after the deploy.
 */
function productionHeaders(): Record<string, string> {
  const config = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
    headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>
  }
  const global = config.headers.find((rule) => rule.source === '/(.*)')?.headers ?? []
  return Object.fromEntries(global.map(({ key, value }) => [key, value]))
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  define: {
    // Analytics only in the production deploy (VERCEL_ENV is a Vercel system variable).
    __ANALYTICS__: JSON.stringify(process.env.VERCEL_ENV === 'production'),
  },
  preview: { headers: productionHeaders() },
})
