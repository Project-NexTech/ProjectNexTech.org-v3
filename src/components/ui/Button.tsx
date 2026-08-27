import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '@/lib/cx'
import s from './Button.module.css'

/**
 * The one button in the system. Renders as a Next <Link>, an anchor, or a
 * <button> depending on which of `to` / `href` / `onClick` is supplied.
 *
 * Buttons outside the site chrome carry the custom redirect cursor; pass
 * `chrome` for navbar/footer/popup buttons that should keep the normal
 * pointer.
 *
 * NO 'use client' DIRECTIVE, deliberately. §2.4 called this component "the
 * awkward one" and offered marking it client or splitting it in two. Neither
 * is necessary: the component uses no hooks, so it compiles into whichever
 * graph imports it. A Server Component page gets the Link and anchor variants
 * with zero client JS; a Client Component parent pulls the same file into the
 * client bundle, where `onClick` works. Marking it client would drag every
 * page that renders a button into the client bundle for nothing.
 */

/* Lookup objects of module class names, keeping the prototype's exact shape —
   the component body is unchanged. */
const VARIANTS = {
  primary: s.primary,
  /* Same weight as `primary` but in PNT blue, for a secondary call to action
     sitting near an orange one. */
  alt: s.alt,
  secondary: s.secondary,
  ghost: s.ghost,
} as const

const SIZES = {
  sm: s.sm,
  md: s.md,
  lg: s.lg,
} as const

export type ButtonVariant = keyof typeof VARIANTS
export type ButtonSize = keyof typeof SIZES

interface CommonProps {
  children: ReactNode
  /** Internal destination. Renders a Next <Link>. */
  to?: string
  /** External destination. Renders an anchor with target="_blank". */
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  /** Site chrome (navbar, footer, Contact popup) keeps the normal pointer. */
  chrome?: boolean
  className?: string
}

export type ButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>

export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'secondary',
  size = 'md',
  chrome = false,
  className = '',
  ...rest
}: ButtonProps) {
  /* Orange cursor for destinations inside the site, blue for external ones.
     These two class names are global (globals.css) because they pair with the
     .link-internal / .link-external content-link treatment. */
  const cursor = chrome ? '' : href ? 'cursor-external' : 'cursor-internal'

  const classes = cx(s.root, VARIANTS[variant], SIZES[size], cursor, className)

  if (to) {
    return (
      <Link href={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes} {...rest}>
      {children}
    </button>
  )
}
