import { Braces, Calculator, Dices, Palette, ShieldCheck, Type, type LucideIcon } from 'lucide-react'
import type { CategoryId } from '../../data/tools'

export const categoryIcons: Record<CategoryId, LucideIcon> = {
  developer: Braces,
  security: ShieldCheck,
  text: Type,
  calculators: Calculator,
  data: Dices,
  css: Palette,
}
