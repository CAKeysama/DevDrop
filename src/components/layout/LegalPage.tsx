import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { links } from '../../lib/links'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export interface LegalSection {
  id: string
  title: string
  content: ReactNode
}

interface LegalPageProps {
  title: string
  description: string
  /** Date of the last change, shown to the reader, e.g. "11 de outubro de 2026". */
  updated: string
  /** The short version, shown first: most people read only this. */
  summary: ReactNode
  sections: LegalSection[]
}

/**
 * Body text for legal pages. No typography plugin in the project, so the long-form rules
 * live here, scoped to this layout.
 */
const prose = [
  'text-[15px] leading-relaxed text-slate-700',
  '[&_p]:mt-3 [&_p:first-child]:mt-0',
  '[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_li]:marker:text-slate-400',
  '[&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:decoration-2',
  '[&_strong]:font-semibold [&_strong]:text-ink',
  '[&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-ink',
].join(' ')

/** Privacy and cookie policies: same layout, plain language first, details after. */
export function LegalPage({ title, description, updated, summary, sections }: LegalPageProps) {
  const otherPage = title.includes('Cookies')
    ? { href: links.privacy, label: 'Política de Privacidade' }
    : { href: links.cookies, label: 'Política de Cookies' }

  return (
    <div className="px-3 pt-3 sm:px-6 sm:pt-6">
      <title>{`${title} — DevDrop`}</title>
      <meta name="description" content={description} />
      <SiteHeader />

      <main className="mx-auto w-full max-w-page px-2 pt-10 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Transparência</p>
          <h1 className="mt-3 font-display text-[36px] font-medium leading-[1.08] tracking-tight text-ink md:text-[52px]">
            {title}
          </h1>
          <p className="mt-3 text-[13px] text-muted">Última atualização: {updated}</p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Nesta página" className="max-lg:hidden">
            <ol className="sticky top-6 space-y-2 border-l border-slate-200/80 pl-4 text-[13px]">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-muted transition-colors hover:text-ink">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="rounded-card border border-slate-200/60 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-[20px] font-medium tracking-tight text-ink">Em resumo</h2>
              <div className={`mt-3 ${prose}`}>{summary}</div>
            </div>

            {sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="mt-12 scroll-mt-6">
                <h2 id={`${section.id}-title`} className="font-display text-[22px] font-medium tracking-tight text-ink">
                  {section.title}
                </h2>
                <div className={`mt-3 ${prose}`}>{section.content}</div>
              </section>
            ))}

            <p className="mt-12 border-t border-slate-200/70 pt-6 text-[14px] text-muted">
              Veja também a{' '}
              <Link to={otherPage.href} className="font-medium text-ink underline underline-offset-2">
                {otherPage.label}
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
