import type { ReactNode } from 'react'

import { cx } from '@/lib/cx'
import Icon from './Icon'
import s from './Tag.module.css'

/**
 * Small label chip — materials lists, member roles, department badges,
 * course highlight tags. Mono type so tags read as metadata, not prose.
 *
 * Size stays a PROP rather than something callers override through
 * `className`. Under Tailwind that was a bug fix — both variants set a text
 * size and Tailwind resolves conflicting utilities by CSS source order, so a
 * className override won only by accident. Under CSS Modules specificity is
 * explicit and that hazard is gone, but the prop is still the better API:
 * there are two sizes on purpose, and callers should pick one rather than
 * inventing a third.
 */

/* Lookup objects of module class names, keeping the prototype's exact shape —
   the component body is unchanged. */
const TONES = {
  neutral: s.neutral,
  accent: s.accent,
  alt: s.alt,
  quiet: s.quiet,
} as const

const SIZES = {
  sm: s.sm,
  xs: s.xs,
} as const

export type TagTone = keyof typeof TONES
export type TagSize = keyof typeof SIZES

export interface TagProps {
  children: ReactNode
  icon?: string
  tone?: TagTone
  size?: TagSize
  className?: string
}

export default function Tag({
  children,
  icon,
  tone = 'neutral',
  size = 'sm',
  className = '',
}: TagProps) {
  return (
    <span className={cx(s.root, SIZES[size], TONES[tone], className)}>
      {icon && <Icon name={icon} size={size === 'xs' ? 10 : 12} />}
      {children}
    </span>
  )
}
