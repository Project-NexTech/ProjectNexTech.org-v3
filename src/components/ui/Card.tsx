import type { ElementType, ReactNode } from 'react'

import { cx } from '@/lib/cx'
import s from './Card.module.css'

/**
 * The shared card shell.
 *
 * The brief asks that cards share one design language sitewide even when they
 * hold different content — partner cards, leadership cards, project group
 * cards, curriculum cards, and big-number cards all wrap in this. Keep
 * per-page styling to the card's *contents*, never its frame.
 */
export interface CardProps {
  children: ReactNode
  /** The element to render. `as` rather than `Tag` to avoid shadowing <Tag />. */
  as?: ElementType
  /** Adds the hover lift. For cards that are themselves links or buttons. */
  interactive?: boolean
  className?: string
}

export default function Card({
  children,
  as: Component = 'div',
  interactive = false,
  className = '',
}: CardProps) {
  return (
    <Component className={cx(s.root, interactive && s.interactive, className)}>
      {children}
    </Component>
  )
}
