import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { SiteHeader } from '../../layout/SiteHeader'
import { SiteFooter } from '../../layout/SiteFooter'
import { links } from '../../../lib/links'
import { categories, type CategoryId } from '../../../data/tools'
import { categoryIcons } from '../categoryIcons'
import { cn } from '../../../lib/cn'

interface ToolShellProps {
  title: string
  description: string
  categoryId?: CategoryId
  metaDescription?: string
  actions?: ReactNode
  notice?: ReactNode
  children: ReactNode
  className?: string
}

export function ToolShell({
  title,
  description,
  categoryId = 'developer',
  metaDescription,
  actions,
  notice,
  children,
  className,
}: ToolShellProps) {
  const category = categories.find((c) => c.id === categoryId)
  const Icon = category ? categoryIcons[categoryId] : Sparkles

  return (
    <div className="px-3 pt-3 sm:px-6 sm:pt-6">
      <title>{`${title} — DevDrop`}</title>
      <meta
        name="description"
        content={metaDescription || `${title}: ${description} Rápido, seguro e direto no navegador.`}
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-page px-2">
        {/* Navigation / Breadcrumb */}
        <div className="pt-6 sm:pt-10">
          <Link
            to={links.tools}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Voltar para todas as ferramentas</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="mt-4 flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full border border-slate-200/70 bg-white text-ink shadow-sm">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {category && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-600 uppercase">
                  {category.name}
                </span>
              )}
            </div>
            <h1 className="font-display text-[32px] font-medium leading-[1.1] tracking-tight text-ink md:text-[46px]">
              {title}
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
              {description}
            </p>
          </div>

          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>

        {/* Notice / Semantic disclaimer if provided */}
        {notice && (
          <div className="mb-6 rounded-2xl border border-sky-200/80 bg-sky-50/60 p-4 text-[13px] text-sky-950">
            {notice}
          </div>
        )}

        {/* Main Work Area */}
        <div
          className={cn(
            'rounded-card border border-slate-200/60 bg-white p-5 shadow-card sm:p-7',
            className,
          )}
        >
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
