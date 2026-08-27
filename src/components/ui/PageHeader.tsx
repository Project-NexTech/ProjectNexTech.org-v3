import type { ReactNode } from 'react'

import { cx } from '@/lib/cx'
import Reveal from './Reveal'
import s from './PageHeader.module.css'

/**
 * Page title and subtitle. Left-aligned by default, which the brief sets as
 * the site-wide default; pass `centered` for the pages that opt out.
 *
 * `subtitle` accepts JSX, not just a string — Policies passes a <Wordmark />.
 */
export interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  centered?: boolean
  children?: ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  centered = false,
  children,
}: PageHeaderProps) {
  return (
    <Reveal as="header" className={cx(s.root, centered && s.centered)}>
      <h1 className={s.title}>{title}</h1>
      {subtitle && (
        <p className={cx(s.subtitle, centered && s.subtitleCentered)}>{subtitle}</p>
      )}
      {children}
    </Reveal>
  )
}
