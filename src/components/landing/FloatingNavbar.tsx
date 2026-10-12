import { ChevronRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { links } from '../../lib/links'
import { cn } from '../../lib/cn'
import { LogoMark } from '../ui/LogoMark'
import { ThemeToggle } from '../ui/ThemeToggle'
import { surfacePill } from '../ui/styles'

const navLink =
  'rounded-full px-3 sm:px-4 py-2 text-[12px] font-semibold text-slate-500 hover:text-ink transition-colors'

export function FloatingNavbar() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30">
      <motion.nav
        aria-label="Principal"
        // Transform string so the entrance survives the busy first load (see HeroContent).
        initial={{ opacity: 0, transform: reduceMotion ? 'none' : 'translateY(20px)' }}
        animate={{ opacity: 1, transform: reduceMotion ? 'none' : 'translateY(0px)' }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40"
      >
        <Link to="/" aria-label="DevDrop, página inicial" className="rounded-full">
          <LogoMark />
        </Link>
        <div className="flex items-center px-1 sm:px-2">
          <Link to={links.tools} className={navLink}>
            Ferramentas
          </Link>
          {/* Hidden on phones to make room for the theme toggle: the categories are the next
              section down, and the hero's "Ver categorias" button is hidden there too. */}
          <Link to="/#tools" className={cn(navLink, 'hidden sm:block')}>
            Categorias
          </Link>
          <a href={links.docs} target="_blank" rel="noreferrer" className={cn(navLink, 'hidden sm:block')}>
            Docs<span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
        <ThemeToggle className="mr-1.5" />
        <a
          href={links.repo}
          target="_blank"
          rel="noreferrer"
          className={cn(
            surfacePill,
            'flex items-center gap-1 whitespace-nowrap px-5 py-2 text-[12px] font-semibold text-ink',
          )}
        >
          GitHub
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </motion.nav>
    </div>
  )
}
