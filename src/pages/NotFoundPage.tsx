import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'
import { ToolSearch } from '../components/landing/ToolSearch'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/layout/SiteHeader'
import { ToolIcon } from '../components/tools/ToolIcon'
import { ButtonLink } from '../components/ui/Button'
import { getToolHref } from '../data/tools'
import { cn } from '../lib/cn'
import { links } from '../lib/links'
import { suggestTools } from '../lib/notFound'

/** Stagger slot for the `.rise` entrance (styles/index.css). */
function rise(delay: number, from?: number): CSSProperties {
  return { '--rise-delay': `${delay}ms`, ...(from !== undefined && { '--rise-from': `${from}px` }) } as CSSProperties
}

/**
 * The numeral follows the pointer, each digit at its own depth, through a spring so it
 * trails the hand instead of being glued to it. Decorative, so only where there is a real
 * pointer and motion is welcome. Values go through motion values: no re-render per move.
 */
function usePointerParallax() {
  const reduceMotion = useReducedMotion()
  const finePointer = typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const enabled = finePointer && !reduceMotion

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const spring = { stiffness: 120, damping: 18, mass: 0.6 }
  const x = useSpring(pointerX, spring)
  const y = useSpring(pointerY, spring)

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - box.left) / box.width - 0.5) * 2)
    pointerY.set(((event.clientY - box.top) / box.height - 0.5) * 2)
  }

  function onPointerLeave() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return { x, y, handlers: enabled ? { onPointerMove, onPointerLeave } : {} }
}

interface DigitProps {
  children: ReactNode
  depth: number
  delay: number
  pointer: { x: MotionValue<number>; y: MotionValue<number> }
  hollow?: boolean
}

/** Three nested layers, one transform each: pointer depth, entrance, idle float. */
function Digit({ children, depth, delay, pointer, hollow = false }: DigitProps) {
  const x = useTransform(pointer.x, (value) => value * depth)
  const y = useTransform(pointer.y, (value) => value * depth)

  return (
    <motion.span style={{ x, y }} className="inline-block">
      <span className="rise inline-block" style={rise(delay, 36)}>
        <span
          className={cn(
            'inline-block',
            hollow && 'bob text-transparent [-webkit-text-stroke:2px_var(--color-ink)] md:[-webkit-text-stroke:3px_var(--color-ink)]',
          )}
        >
          {children}
        </span>
      </span>
    </motion.span>
  )
}

const keyClass = 'text-sky-300'
const stringClass = 'text-emerald-300'

export default function NotFoundPage() {
  const { pathname } = useLocation()
  const { x, y, handlers } = usePointerParallax()
  const suggestion = suggestTools(pathname)
  const host = typeof window === 'undefined' ? 'devdrop' : window.location.host

  // The failed request, as a terminal would show it. Each line rises after the numeral.
  const terminal: ReactNode[] = [
    <>
      <span className="text-emerald-300">$</span> curl {host}
      <span className="text-white">{pathname}</span>
    </>,
    <span className="font-semibold text-rose-300">HTTP/1.1 404 Not Found</span>,
    '{',
    <>
      {'  '}
      <span className={keyClass}>"erro"</span>: <span className={stringClass}>"página não encontrada"</span>,
    </>,
    <>
      {'  '}
      <span className={keyClass}>"caminho"</span>: <span className={stringClass}>"{pathname}"</span>,
    </>,
    <>
      {'  '}
      <span className={keyClass}>"dica"</span>:{' '}
      <span className={stringClass}>"{suggestion.matched ? 'veja as sugestões abaixo' : 'use a busca abaixo'}"</span>
    </>,
    '}',
  ]
  const terminalStart = 420
  const terminalStep = 80
  const suggestionsStart = terminalStart + terminal.length * terminalStep

  return (
    <div className="px-3 pt-3 sm:px-6 sm:pt-6">
      <title>Página não encontrada — DevDrop</title>
      <meta name="robots" content="noindex" />
      <SiteHeader />

      <main {...handlers} className="mx-auto w-full max-w-page px-2 pt-10 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <section aria-labelledby="not-found-title">
            <p
              aria-hidden="true"
              className="select-none font-display text-[112px] font-medium leading-none tracking-tighter text-ink sm:text-[160px] md:text-[200px]"
            >
              <Digit depth={10} delay={0} pointer={{ x, y }}>
                4
              </Digit>
              <Digit depth={-18} delay={90} pointer={{ x, y }} hollow>
                0
              </Digit>
              <Digit depth={10} delay={180} pointer={{ x, y }}>
                4
              </Digit>
            </p>
            <h1
              id="not-found-title"
              className="rise mt-4 font-display text-[32px] font-medium leading-[1.1] tracking-tight text-ink md:text-[44px]"
              style={rise(260)}
            >
              Esta página não existe
            </h1>
            <p className="rise mt-3 max-w-md text-[15px] leading-relaxed text-muted" style={rise(320)}>
              O endereço pode ter mudado ou ter sido digitado errado. As ferramentas continuam a um clique.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={rise(380)}>
              <ButtonLink href={links.tools}>Ver ferramentas</ButtonLink>
              <ButtonLink href="/" variant="surface" className="px-6 py-3 text-[14px]">
                Voltar ao início
              </ButtonLink>
            </div>
          </section>

          {/* Same navy panel as the featured category card, in both themes. */}
          <div
            aria-hidden="true"
            className="rise palette-light rounded-card border border-navy bg-navy p-6 shadow-card sm:p-8"
            style={rise(terminalStart - 120, 20)}
          >
            <div className="mb-5 flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
            </div>
            <pre className="whitespace-pre-wrap break-all font-mono text-[12px] leading-7 text-white/70 sm:text-[13px]">
              {terminal.map((line, index) => (
                <span key={index} className="rise block" style={rise(terminalStart + index * terminalStep, 6)}>
                  {line}
                </span>
              ))}
              <span className="rise block" style={rise(suggestionsStart, 6)}>
                <span className="text-emerald-300">$</span>{' '}
                <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-white/70" />
              </span>
            </pre>
          </div>
        </div>

        <section aria-labelledby="suggestions-title" className="mt-16 md:mt-24">
          <h2
            id="suggestions-title"
            className="rise font-display text-[22px] font-medium tracking-tight text-ink"
            style={rise(suggestionsStart)}
          >
            {suggestion.matched ? 'Você quis dizer?' : 'Ferramentas mais usadas'}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestion.tools.map((tool, index) => (
              <li key={tool.id} className="rise" style={rise(suggestionsStart + 60 + index * 60, 10)}>
                <Link
                  to={getToolHref(tool)}
                  className="group flex h-full items-start justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-card transition-colors hover:border-slate-300"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 group-hover:text-ink">
                      <ToolIcon toolId={tool.id} className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-[14px] font-semibold text-ink">{tool.name}</h3>
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-muted">{tool.description}</p>
                    </div>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="rise mt-8 max-w-xl" style={rise(suggestionsStart + 260)}>
            <p className="mb-3 text-[13px] font-medium text-muted">Ou procure pelo nome:</p>
            <ToolSearch />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
