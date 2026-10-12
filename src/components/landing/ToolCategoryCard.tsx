import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { formatToolCount, getToolHref, getToolsByCategory, type Category } from '../../data/tools'
import { splitChips } from '../../lib/chips'
import { categoryHref } from '../../lib/links'
import { cn } from '../../lib/cn'
import { categoryIcons } from '../tools/categoryIcons'
import { chip } from '../ui/styles'
import { CategoryVisual } from './CategoryVisual'

interface ToolCategoryCardProps {
  category: Category
  /** Dark, dominant treatment for the lead card of the grid. */
  featured?: boolean
  /** Lays the card out as a wide band on large screens. */
  wide?: boolean
  className?: string
}

export function ToolCategoryCard({ category, featured = false, wide = false, className }: ToolCategoryCardProps) {
  const Icon = categoryIcons[category.id]
  const tools = getToolsByCategory(category.id)
  const { visible: visibleTools, hidden: hiddenCount } = splitChips(tools)

  return (
    <motion.article
      whileHover={{ scale: 1.008 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'group relative flex flex-col gap-6 rounded-card border p-6 shadow-card transition-colors sm:p-8',
        featured
          ? 'palette-light border-navy bg-navy text-white'
          : 'border-slate-200/60 bg-white text-ink hover:border-slate-300',
        wide && 'lg:flex-row lg:items-center lg:gap-12',
        className,
      )}
    >
      <div className={cn('flex flex-col', wide && 'lg:max-w-sm lg:shrink-0')}>
        <div className="flex items-center justify-between gap-4">
          <span
            className={cn(
              'flex size-11 items-center justify-center rounded-full border transition-transform duration-300 group-hover:-rotate-6',
              featured ? 'border-white/15 bg-white/10' : 'border-slate-200/70 bg-canvas',
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span className={cn('text-[12px] font-semibold', featured ? 'text-white/75' : 'text-muted')}>
            {formatToolCount(tools)}
          </span>
        </div>
        <h3 className={cn('mt-5 font-display font-medium tracking-tight', featured ? 'text-[28px] sm:text-[34px]' : 'text-[22px]')}>
          <Link
            to={categoryHref(category.id)}
            className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:ring-2 focus-visible:after:ring-ink focus-visible:after:ring-offset-2"
          >
            {category.name}
          </Link>
        </h3>
        <p className={cn('mt-2 max-w-md text-[14px] leading-relaxed', featured ? 'text-white/60' : 'text-muted')}>
          {category.description}
        </p>
      </div>

      <div className={cn('flex flex-1 flex-col justify-end gap-6', wide && 'lg:flex-row lg:items-center lg:justify-between')}>
        <div className={cn(featured && 'flex-1')}>
          <CategoryVisual id={category.id} />
        </div>

        <div className={cn('flex flex-col gap-5', wide && 'lg:items-end')}>
          <ul className={cn('flex flex-wrap gap-2', wide && 'lg:justify-end')}>
            {visibleTools.map((tool) => (
              <li key={tool.id}>
                {tool.status === 'available' ? (
                  <Link
                    to={getToolHref(tool)}
                    className={cn(
                      chip,
                      'relative z-10 font-semibold',
                      featured
                        ? 'border-white/40 bg-white/10 text-white hover:border-white hover:bg-white/15 focus-visible:outline-white'
                        : 'border-line-strong bg-white text-ink hover:border-ink',
                    )}
                  >
                    {tool.name}
                  </Link>
                ) : (
                  // Planned tools are not links: they say what is coming without promising a page.
                  <span
                    className={cn(
                      chip,
                      'relative gap-1.5 border-dashed',
                      featured ? 'border-white/25 text-white/75' : 'border-slate-300 bg-canvas text-muted',
                    )}
                  >
                    {tool.name}
                    <span className="text-[10px] font-semibold uppercase tracking-wide">· em breve</span>
                  </span>
                )}
              </li>
            ))}
            {hiddenCount > 0 && (
              <li>
                <Link
                  to={categoryHref(category.id)}
                  aria-label={`Ver mais ${hiddenCount} ferramentas em ${category.name}`}
                  className={cn(
                    chip,
                    'relative z-10 font-semibold',
                    featured
                      ? 'border-white/40 text-white hover:border-white hover:bg-white/15 focus-visible:outline-white'
                      : 'border-line-strong text-ink hover:border-ink',
                  )}
                >
                  +{hiddenCount}
                </Link>
              </li>
            )}
          </ul>
          <span aria-hidden="true" className={cn('inline-flex items-center gap-1.5 text-[13px] font-semibold', featured ? 'text-white' : 'text-ink')}>
            Ver categoria
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.article>
  )
}
