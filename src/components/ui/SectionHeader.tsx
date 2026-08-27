import type { ReactNode } from 'react'

import { cx } from '@/lib/cx'
import Reveal from './Reveal'
import s from './SectionHeader.module.css'

/**
 * Center-aligned section header.
 *
 * Per the brief, a "Section header" outside article formatting is centered on
 * the page. `small` renders the accent-colored, smaller variant used for the
 * "Interested in applying?" and "Start your own group today!" prompts.
 *
 * Stays a Server Component: it only *renders* <Reveal>, which is the client
 * boundary. Nothing here needs to run in the browser.
 */
export interface SectionHeaderProps {
  children: ReactNode
  subtitle?: ReactNode
  /** The accent-colored prompt variant. */
  small?: boolean
  id?: string
  className?: string
}

export default function SectionHeader({
  children,
  subtitle,
  small = false,
  id,
  className = '',
}: SectionHeaderProps) {
  if (small) {
    return (
      <Reveal as="h2" className={cx(s.small, className)}>
        <span id={id}>{children}</span>
      </Reveal>
    )
  }

  return (
    <Reveal className={cx(s.root, className)}>
      <h2 id={id} className={s.title}>
        {children}
      </h2>
      {subtitle && <p className={s.subtitle}>{subtitle}</p>}
    </Reveal>
  )
}
