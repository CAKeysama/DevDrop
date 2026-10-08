import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { ScrollManager } from './components/layout/ScrollManager'
import LandingPage from './pages/LandingPage'

// Secondary routes are split out so the landing page ships the minimum JavaScript.
const ToolsPage = lazy(() => import('./pages/ToolsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const JsonFormatterPage = lazy(() => import('./pages/tools/JsonFormatterPage'))
const XmlFormatterPage = lazy(() => import('./pages/tools/XmlFormatterPage'))
const SqlFormatterPage = lazy(() => import('./pages/tools/SqlFormatterPage'))
const Base64Page = lazy(() => import('./pages/tools/Base64Page'))
const UrlEncoderPage = lazy(() => import('./pages/tools/UrlEncoderPage'))
const JwtDecoderPage = lazy(() => import('./pages/tools/JwtDecoderPage'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollManager />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/json-formatter" element={<JsonFormatterPage />} />
            <Route path="/tools/xml-formatter" element={<XmlFormatterPage />} />
            <Route path="/tools/sql-formatter" element={<SqlFormatterPage />} />
            <Route path="/tools/base64" element={<Base64Page />} />
            <Route path="/tools/url-encoder" element={<UrlEncoderPage />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoderPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MotionConfig>
  )
}
