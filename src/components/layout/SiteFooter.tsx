import { Link } from 'react-router-dom'
import { links } from '../../lib/links'
import { LogoMark } from '../ui/LogoMark'

const linkClass = 'text-[13px] font-medium text-slate-500 transition-colors hover:text-ink'
const newTab = <span className="sr-only"> (abre em nova aba)</span>

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-page px-2 pb-10 md:mt-24">
      <div className="flex flex-col gap-6 border-t border-slate-200/70 pt-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link to="/" className="flex items-center gap-3 self-start rounded-full pr-2">
            <LogoMark />
            <span className="font-display text-[17px] font-medium tracking-tight text-ink">DevDrop</span>
          </Link>
          <p className="text-[13px] text-muted">Hub de utilitários online para quem programa e para o dia a dia.</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            <li>
              <Link to={links.tools} className={linkClass}>
                Ferramentas
              </Link>
            </li>
            <li>
              <a href={links.docs} target="_blank" rel="noreferrer" className={linkClass}>
                Documentação{newTab}
              </a>
            </li>
            <li>
              <a href={links.repo} target="_blank" rel="noreferrer" className={linkClass}>
                GitHub{newTab}
              </a>
            </li>
            <li>
              <a href={links.suggest} target="_blank" rel="noreferrer" className={linkClass}>
                Sugerir ferramenta{newTab}
              </a>
            </li>
            <li>
              <Link to={links.privacy} className={linkClass}>
                Privacidade
              </Link>
            </li>
            <li>
              <Link to={links.cookies} className={linkClass}>
                Cookies
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
