/** Every external destination used by the UI. All of them are real. */
export const REPO_URL = 'https://github.com/CAKeysama/DevDrop'

export const links = {
  repo: REPO_URL,
  docs: `${REPO_URL}#readme`,
  suggest: `${REPO_URL}/issues/new`,
  /** Where privacy requests go (LGPD rights). Swap for an e-mail once the project has one. */
  privacyContact: `${REPO_URL}/issues/new`,
  tools: '/tools',
  privacy: '/privacidade',
  cookies: '/cookies',
} as const

export function categoryHref(categoryId: string) {
  return `/tools?category=${encodeURIComponent(categoryId)}`
}
