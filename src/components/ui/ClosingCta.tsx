import type { ReactNode } from 'react'

import SectionHeader from './SectionHeader'
import s from './ClosingCta.module.css'

/**
 * The centered "here's what to do next" block that closes both Leadership and
 * Project Groups: a small section header over one line of prose.
 *
 * Shared rather than repeated because the two pages must keep the same spacing
 * below their card grids — the brief treats them as a matched pair.
 */
export default function ClosingCta({
  heading,
  children,
}: {
  heading: ReactNode
  children: ReactNode
}) {
  return (
    <section className={s.root}>
      <SectionHeader small>{heading}</SectionHeader>
      <p className={s.body}>{children}</p>
    </section>
  )
}
