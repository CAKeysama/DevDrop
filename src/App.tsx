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
const PasswordGeneratorPage = lazy(() => import('./pages/tools/PasswordGeneratorPage'))
const PasswordStrengthPage = lazy(() => import('./pages/tools/PasswordStrengthPage'))
const CharacterCounterPage = lazy(() => import('./pages/tools/CharacterCounterPage'))
const WordCounterPage = lazy(() => import('./pages/tools/WordCounterPage'))
const CaseConverterPage = lazy(() => import('./pages/tools/CaseConverterPage'))
const PercentagePage = lazy(() => import('./pages/tools/PercentagePage'))
const RuleOfThreePage = lazy(() => import('./pages/tools/RuleOfThreePage'))
const UuidGeneratorPage = lazy(() => import('./pages/tools/UuidGeneratorPage'))
const LoremIpsumPage = lazy(() => import('./pages/tools/LoremIpsumPage'))
const HashGeneratorPage = lazy(() => import('./pages/tools/HashGeneratorPage'))
const CpfPage = lazy(() => import('./pages/tools/CpfPage'))
const CnpjPage = lazy(() => import('./pages/tools/CnpjPage'))
const CssShadowPage = lazy(() => import('./pages/tools/CssShadowPage'))
const CssGradientPage = lazy(() => import('./pages/tools/CssGradientPage'))
const CssBorderPage = lazy(() => import('./pages/tools/CssBorderPage'))

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
            <Route path="/tools/password-generator" element={<PasswordGeneratorPage />} />
            <Route path="/tools/password-strength" element={<PasswordStrengthPage />} />
            <Route path="/tools/character-counter" element={<CharacterCounterPage />} />
            <Route path="/tools/word-counter" element={<WordCounterPage />} />
            <Route path="/tools/case-converter" element={<CaseConverterPage />} />
            <Route path="/tools/percentage" element={<PercentagePage />} />
            <Route path="/tools/rule-of-three" element={<RuleOfThreePage />} />
            <Route path="/tools/uuid" element={<UuidGeneratorPage />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsumPage />} />
            <Route path="/tools/hash-generator" element={<HashGeneratorPage />} />
            <Route path="/tools/cpf" element={<CpfPage />} />
            <Route path="/tools/cnpj" element={<CnpjPage />} />
            <Route path="/tools/css-shadow" element={<CssShadowPage />} />
            <Route path="/tools/css-gradient" element={<CssGradientPage />} />
            <Route path="/tools/css-border" element={<CssBorderPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MotionConfig>
  )
}
