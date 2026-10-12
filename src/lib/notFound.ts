import { getShowcaseTools, searchTools, type Tool } from '../data/tools'

const MAX_SUGGESTIONS = 3

/**
 * The words a visitor typed in a missing address: "/tools/gerador_de_senha" becomes
 * "gerador de senha". Malformed escapes are kept as typed instead of throwing.
 */
export function readMissingPath(pathname: string): string {
  let path = pathname
  try {
    path = decodeURIComponent(pathname)
  } catch {
    // keep it as typed
  }
  return path
    .toLowerCase()
    .replace(/^\/?tools\//, '/')
    .replace(/\.[a-z0-9]+$/, '')
    .split(/[\s/_.-]+/)
    .filter(Boolean)
    .join(' ')
}

/** Tools the missing address probably meant; the showcase when it points at nothing. */
export function suggestTools(pathname: string): { matched: boolean; tools: Tool[] } {
  const query = readMissingPath(pathname)
  const found = query ? searchTools(query) : []
  if (found.length > 0) return { matched: true, tools: found.slice(0, MAX_SUGGESTIONS) }
  return { matched: false, tools: getShowcaseTools().slice(0, MAX_SUGGESTIONS) }
}
