'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

import CourseCard from '@/components/curriculum/CourseCard'
import Reveal from '@/components/ui/Reveal'
import { cx } from '@/lib/cx'
import { COURSES } from '@/data/courses'
import { SUBJECTS } from '@/constants'
import s from './SubjectTabs.module.css'

const CYCLE_MS = 10000
const PAUSE_AFTER_CLICK_MS = 30000

/**
 * "A different subject leads each visit", per the brief.
 *
 * In the prototype that was one line — `useState(() => random subject)`. It
 * cannot be, here: this page is prerendered, so a random pick during render
 * would either be baked into the static HTML at build time (the same subject
 * forever) or differ between the server HTML and the first client render (a
 * hydration mismatch).
 *
 * So the pick is an external store, the same shape the theme uses. The server
 * snapshot is deterministic; the client snapshot picks once, lazily, and then
 * stays put for the life of the page. React renders the server value during
 * hydration and re-renders with the client value immediately after — no
 * mismatch, and no setState in an effect (which the lint rules reject).
 */
const FIRST_SUBJECT_ID = SUBJECTS[0].id

let clientPick: number | null = null

/* The store never changes after its first read, so there is nothing to notify. */
const subscribeLeadSubject = () => () => {}

function getLeadSubject(): number {
  clientPick ??= SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)].id
  return clientPick
}

function getServerLeadSubject(): number {
  return FIRST_SUBJECT_ID
}

export default function SubjectTabs() {
  const leadSubjectId = useSyncExternalStore(
    subscribeLeadSubject,
    getLeadSubject,
    getServerLeadSubject,
  )

  /* null means "still showing whichever subject led this visit". */
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const subjectId = selectedId ?? leadSubjectId

  /**
   * `paused` lengthens the next interval after a manual click; `nonce` exists
   * so every click produces a fresh object identity, which restarts the timer
   * below even when the clicked subject is the one already showing.
   *
   * A timestamp would read more naturally here, but `Date.now()` in a
   * component body trips `react-hooks/purity` — a counter is equivalent and
   * pure.
   */
  const [cycle, setCycle] = useState({ paused: false, nonce: 0 })

  useEffect(() => {
    const id = setTimeout(
      () => {
        const position = SUBJECTS.findIndex((subject) => subject.id === subjectId)
        setSelectedId(SUBJECTS[(position + 1) % SUBJECTS.length].id)
        setCycle((current) => ({ paused: false, nonce: current.nonce + 1 }))
      },
      cycle.paused ? PAUSE_AFTER_CLICK_MS : CYCLE_MS,
    )

    return () => clearTimeout(id)
  }, [subjectId, cycle])

  const selectSubject = (id: number) => {
    setSelectedId(id)
    setCycle((current) => ({ paused: true, nonce: current.nonce + 1 }))
  }

  const courses = COURSES.filter((course) => course.subject === subjectId)

  return (
    <>
      <div role="tablist" aria-label="Subject" className={s.tablist}>
        {SUBJECTS.map((subject, index) => (
          <button
            key={subject.id}
            type="button"
            role="tab"
            aria-selected={subject.id === subjectId}
            onClick={() => selectSubject(subject.id)}
            className={cx(
              s.tab,
              index % 2 === 1 ? s.alt : s.accent,
              subject.id === subjectId && s.active,
            )}
          >
            {subject.label}
          </button>
        ))}
      </div>

      {/* Keyed on the subject so switching tabs replays the reveal, which
          makes the swap read as intentional rather than as a flicker. */}
      <Reveal key={subjectId} as="ul" className={s.grid}>
        {courses.map((course) => (
          <li key={course.code}>
            <CourseCard course={course} />
          </li>
        ))}
      </Reveal>
    </>
  )
}
