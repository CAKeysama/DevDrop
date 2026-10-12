import { memo } from 'react'
import { Link } from 'react-router-dom'
import { getCategory, getShowcaseTools, getToolHref, type CategoryId, type Tool } from '../../data/tools'
import { cn } from '../../lib/cn'
import { ToolIcon } from '../tools/ToolIcon'
import { surfacePill } from '../ui/styles'

/** Hover gradient per category. */
const gradients: Record<CategoryId, string> = {
  developer: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  security: 'linear-gradient(135deg, #10b981, #0f766e)',
  text: 'linear-gradient(135deg, #a855f7, #6d28d9)',
  calculators: 'linear-gradient(135deg, #f59e0b, #ea580c)',
  data: 'linear-gradient(135deg, #f43f5e, #be123c)',
  css: 'linear-gradient(135deg, #06b6d4, #0e7490)',
}

function MarqueeCard({ tool, duplicate }: { tool: Tool; duplicate: boolean }) {
  const category = getCategory(tool.categoryId)

  return (
    <li className="shrink-0">
      <Link
        to={getToolHref(tool)}
        tabIndex={duplicate ? -1 : undefined}
        className={cn(
          'group relative flex h-24 items-center gap-4 overflow-hidden pl-5 pr-8 -outline-offset-2',
          surfacePill,
        )}
      >
        <span
          aria-hidden="true"
          style={{ backgroundImage: gradients[tool.categoryId] }}
          className="absolute inset-0 scale-[1.5] opacity-0 transition-[opacity,scale] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
        />
        <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-slate-200/70 bg-canvas text-ink transition-colors duration-300 group-hover:border-snow/30 group-hover:bg-snow/15 group-hover:text-snow">
          <ToolIcon toolId={tool.id} className="size-5 transition-transform duration-300 group-hover:scale-110" />
        </span>
        <span className="relative flex flex-col whitespace-nowrap">
          <span className="text-[14px] font-semibold text-ink transition-colors duration-300 group-hover:text-snow">
            {tool.name}
          </span>
          <span className="text-[12px] font-medium text-subtle transition-colors duration-300 group-hover:text-snow/75">
            {category.name}
          </span>
        </span>
      </Link>
    </li>
  )
}

function MarqueeList({ tools, duplicate = false }: { tools: Tool[]; duplicate?: boolean }) {
  return (
    <ul aria-hidden={duplicate || undefined} className="flex shrink-0 gap-4 pr-4">
      {tools.map((tool) => (
        <MarqueeCard key={tool.id} tool={tool} duplicate={duplicate} />
      ))}
    </ul>
  )
}

/**
 * Infinite tool showcase. Movement is a CSS @keyframes animation (see `.marquee` in
 * styles/index.css): the list is rendered twice and the track slides from 0 to -50%.
 * Content comes from the tool registry; the component is static, so it never re-renders
 * while moving.
 */
export const Marquee = memo(function Marquee() {
  const tools = getShowcaseTools()

  return (
    <section aria-label="Ferramentas em destaque" className="marquee mt-10 w-full max-w-page mx-auto py-1">
      <div className="marquee-track">
        <MarqueeList tools={tools} />
        <MarqueeList tools={tools} duplicate />
      </div>
    </section>
  )
})
