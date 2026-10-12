/** Every external destination used by the UI. All of them are real. */
export const REPO_URL = 'https://github.com/CAKeysama/DevDrop'

export const links = {
  repo: REPO_URL,
  docs: `${REPO_URL}#readme`,
  /** Issue form in .github/ISSUE_TEMPLATE: each suggestion arrives labelled and structured. */
  suggest: `${REPO_URL}/issues/new?template=sugestao-de-ferramenta.yml`,
  /** Where privacy requests go (LGPD rights). Swap for an e-mail once the project has one. */
  privacyContact: `${REPO_URL}/issues/new?template=privacidade.yml`,
  tools: '/tools',
  privacy: '/privacidade',
  cookies: '/cookies',
} as const

export function categoryHref(categoryId: string) {
  return `/tools?category=${encodeURIComponent(categoryId)}`
}
