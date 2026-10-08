import { FloatingNavbar } from './FloatingNavbar'
import { HeroContent } from './HeroContent'
import { HeroVideo } from './HeroVideo'

export function Hero() {
  return (
    <header className="relative w-full max-w-[1400px] mx-auto rounded-[32px] md:rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[540px] md:h-[600px] flex flex-col">
      <HeroVideo />
      <HeroContent />
      <FloatingNavbar />
    </header>
  )
}
