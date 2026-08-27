'use client'

import type { ReactNode } from 'react'

import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { cx } from '@/lib/cx'
import { FILTER_ANY, GRADES, ONLINE_REGION, REGIONS, SUBJECTS } from '@/constants'
import s from './SearchPanel.module.css'

/**
 * The four filters and the Search button.
 *
 * Rendered twice over the page's lifetime in two shapes: large and centered
 * over a frozen map before the first search, then compact and docked to the
 * side once results exist. `compact` switches between them.
 */

export interface ProgramFilters {
  startDate: string
  endDate: string
  /** A grade number as a string, or FILTER_ANY. */
  grade: string
  /** Empty means "any" — see the note on `anySubjects` below. */
  subjects: readonly number[]
  region: string
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className={s.field}>
      <span className={s.fieldLabel}>{label}</span>
      {children}
    </label>
  )
}

export interface SearchPanelProps {
  filters: ProgramFilters
  onChange: (next: ProgramFilters) => void
  onSearch: () => void
  hasPastDates?: boolean
  compact?: boolean
}

export default function SearchPanel({
  filters,
  onChange,
  onSearch,
  hasPastDates = false,
  compact = false,
}: SearchPanelProps) {
  const { startDate, endDate, grade, subjects, region } = filters

  /**
   * "Any" is a derived state, not a stored one: it means "no specific subset".
   * Selecting every subject is the same thing as selecting none, so both
   * collapse back to Any.
   */
  const anySubjects = subjects.length === 0 || subjects.length === SUBJECTS.length

  const toggleSubject = (id: number) => {
    const next = subjects.includes(id)
      ? subjects.filter((value) => value !== id)
      : [...subjects, id]

    onChange({ ...filters, subjects: next.length === SUBJECTS.length ? [] : next })
  }

  return (
    <div className={compact ? s.stackTight : s.stack}>
      <div className={compact ? s.stackTight : s.dateRow}>
        <Field label="Start date">
          <input
            type="date"
            value={startDate}
            onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
            className={s.input}
          />
        </Field>

        <Field label="End date">
          <input
            type="date"
            value={endDate}
            onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
            className={s.input}
          />
        </Field>
      </div>

      {hasPastDates && (
        <p className={s.warning}>
          <span className={s.warningIcon}>
            <Icon name="info" size={13} />
          </span>
          Your date range includes dates in the past.
        </p>
      )}

      <Field label="Student grade">
        <select
          value={grade}
          onChange={(event) => onChange({ ...filters, grade: event.target.value })}
          className={s.input}
        >
          <option value={FILTER_ANY}>Any</option>
          {GRADES.map((entry) => (
            <option key={entry.grade} value={entry.grade}>
              {entry.label} / {entry.ages} years old
            </option>
          ))}
        </select>
      </Field>

      <Field label="Subject">
        <div className={cx(s.checkList, !compact && s.checkGrid)}>
          <label className={s.check}>
            <input
              type="checkbox"
              checked={anySubjects}
              onChange={() => onChange({ ...filters, subjects: [] })}
              className={s.checkbox}
            />
            Any
          </label>

          {SUBJECTS.map((subject) => (
            <label key={subject.id} className={s.check}>
              <input
                type="checkbox"
                checked={!anySubjects && subjects.includes(subject.id)}
                onChange={() => toggleSubject(subject.id)}
                className={s.checkbox}
              />
              {subject.label}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Region">
        <select
          value={region}
          onChange={(event) => onChange({ ...filters, region: event.target.value })}
          className={s.input}
        >
          <option value={FILTER_ANY}>Any</option>
          {REGIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value={ONLINE_REGION}>{ONLINE_REGION}</option>
        </select>
      </Field>

      <Button
        variant="primary"
        onClick={onSearch}
        className={s.submit}
        size={compact ? 'sm' : 'md'}
      >
        Search
      </Button>
    </div>
  )
}
