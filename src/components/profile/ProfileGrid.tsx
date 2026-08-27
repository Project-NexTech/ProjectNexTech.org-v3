import type { ReactNode } from 'react'

import Reveal from '@/components/ui/Reveal'
import { cx } from '@/lib/cx'
import s from './ProfileGrid.module.css'

/**
 * The 1/2/3-column grid Leadership and Project Groups both lay their cards out
 * in, and the stacked-lines helper their popups both use for multi-value
 * detail rows.
 *
 * `<Reveal as="ul">` wraps the whole grid rather than each card, so the block
 * animates in as one unit.
 */
export default function ProfileGrid({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Reveal as="ul" className={cx(s.grid, className)}>
      {children}
    </Reveal>
  )
}

/** Multi-value detail row: one short line per entry. */
export function Lines({ values }: { values: readonly string[] }) {
  return (
    <span className={s.lines}>
      {values.map((value) => (
        <span key={value}>{value}</span>
      ))}
    </span>
  )
}
