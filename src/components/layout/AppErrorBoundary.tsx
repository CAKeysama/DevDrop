import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RotateCw } from 'lucide-react'
import { isChunkLoadError, reloadForNewVersion } from '../../lib/staleBuild'
import { ActionButton } from '../tools/shared/ActionButton'
import { ButtonLink } from '../ui/Button'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

interface State {
  error: Error | null
}

/**
 * Last line of defence: a page that throws shows this screen instead of a blank one.
 * Mounted per page (inside PageTransition, keyed by path), so navigating away clears it.
 */
export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // A chunk from a previous deploy: reload once to get the current one.
    if (isChunkLoadError(error) && reloadForNewVersion()) return
    console.error(error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const outdated = isChunkLoadError(error)
    return (
      <div className="px-3 pt-3 sm:px-6 sm:pt-6">
        <title>Algo deu errado — DevDrop</title>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-page flex-col items-start px-2 py-24">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            {outdated ? 'Nova versão disponível' : 'Erro inesperado'}
          </p>
          <h1 className="mt-3 font-display text-[36px] font-medium leading-[1.08] tracking-tight text-ink md:text-[52px]">
            {outdated ? 'O DevDrop foi atualizado' : 'Algo deu errado nesta página'}
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
            {outdated
              ? 'Esta aba ainda estava com a versão anterior. Recarregue para usar a nova.'
              : 'Recarregue para tentar de novo. Se continuar, avise a gente pelo GitHub.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionButton variant="primary" onClick={() => window.location.reload()} className="px-6 py-3 text-[14px]">
              <RotateCw aria-hidden="true" />
              Recarregar a página
            </ActionButton>
            <ButtonLink href="/" variant="surface" className="px-6 py-3 text-[14px]">
              Voltar ao início
            </ButtonLink>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }
}
