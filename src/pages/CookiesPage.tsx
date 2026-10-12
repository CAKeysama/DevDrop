import { useEffect, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { LegalPage, type LegalSection } from '../components/layout/LegalPage'
import { ActionButton } from '../components/tools/shared/ActionButton'
import { links } from '../lib/links'
import { clearThemePreference, hasStoredTheme, subscribeTheme, THEME_STORAGE_KEY } from '../lib/theme'

/*
 * Keep this page true to the code: DevDrop sets no cookies and stores one localStorage key,
 * THEME_STORAGE_KEY (lib/theme.ts). Anything new stored in the browser goes in the list
 * below in the same change — and, if it is not strictly needed, behind consent.
 */

const external = { target: '_blank', rel: 'noreferrer' } as const

/** The stored theme, with a way to forget it right here. */
function ThemePreferenceControl() {
  const [stored, setStored] = useState(hasStoredTheme)

  // Stays right when the header toggle saves a theme while this page is open.
  useEffect(() => subscribeTheme((_, isStored) => flushSync(() => setStored(isStored))), [])

  if (!stored) {
    return (
      <p role="status" className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-emerald-700">
        <Check aria-hidden="true" className="size-4" />
        Nada guardado: o tema segue o do seu sistema.
      </p>
    )
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <ActionButton onClick={clearThemePreference}>Esquecer minha preferência de tema</ActionButton>
      <span className="text-[13px] text-muted">O tema volta a seguir o do seu sistema.</span>
    </div>
  )
}

/** One stored item, as a labelled card: reads better than a table on a phone. */
function StoredItem() {
  const rows: Array<[string, ReactNode]> = [
    ['Nome', <code key="name">{THEME_STORAGE_KEY}</code>],
    ['Tipo', 'localStorage (armazenamento local do navegador), não é um cookie'],
    ['Finalidade', 'Lembrar se você escolheu o tema claro ou o escuro'],
    ['Conteúdo', <><code>light</code> ou <code>dark</code>, nada além disso</>],
    ['Quando é criado', 'Só quando você clica no botão de tema'],
    ['Duração', 'Até você apagar, aqui ou limpando os dados do site no navegador'],
    ['Enviado a alguém?', 'Não. Fica só no seu dispositivo'],
  ]

  return (
    <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5">
      <dl className="grid gap-x-6 gap-y-3 text-[14px] sm:grid-cols-[150px_minmax(0,1fr)]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-semibold text-ink">{label}</dt>
            <dd className="text-slate-700 max-sm:-mt-2">{value}</dd>
          </div>
        ))}
      </dl>
      <ThemePreferenceControl />
    </div>
  )
}

const sections: LegalSection[] = [
  {
    id: 'o-que-sao',
    title: 'O que são cookies',
    content: (
      <p>
        Cookies são pequenos arquivos que um site grava no seu navegador e que voltam ao servidor a cada visita. Eles são
        usados para manter login, lembrar preferências, medir audiência ou mostrar anúncios. Tecnologias parecidas, como o{' '}
        <code>localStorage</code>, guardam informações no navegador sem enviá-las ao servidor.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies que o DevDrop usa',
    content: (
      <>
        <p>
          <strong>Nenhum.</strong> O DevDrop não grava cookies: nem próprios, nem de terceiros, nem de análise, nem de
          publicidade. Fontes, imagens e o vídeo da página inicial vêm do próprio site.
        </p>
        <p>
          As estatísticas de visitas (Vercel Web Analytics) também funcionam sem cookies e sem guardar nada no seu
          navegador. Como elas contam visitas de forma anônima, estão descritas na{' '}
          <Link to={`${links.privacy}#estatisticas`}>Política de Privacidade</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'armazenamento-local',
    title: 'O que guardamos no seu navegador',
    content: (
      <>
        <p>Uma única informação, e só se você escolher um tema:</p>
        <StoredItem />
      </>
    ),
  },
  {
    id: 'consentimento',
    title: 'Por que não há aviso de cookies',
    content: (
      <p>
        Avisos de consentimento existem para cookies que não são necessários ao site, como os de análise e de publicidade.
        O DevDrop não usa nenhum: até as estatísticas de visitas funcionam sem cookies. O único item guardado é uma preferência que você mesmo cria ao clicar no botão de tema,
        que fica só no seu dispositivo e que você pode apagar acima a qualquer momento.
      </p>
    ),
  },
  {
    id: 'terceiros',
    title: 'Sites de terceiros',
    content: (
      <p>
        Links para o GitHub (repositório, documentação e sugestões) levam a um site com cookies próprios, regidos pela{' '}
        <a href="https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement" {...external}>
          política de privacidade do GitHub
        </a>
        .
      </p>
    ),
  },
  {
    id: 'como-controlar',
    title: 'Como controlar pelo navegador',
    content: (
      <p>
        Além do botão acima, você pode apagar tudo o que um site guardou nas configurações de privacidade do seu navegador
        (em geral, em "Cookies e dados do site"), e também bloquear cookies de todos os sites. O DevDrop funciona
        normalmente com tudo bloqueado: só não vai lembrar o seu tema.
      </p>
    ),
  },
  {
    id: 'alteracoes',
    title: 'Alterações nesta política',
    content: (
      <p>
        Se um dia o DevDrop precisar de cookies ou de outro armazenamento que não seja essencial, esta página será
        atualizada antes, e pediremos o seu consentimento quando a lei exigir. Para dúvidas, veja os contatos na{' '}
        <Link to={links.privacy}>Política de Privacidade</Link>.
      </p>
    ),
  },
]

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de Cookies"
      description="O DevDrop não usa cookies. Saiba o que fica guardado no seu navegador e como apagar."
      updated="12 de outubro de 2026"
      summary={
        <ul>
          <li>
            <strong>O DevDrop não usa cookies.</strong> Nenhum de análise, publicidade ou terceiros.
          </li>
          <li>
            Só guardamos no seu navegador o tema que você escolher (claro ou escuro), e você pode apagar isso{' '}
            <a href="#armazenamento-local">nesta página</a>.
          </li>
          <li>Por isso não há aviso de consentimento: não há nada a consentir.</li>
        </ul>
      }
      sections={sections}
    />
  )
}
