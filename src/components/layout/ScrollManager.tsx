import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Restores scroll on navigation: top of the page, or the element named by the hash. */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
