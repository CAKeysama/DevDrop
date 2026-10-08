import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { cn } from '../../lib/cn'
import { surfacePill } from './styles'

const MotionLink = motion.create(Link)

type Variant = 'primary' | 'surface'
type Size = 'sm' | 'md'

const base = 'inline-flex items-center justify-center gap-1.5 font-semibold whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary: 'bg-[#0a152d] text-white rounded-full',
  surface: cn(surfacePill, 'text-[#0a1b33]'),
}

const sizes: Record<Size, string> = {
  sm: 'px-5 py-2 text-[12px]',
  md: 'px-6 py-3 text-[14px]',
}

const hover = { scale: 1.03 }
const tap = { scale: 0.98 }
const spring = { type: 'spring', stiffness: 400, damping: 26 } as const

interface ButtonLinkProps {
  /** Internal route (`/tools`, `/#tools`) or absolute URL. Absolute URLs open in a new tab. */
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

/** Pill button rendered as a link. The only button primitive of the Design System. */
export function ButtonLink({ href, variant = 'primary', size = 'md', className, children }: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (/^https?:\/\//.test(href)) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes}
        whileHover={hover}
        whileTap={tap}
        transition={spring}
      >
        {children}
        <span className="sr-only"> (abre em nova aba)</span>
      </motion.a>
    )
  }

  return (
    <MotionLink to={href} className={classes} whileHover={hover} whileTap={tap} transition={spring}>
      {children}
    </MotionLink>
  )
}
