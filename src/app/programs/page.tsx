import type { Metadata } from 'next'

import ProgramSearch from './ProgramSearch'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Find a free Project NexTech program near you. Search upcoming programs by date, grade, subject, and region.',
}

export default function ProgramsPage() {
  return (
    <div className={s.root}>
      <h1 className={s.title}>Find a program</h1>
      <p className={s.lede}>
        Every upcoming Project NexTech program, free to attend. Search by date, grade, subject,
        and region.
      </p>

      <ProgramSearch />
    </div>
  )
}
