import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/layout/SiteHeader'
import { CategoryPills } from '../components/tools/CategoryPills'
import { categoryIcons } from '../components/tools/categoryIcons'
import { SearchField } from '../components/ui/SearchField'
import { categories, isCategoryId, searchTools, tools, type CategoryId, type Tool } from '../data/tools'
import { links } from '../lib/links'

function buildHref(category: CategoryId | null, query: string) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (query) params.set('q', query)
  const search = params.toString()
  return search ? `${links.tools}?${search}` : links.tools
}

function ToolCard({ tool }: { tool: Tool }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[18px] font-medium tracking-tight text-ink">{tool.name}</h3>
        {tool.status === 'planned' && (
          <span className="shrink-0 rounded-full bg-canvas px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200/70">
            Em breve
          </span>
        )}
      </div>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{tool.description}</p>
    </>
  )

  const cardClass = 'block h-full rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card'

  // A tool only becomes a link once it has a real route.
  if (tool.status === 'available' && tool.path) {
    return (
      <Link to={tool.path} className={`${cardClass} transition-colors hover:border-slate-300`}>
        {body}
      </Link>
    )
  }
  return <div className={cardClass}>{body}</div>
}

export default function ToolsPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const categoryParam = params.get('category')
  const category = isCategoryId(categoryParam) ? categoryParam : null

  const results = useMemo(() => searchTools(query, category), [query, category])
  const groups = useMemo(
    () =>
      categories
        .map((item) => ({ category: item, tools: results.filter((tool) => tool.categoryId === item.id) }))
        .filter((group) => group.tools.length > 0),
    [results],
  )

  function handleQueryChange(value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set('q', value)
    else next.delete('q')
    setParams(next, { replace: true })
  }

  return (
    <div className="px-3 pt-3 sm:px-6 sm:pt-6">
      <title>Todas as ferramentas — DevDrop</title>
      <meta
        name="description"
        content="Catálogo do DevDrop: ferramentas de desenvolvimento, geradores de dados, CSS, segurança, texto e calculadoras."
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-page px-2">
        <div className="pt-10 md:pt-16">
          <h1 className="font-display text-[36px] font-medium leading-[1.08] tracking-tight text-ink md:text-[52px]">Todas as ferramentas</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
            {tools.length} ferramentas em {categories.length} categorias. Todas funcionam direto no navegador, sem
            cadastro.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <form role="search" onSubmit={(event) => event.preventDefault()} className="max-w-xl">
            <SearchField
              label="Buscar ferramentas"
              placeholder="Buscar ferramenta: JSON, senha, CPF…"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
            />
          </form>
          <CategoryPills active={category} showAll hrefFor={(id) => buildHref(id, query)} />
        </div>

        <p aria-live="polite" className="mt-8 text-[13px] font-medium text-slate-500">
          {results.length === 1 ? '1 ferramenta' : `${results.length} ferramentas`}
          {query && <> para “{query}”</>}
        </p>

        {groups.length === 0 ? (
          <div className="mt-4 rounded-card border border-slate-200/60 bg-white p-8 text-center shadow-card sm:p-12">
            <p className="font-display text-[22px] font-medium tracking-tight text-ink">Nenhuma ferramenta encontrada</p>
            <p className="mt-2 text-[14px] text-muted">Tente outro termo ou veja o catálogo completo.</p>
            <Link
              to={links.tools}
              className="mt-6 inline-flex rounded-full bg-navy px-6 py-3 text-[14px] font-semibold text-white"
            >
              Limpar filtros
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-12">
            {groups.map(({ category: group, tools: groupTools }) => {
              const Icon = categoryIcons[group.id]
              return (
                <section key={group.id} aria-labelledby={`category-${group.id}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full border border-slate-200/70 bg-white text-ink">
                      <Icon aria-hidden="true" className="size-[18px]" />
                    </span>
                    <div>
                      <h2 id={`category-${group.id}`} className="font-display text-[22px] font-medium tracking-tight text-ink">
                        {group.name}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-2 text-[14px] text-muted">{group.description}</p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {groupTools.map((tool) => (
                      <li key={tool.id}>
                        <ToolCard tool={tool} />
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
