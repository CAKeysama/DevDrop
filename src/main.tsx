import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/bricolage-grotesque/wght.css'
import './styles/index.css'
import App from './App'
import { reloadForNewVersion } from './lib/staleBuild'

// A page chunk from a previous deploy failed to load: reload once to get the current build.
// preventDefault keeps Vite from throwing; if it already reloaded, the error reaches
// AppErrorBoundary, which shows a message instead of a blank page.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadForNewVersion()) event.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
