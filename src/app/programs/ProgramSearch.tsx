'use client'

import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import Papa from 'papaparse'

import MapClient from '@/components/map/MapClient'
import type { MapMarker } from '@/components/map/PntMap'
import SearchPanel, { type ProgramFilters } from '@/components/programs/SearchPanel'
import Button from '@/components/ui/Button'
import Icon, { type IconName } from '@/components/ui/Icon'
import { cx } from '@/lib/cx'
import { getCourse } from '@/data/courses'
import {
  DEFAULT_VIEW,
  REGION_VIEWS,
  VENUE_COORDINATES,
  type LatLng,
} from '@/data/venueCoordinates'
import { DATA_PATHS, FILTER_ANY, GRADES, ONLINE_REGION } from '@/constants'
import s from './ProgramSearch.module.css'

/**
 * PROGRAMS — the search itself.
 *
 * Before the first search the map is frozen behind a scrim with the search
 * window centered over it. Searching unfreezes the map, docks the window to
 * the side, and plots the results.
 *
 * Programs are grouped by venue before plotting — several programs commonly
 * run at the same library, and stacking identical markers would make all but
 * the top one unclickable.
 *
 * Data comes from public/data/programs.csv, a generated stand-in for the real
 * database. Swapping in the API (NEXTJS_MIGRATION.md Part C) means changing
 * the fetch below, not the UI. PapaParse disappears with it.
 */

interface Program {
  uid: string
  date: string
  course: string
  /** The leading digit of a course code is its subject id. */
  subject: number
  minGrade: number
  maxGrade: number
  session: string
  startTime: string
  endTime: string
  location: string
  address: string
  region: string
  signupLink: string
}

/** Column names exactly as they appear in the CSV header row. */
interface ProgramRow {
  UID: string
  Date: string
  Course: string
  'Minimum Grade': string
  'Maximum Grade': string
  Session: string
  'Start Time': string
  'End Time': string
  Location: string
  Address: string
  Region: string
  'Signup Link': string
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86400000)
}

/**
 * TODAY IS AN EXTERNAL STORE, NOT A MODULE CONSTANT.
 *
 * This page is prerendered, so a `new Date()` evaluated during render would
 * bake the BUILD date into the static HTML and hand every visitor a stale
 * default range. Evaluating it at module scope does not help either: a Client
 * Component is still server-rendered for the initial HTML, so the server's
 * clock and the browser's would disagree and the date inputs would mismatch on
 * hydration — NEXTJS_MIGRATION.md §2.5 flags exactly this.
 *
 * The server snapshot is therefore an empty string, which renders an empty
 * date input and is honest about not knowing the visitor's date; the browser
 * fills in the real one on its first client render. Same shape as the theme
 * store, and for the same reason.
 */
let clientToday: string | null = null

/* Picked once and never changes, so there is nothing to notify. */
const subscribeToday = () => () => {}

function getTodayIso(): string {
  clientToday ??= toIsoDate(new Date())
  return clientToday
}

function getServerTodayIso(): string {
  return ''
}

function matches(program: Program, filters: ProgramFilters): boolean {
  if (program.date < filters.startDate || program.date > filters.endDate) return false

  if (filters.grade !== FILTER_ANY) {
    const grade = Number(filters.grade)
    if (grade < program.minGrade || grade > program.maxGrade) return false
  }

  // An empty subject list means "Any" — see SearchPanel for why.
  if (filters.subjects.length > 0 && !filters.subjects.includes(program.subject)) return false

  if (filters.region !== FILTER_ANY && program.region !== filters.region) return false

  return true
}

/** Frames the map around whatever the search returned. */
function viewFor(markers: readonly MapMarker[], region: string) {
  if (region !== FILTER_ANY && REGION_VIEWS[region]) return REGION_VIEWS[region]
  if (markers.length === 0) return DEFAULT_VIEW

  const lats = markers.map((marker) => marker.position[0])
  const lngs = markers.map((marker) => marker.position[1])
  const spread = Math.max(
    Math.max(...lats) - Math.min(...lats),
    Math.max(...lngs) - Math.min(...lngs),
  )

  const center: LatLng = [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ]

  return {
    center,
    zoom: spread > 60 ? 2 : spread > 20 ? 3 : spread > 5 ? 5 : spread > 1 ? 8 : 11,
  }
}

function gradeLabel(grade: number) {
  return grade === 0 ? 'K' : String(grade)
}

function DetailRow({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <p className={s.detail}>
      <span className={s.detailIcon}>
        <Icon name={icon} size={12} />
      </span>
      <span>{children}</span>
    </p>
  )
}

function VenuePopup({ venue, programs }: { venue: string; programs: readonly Program[] }) {
  return (
    <div className={s.popup}>
      <p className={s.venue}>{venue}</p>
      <p className={s.address}>{programs[0].address}</p>

      <ul className={s.programs}>
        {programs.map((program) => {
          const course = getCourse(program.course)
          return (
            <li key={program.uid} className={s.program}>
              <p className={s.courseCode}>[{program.course}]</p>
              <p className={s.courseTitle}>{course?.title ?? 'Course'}</p>

              <div className={s.details}>
                <DetailRow icon="calendar">
                  {program.date} · {program.session}
                </DetailRow>
                <DetailRow icon="clock">
                  {program.startTime} – {program.endTime}
                </DetailRow>
                <DetailRow icon="users">
                  Grades {gradeLabel(program.minGrade)}–{gradeLabel(program.maxGrade)}
                </DetailRow>
                <DetailRow icon="globe">{program.region}</DetailRow>
              </div>

              <a
                href={program.signupLink}
                target="_blank"
                rel="noreferrer"
                className={cx('link-external', s.signup)}
              >
                Sign up
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function ProgramSearch() {
  const todayIso = useSyncExternalStore(subscribeToday, getTodayIso, getServerTodayIso)

  const [programs, setPrograms] = useState<readonly Program[]>([])
  const [loadError, setLoadError] = useState(false)
  /* null means "untouched", so the defaults track `todayIso` as it arrives. */
  const [edited, setEdited] = useState<ProgramFilters | null>(null)
  const [applied, setApplied] = useState<ProgramFilters | null>(null)

  const filters = useMemo<ProgramFilters>(
    () =>
      edited ?? {
        startDate: todayIso,
        endDate: todayIso ? toIsoDate(addDays(new Date(todayIso), 30)) : '',
        grade: FILTER_ANY,
        subjects: [],
        region: FILTER_ANY,
      },
    [edited, todayIso],
  )

  useEffect(() => {
    const controller = new AbortController()

    fetch(DATA_PATHS.programsCsv, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`programs.csv returned ${response.status}`)
        return response.text()
      })
      .then((text) => {
        const parsed = Papa.parse<ProgramRow>(text, { header: true, skipEmptyLines: true })
        setPrograms(
          parsed.data.map((row) => ({
            uid: row.UID,
            date: row.Date,
            course: row.Course,
            subject: Number(row.Course.split('.')[0]),
            minGrade: Number(row['Minimum Grade']),
            maxGrade: Number(row['Maximum Grade']),
            session: row.Session,
            startTime: row['Start Time'],
            endTime: row['End Time'],
            location: row.Location,
            address: row.Address,
            region: row.Region,
            signupLink: row['Signup Link'],
          })),
        )
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== 'AbortError') setLoadError(true)
      })

    return () => controller.abort()
  }, [])

  const results = useMemo(
    () => (applied ? programs.filter((program) => matches(program, applied)) : []),
    [programs, applied],
  )

  /* One marker per venue, carrying every program running there. */
  const markers = useMemo<MapMarker[]>(() => {
    const byVenue = new Map<string, Program[]>()

    for (const program of results) {
      // Skipped when online, or when a venue has no coordinates yet.
      if (!VENUE_COORDINATES[program.location]) continue
      const existing = byVenue.get(program.location)
      if (existing) existing.push(program)
      else byVenue.set(program.location, [program])
    }

    return [...byVenue.entries()].map(([venue, venuePrograms]) => ({
      id: venue,
      position: VENUE_COORDINATES[venue],
      tone: 'accent' as const,
      popup: <VenuePopup venue={venue} programs={venuePrograms} />,
    }))
  }, [results])

  const view = useMemo(
    () => (applied ? viewFor(markers, applied.region) : DEFAULT_VIEW),
    [markers, applied],
  )

  const searched = applied !== null
  const hasPastDates = Boolean(todayIso) && filters.startDate < todayIso
  const onlineCount = results.filter((program) => program.region === ONLINE_REGION).length

  const gradeSummary =
    applied && applied.grade !== FILTER_ANY
      ? GRADES.find((entry) => entry.grade === Number(applied.grade))?.label
      : 'Any grade'

  return (
    <>
      <div className={s.mapFrame}>
        <MapClient
          markers={markers}
          center={view.center}
          zoom={view.zoom}
          interactive={searched}
          /* Clears the docked search panel on the left. */
          popupPadTopLeft={searched ? [320, 24] : [24, 24]}
        />

        {searched ? (
          /* Post-search: the window docks to the side so the map is usable. */
          <div className={cx(s.overlay, s.dock)}>
            <SearchPanel
              compact
              filters={filters}
              onChange={setEdited}
              onSearch={() => setApplied(filters)}
              hasPastDates={hasPastDates}
            />
          </div>
        ) : (
          /* Pre-search: the map is visible but frozen behind a scrim, with the
             window centered over it. */
          <div className={cx(s.overlay, s.scrim)}>
            <div className={s.window}>
              <SearchPanel
                filters={filters}
                onChange={setEdited}
                onSearch={() => setApplied(filters)}
                hasPastDates={hasPastDates}
              />
            </div>
          </div>
        )}
      </div>

      {loadError && (
        <p className={s.error}>Could not load the program list. Try refreshing the page.</p>
      )}

      {searched && (
        <div className={s.summary}>
          <span>
            <span className={s.count}>{results.length}</span>{' '}
            {results.length === 1 ? 'program' : 'programs'} found
          </span>
          <span className={s.faint}>{gradeSummary}</span>
          {onlineCount > 0 && (
            <span className={s.faint}>
              {onlineCount} online {onlineCount === 1 ? 'program is' : 'programs are'} not shown
              on the map
            </span>
          )}
          <Button size="sm" variant="ghost" onClick={() => setApplied(null)}>
            Start over
          </Button>
        </div>
      )}
    </>
  )
}
