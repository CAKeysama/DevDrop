import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { links } from '../../lib/links'
import { ButtonLink } from '../ui/Button'
import { LogoMark } from '../ui/LogoMark'

/** Top bar for inner pages. The landing page uses the floating navbar inside the hero instead. */
export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-page items-center justify-between gap-2 px-2 py-2">
      <Link to="/" className="flex shrink-0 items-center gap-2 rounded-full pr-1 sm:gap-3 sm:pr-2">
        <LogoMark />
        <span className="font-display text-[17px] font-medium tracking-tight text-ink">DevDrop</span>
      </Link>
      <nav aria-label="Principal" className="flex min-w-0 items-center gap-1 sm:gap-2">
        <Link
          to="/tools"
          className="rounded-full px-2 py-1.5 text-[12px] font-semibold text-slate-500 transition-colors hover:text-ink sm:px-3"
        >
          Ferramentas
        </Link>
        <a
          href={links.docs}
          target="_blank"
          rel="noreferrer"
          className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-slate-500 transition-colors hover:text-ink max-sm:hidden"
        >
          Docs<span className="sr-only"> (abre em nova aba)</span>
        </a>
        <ButtonLink href={links.repo} variant="surface" size="sm" className="max-sm:px-3.5">
          GitHub
          <ChevronRight aria-hidden="true" className="size-3.5" />
        </ButtonLink>
      </nav>
    </header>
  )
}
