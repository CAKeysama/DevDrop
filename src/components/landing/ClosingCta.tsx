import { ArrowUpRight } from 'lucide-react'
import { links } from '../../lib/links'
import { ButtonLink } from '../ui/Button'

export function ClosingCta() {
  return (
    <section aria-labelledby="cta-heading" className="mx-auto mt-4 w-full max-w-page">
      <div className="flex flex-col items-start gap-6 rounded-card border border-slate-200/60 bg-white p-6 shadow-card sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="cta-heading" className="font-display text-[26px] font-medium tracking-tight text-ink md:text-[32px]">
            Não achou o que procurava?
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
            Veja o catálogo completo ou sugira a próxima ferramenta no GitHub.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={links.tools}>Ver todas as ferramentas</ButtonLink>
          <ButtonLink href={links.suggest} variant="surface" className="px-6 py-3 text-[14px]">
            Sugerir ferramenta
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
