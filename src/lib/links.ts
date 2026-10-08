/** Every external destination used by the UI. All of them are real. */
export const REPO_URL = 'https://github.com/CAKeysama/DevDrop'

export const links = {
  repo: REPO_URL,
  docs: `${REPO_URL}#readme`,
  suggest: `${REPO_URL}/issues/new`,
  tools: '/tools',
} as const

export function categoryHref(categoryId: string) {
  return `/tools?category=${encodeURIComponent(categoryId)}`
}
