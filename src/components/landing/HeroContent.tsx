import { motion } from 'motion/react'
import { formatToolCount } from '../../data/tools'
import { links } from '../../lib/links'
import { ButtonLink } from '../ui/Button'

export function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 flex-1 px-6 sm:px-8 md:px-16 pt-10 sm:pt-12 md:pt-16 flex flex-col items-start"
    >
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-slate-600">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
        {formatToolCount()}
      </p>
      <h1 className="font-display text-balance text-[30px] leading-[1.1] sm:text-[42px] md:text-[56px] md:leading-[1.05] font-medium tracking-tight text-[#0a1b33]">
        Ferramentas rápidas <br className="hidden sm:block" />
        para tarefas do dia a dia
      </h1>
      <p className="mt-5 max-w-[460px] font-sans text-[14px] leading-relaxed md:text-[15px] text-[#64748b]">
        Formate JSON, XML e SQL, codifique Base64 e URL e decodifique JWT direto no navegador, sem enviar
        seus dados. Geradores, calculadoras e utilitários de texto e segurança estão a caminho.
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
