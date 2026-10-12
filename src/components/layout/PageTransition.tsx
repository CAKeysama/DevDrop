import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Fades each page in when the route changes (see `.page-enter` in styles/index.css).
 * Keyed by pathname only: typing in the catalog changes the query string, not the page,
 * so it never replays. A CSS animation rather than Motion because it plays while the next
 * page's chunk is loading, and CSS keeps running off the main thread.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  )
}
