import { Link } from 'react-router-dom'
import { categories, type CategoryId } from '../../data/tools'
import { categoryHref, links } from '../../lib/links'
import { cn } from '../../lib/cn'
import { chip } from '../ui/styles'
import { categoryIcons } from './categoryIcons'

interface CategoryPillsProps {
  /** Currently selected category; enables the "All" pill and the pressed state. */
  active?: CategoryId | null
  showAll?: boolean
  /** Builds the destination of each pill. Defaults to the catalog filtered by category. */
  hrefFor?: (id: CategoryId | null) => string
  className?: string
}

const idle = 'border-slate-200/70 bg-white text-slate-600 hover:border-slate-300 hover:text-ink'
const selected = 'border-navy bg-navy text-white'

/** Quick access to the catalog by category. */
export function CategoryPills({ active = null, showAll = false, hrefFor, className }: CategoryPillsProps) {
  const href = hrefFor ?? ((id) => (id ? categoryHref(id) : links.tools))

  return (
    <nav aria-label="Categorias de ferramentas" className={className}>
      <ul className="flex flex-wrap gap-2">
        {showAll && (
          <li>
            <Link to={href(null)} aria-current={active === null ? 'true' : undefined} className={cn(chip, 'py-2', active === null ? selected : idle)}>
              Todas
            </Link>
          </li>
        )}
        {categories.map((category) => {
          const Icon = categoryIcons[category.id]
          const isActive = active === category.id
          return (
            <li key={category.id}>
              <Link
                to={href(category.id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(chip, 'gap-1.5 py-2', isActive ? selected : idle)}
              >
                <Icon aria-hidden="true" className="size-3.5" />
                {category.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
