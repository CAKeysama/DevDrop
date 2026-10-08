import { SiteFooter } from '../components/layout/SiteFooter'
import { ClosingCta } from '../components/landing/ClosingCta'
import { Hero } from '../components/landing/Hero'
import { Marquee } from '../components/landing/Marquee'
import { ToolsBento } from '../components/landing/ToolsBento'

export default function LandingPage() {
  return (
    <div className="px-3 pt-3 sm:px-6 sm:pt-6">
      <title>DevDrop — Utilitários online para desenvolvedores e para o dia a dia</title>
      <Hero />
      <main>
        <Marquee />
        <ToolsBento />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  )
}
