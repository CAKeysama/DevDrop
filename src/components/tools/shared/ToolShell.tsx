import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronRight, Lock } from 'lucide-react'
import { SiteHeader } from '../../layout/SiteHeader'
import { SiteFooter } from '../../layout/SiteFooter'
import { categoryHref, links } from '../../../lib/links'
import { categories, getToolsByCategory, getToolHref, type CategoryId } from '../../../data/tools'
import { ToolIcon } from '../ToolIcon'
import { cn } from '../../../lib/cn'

const MAX_RELATED = 6

interface ToolShellProps {
  toolId: string
  title: string
  description: string
  categoryId?: CategoryId
  metaDescription?: string
  notice?: ReactNode
  children: ReactNode
  className?: string
}

export function ToolShell({
  toolId,
  title,
  description,
  categoryId = 'developer',
  metaDescription,
  notice,
  children,
  className,
}: ToolShellProps) {
  const category = categories.find((c) => c.id === categoryId)
  // A category can hold a dozen tools; the page shows a handful and links to the rest.
  const relatedTools = getToolsByCategory(categoryId)
    .filter((t) => t.id !== toolId)
    .slice(0, MAX_RELATED)

  return (
    <div className="px-3 pt-3 sm:px-6 sm:pt-6">
      <title>{`${title} — DevDrop`}</title>
      <meta
        name="description"
        content={metaDescription || `${title}: ${description} Rápido, seguro e direto no navegador.`}
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-page px-2">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="pt-4 sm:pt-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-muted">
            <li>
              <Link to={links.tools} className="hover:text-ink transition-colors">
                Ferramentas
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3 text-slate-400" aria-hidden="true" />
            </li>
            {category && (
              <>
                <li>
                  <Link
                    to={`${links.tools}?category=${category.id}`}
                    className="hover:text-ink transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-slate-400" aria-hidden="true" />
                </li>
              </>
            )}
            <li className="font-semibold text-ink" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        {/* Hero Header with Tool Icon and Privacy Notice */}
        <div className="mt-4 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-ink">
              <ToolIcon toolId={toolId} className="size-5" />
            </span>
            <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink sm:text-[36px]">
              {title}
            </h1>
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {description}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-muted">
            <Lock className="size-3.5 text-muted" aria-hidden="true" />
            <span>Tudo é processado no seu navegador. O que você digita aqui não é enviado nem armazenado.</span>
          </div>
        </div>

        {/* Global Notice / Disclaimer banner if provided */}
        {notice && <div className="mb-6">{notice}</div>}

        {/* Main Work Area */}
        <div className={cn('w-full', className)}>
          {children}
        </div>

        {/* More in Category Section */}
        {relatedTools.length > 0 && category && (
          <section className="mt-16 sm:mt-20 border-t border-slate-100 pt-10" aria-labelledby="related-tools-title">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 id="related-tools-title" className="font-display text-[20px] font-medium tracking-tight text-ink">
                Mais em {category.name}
              </h2>
              <Link
                to={categoryHref(category.id)}
                className="text-[12px] font-semibold text-muted hover:text-ink transition-colors"
              >
                Ver todas em {category.name}
              </Link>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((tool) => (
                <li key={tool.id}>
                  {tool.status !== 'available' ? (
                    <div className="flex h-full items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-canvas p-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-muted">
                        <ToolIcon toolId={tool.id} className="size-4" />
                      </span>
                      <div>
                        <h3 className="text-[14px] font-semibold text-muted">
                          {tool.name}{' '}
                          <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold ring-1 ring-slate-300">
                            Em breve
                          </span>
                        </h3>
                        <p className="mt-0.5 text-[12px] text-muted line-clamp-2 leading-relaxed">{tool.description}</p>
                      </div>
                    </div>
                  ) : (
                  <Link
                    to={getToolHref(tool)}
                    className="group relative flex h-full items-start justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-card hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 group-hover:text-ink">
                        <ToolIcon toolId={tool.id} className="size-4" />
                      </span>
                      <div>
                        <h3 className="text-[14px] font-semibold text-ink group-hover:text-navy">
                          {tool.name}
                        </h3>
                        <p className="mt-0.5 text-[12px] text-muted line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted group-hover:text-ink transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
