import { categories, formatToolCount, type CategoryId } from '../../data/tools'
import { CategoryPills } from '../tools/CategoryPills'
import { ToolCategoryCard } from './ToolCategoryCard'
import { ToolSearch } from './ToolSearch'

/** Placement of each category in the 6-column grid. Categories come from the registry. */
const layout: Record<CategoryId, { className: string; featured?: boolean; wide?: boolean }> = {
  developer: { className: 'md:col-span-2 lg:col-span-4 lg:row-span-2', featured: true },
  security: { className: 'lg:col-span-2' },
  text: { className: 'lg:col-span-2' },
  calculators: { className: 'lg:col-span-2' },
  data: { className: 'lg:col-span-4' },
  css: { className: 'md:col-span-2 lg:col-span-6', wide: true },
}

export function ToolsBento() {
  return (
    <section id="tools" aria-labelledby="tools-heading" className="mx-auto mt-16 w-full max-w-page scroll-mt-6 md:mt-24">
      <div className="grid gap-8 px-2 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Caixa de ferramentas</p>
          <h2 id="tools-heading" className="mt-3 font-display text-[32px] font-medium leading-[1.1] tracking-tight text-ink md:text-[44px]">
            Um só lugar para os utilitários
            <br className="hidden sm:block" /> que você usa todo dia
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
            Busque pelo nome ou escolha uma categoria. Hoje são {formatToolCount()}: as que estão em breve abrem por aqui
            assim que forem publicadas.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <ToolSearch />
          <CategoryPills />
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {categories.map((category) => (
          <ToolCategoryCard key={category.id} category={category} {...layout[category.id]} />
        ))}
      </div>
    </section>
  )
}
