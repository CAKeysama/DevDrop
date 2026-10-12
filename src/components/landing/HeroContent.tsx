import { motion, useReducedMotion } from 'motion/react'
import { formatToolCount } from '../../data/tools'
import { links } from '../../lib/links'
import { ButtonLink } from '../ui/Button'

export function HeroContent() {
  const reduceMotion = useReducedMotion()

  return (
    // Full transform string, not `y`: it plays while the page is still loading (lazy chunks,
    // hero video), and only the string form can run off the main thread. MotionConfig's
    // reducedMotion does not cover it, hence the explicit check.
    <motion.div
      initial={{ opacity: 0, transform: reduceMotion ? 'none' : 'translateY(16px)' }}
      animate={{ opacity: 1, transform: reduceMotion ? 'none' : 'translateY(0px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 flex-1 px-6 sm:px-8 md:px-16 pt-10 sm:pt-12 md:pt-16 flex flex-col items-start"
    >
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-slate-600">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
        {formatToolCount()}
        <span className="hidden sm:inline">· tudo roda no seu navegador</span>
      </p>
      <h1 className="font-display text-balance text-[30px] leading-[1.1] sm:text-[42px] md:text-[56px] md:leading-[1.05] font-medium tracking-tight text-ink">
        Ferramentas rápidas <br className="hidden sm:block" />
        para tarefas do dia a dia
      </h1>
      <p className="mt-5 max-w-[460px] font-sans text-[14px] leading-relaxed md:text-[15px] text-muted">
        O DevDrop reúne em um só lugar formatadores, geradores, calculadoras e utilitários de texto e
        segurança. Para quem programa e para quem só precisa resolver algo rápido no navegador.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <ButtonLink href={links.tools}>Explorar ferramentas</ButtonLink>
        <ButtonLink href="/#tools" variant="surface" className="px-6 py-3 text-[14px] max-sm:hidden">
          Ver categorias
        </ButtonLink>
      </div>
    </motion.div>
  )
}
