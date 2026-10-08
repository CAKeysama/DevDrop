import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/layout/SiteHeader'
import { ButtonLink } from '../components/ui/Button'
import { links } from '../lib/links'

export default function NotFoundPage() {
  return (
    <div className="px-3 pt-3 sm:px-6 sm:pt-6">
      <title>Página não encontrada — DevDrop</title>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-page flex-col items-start px-2 py-24">
        <h1 className="font-display text-[40px] font-medium tracking-tight text-ink md:text-[56px]">Página não encontrada</h1>
        <p className="mt-3 text-[15px] text-muted">Este endereço não existe. As ferramentas estão a um clique.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={links.tools}>Ver ferramentas</ButtonLink>
          <ButtonLink href="/" variant="surface" className="px-6 py-3 text-[14px]">
            Voltar ao início
          </ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
