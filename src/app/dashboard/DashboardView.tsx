'use client'

import dynamic from 'next/dynamic'
import { useState, type ReactNode } from 'react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icon, { type IconName } from '@/components/ui/Icon'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import PageHeader from '@/components/ui/PageHeader'
import Tag, { type TagTone } from '@/components/ui/Tag'
import { cx } from '@/lib/cx'
import { useSite } from '@/context/siteContext'
import {
  BADGES,
  CLASSIFICATION_BREAKDOWN,
  DEPARTMENT_BREAKDOWN,
  HOURS_COUNTED,
  MEMBERSHIPS,
  PROFILE,
  RECENT_REQUESTS,
  VERDICT_BREAKDOWN,
  type Verdict,
} from '@/data/dashboard'
import { DASHBOARD_LINK_GROUPS, DASHBOARD_QUICK_LINKS, FORMS } from '@/constants'
import { VERDICT_COLORS } from './Charts'
import s from './DashboardView.module.css'

/**
 * DASHBOARD
 * =========
 * Gated behind the stubbed `isLoggedIn` flag — see SiteProvider for why that
 * is a boolean rather than real auth. Signed out, this page offers the same
 * action the navbar's Log In does.
 *
 * All figures come from src/data/dashboard.ts and are placeholder. The date
 * range inputs are deliberately inert: the brief asks for working inputs that
 * do not yet filter anything, since there is no backend to query.
 */

/**
 * Recharts is ~370 kB and none of it is needed to paint the page, so the
 * charts load from their own chunk (NEXTJS_MIGRATION.md §2.6). No `ssr: false`
 * — Recharts renders fine on the server; only Leaflet needs that, and it could
 * not be spelled this way anyway from a Server Component.
 *
 * The `loading` fallbacks reserve each chart's exact height so the panel does
 * not jump when the chunk lands.
 */
const VerdictChart = dynamic(() => import('./Charts').then((m) => m.VerdictChart), {
  loading: () => <div className={s.chartFallback} style={{ height: '11rem' }} />,
})

const BreakdownChart = dynamic(() => import('./Charts').then((m) => m.BreakdownChart), {
  loading: () => <div className={s.chartFallback} style={{ height: 140 }} />,
})

const VERDICT_TONE: Record<Verdict, TagTone> = {
  Approved: 'accent',
  Unverified: 'alt',
  Denied: 'quiet',
}

const REQUEST_HEADINGS = [
  'Hours',
  'Verdict',
  'Department',
  'Date',
  'Type',
  'Confirmer',
  'Logged',
]

interface ProfileRow {
  icon: IconName
  label: string
  value: string
  visibility?: 'public' | 'private'
}

const PROFILE_ROWS: readonly ProfileRow[] = [
  { icon: 'users', label: 'Grade', value: PROFILE.grade },
  { icon: 'school', label: 'School', value: PROFILE.school },
  { icon: 'robot', label: 'Robotics team', value: PROFILE.roboticsTeam },
  { icon: 'discord', label: 'Discord user ID', value: PROFILE.discordUserId },
  { icon: 'mail', label: 'Personal email', value: PROFILE.personalEmail },
  { icon: 'school', label: 'School email', value: PROFILE.schoolEmail },
  {
    icon: 'cake',
    label: 'Birthday',
    value: PROFILE.birthday.value,
    visibility: PROFILE.birthday.visibility,
  },
  {
    icon: 'phone',
    label: 'Phone number',
    value: PROFILE.phone.value,
    visibility: PROFILE.phone.visibility,
  },
  { icon: 'calendar', label: 'Joined', value: PROFILE.joinDate },
]

function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={cx(s.panel, className)}>
      <div className={s.panelHead}>
        <h2 className={s.panelTitle}>{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  )
}

function SignedOut({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className={s.signedOut}>
      <PageHeader
        centered
        title="Dashboard"
        subtitle="Sign in with your Project NexTech account to see your volunteer hours, badges, and links."
      />
      <Button variant="primary" onClick={onSignIn}>
        Log in
      </Button>
    </div>
  )
}

export default function DashboardView() {
  const { isLoggedIn, signIn } = useSite()
  /* Inert by design — there is no backend to query yet. */
  const [range, setRange] = useState({ start: '', end: '' })

  if (!isLoggedIn) return <SignedOut onSignIn={signIn} />

  return (
    <div>
      <PageHeader
        title={`Hi, ${PROFILE.name.split(' ')[0]}`}
        subtitle="Your volunteer record, badges, and everything you need to run programs."
      />

      <div className={s.layout}>
        {/* ------------------------------------------------ left: the data */}
        <div className={s.main}>
          <Panel
            title="Volunteer hours"
            action={
              <div className={s.rangeControls}>
                <input
                  type="date"
                  aria-label="Start date"
                  value={range.start}
                  onChange={(event) => setRange({ ...range, start: event.target.value })}
                  className={s.dateInput}
                />
                <span className={s.rangeJoin}>to</span>
                <input
                  type="date"
                  aria-label="End date"
                  value={range.end}
                  onChange={(event) => setRange({ ...range, end: event.target.value })}
                  className={s.dateInput}
                />
                {/* Inert alongside the date inputs — there is nothing to
                    recalculate against until the hours backend exists. */}
                <Button variant="primary" size="sm" onClick={() => {}}>
                  Recalculate
                </Button>
              </div>
            }
          >
            <div className={s.hoursRow}>
              <div>
                <p className={s.hoursTotal}>{HOURS_COUNTED}</p>
                <p className={s.hoursCaption}>
                  hours, all time
                  <span className={s.hoursQualifier}>
                    approved and unverified, excluding denied
                  </span>
                </p>
              </div>
              <VerdictChart />
            </div>

            <ul className={s.legend}>
              {VERDICT_BREAKDOWN.map((entry) => (
                <li key={entry.label} className={s.legendItem}>
                  <span
                    className={s.legendDot}
                    style={{ background: VERDICT_COLORS[entry.label as Verdict] }}
                  />
                  {entry.label} · {entry.value} hrs
                </li>
              ))}
            </ul>

            <p className={s.chartLabel}>By department</p>
            <BreakdownChart data={DEPARTMENT_BREAKDOWN} />

            <p className={s.chartLabel}>By classification</p>
            <BreakdownChart data={CLASSIFICATION_BREAKDOWN} />

            <div className={s.hoursForm}>
              <Button href={FORMS.hoursRequest} size="sm" variant="alt">
                Get signed hours form
              </Button>
            </div>
          </Panel>

          <Panel title="Recent hour requests">
            <div className={s.tableScroll}>
              <table className={s.table}>
                <thead>
                  <tr>
                    {REQUEST_HEADINGS.map((heading) => (
                      <th key={heading} className={s.th}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_REQUESTS.map((request) => (
                    <tr key={request.link} className={s.tr}>
                      <td className={cx(s.td, s.tdHours)}>{request.hours}</td>
                      <td className={s.td}>
                        <Tag size="xs" tone={VERDICT_TONE[request.verdict]}>
                          {request.verdict}
                        </Tag>
                      </td>
                      <td className={s.td}>{request.department}</td>
                      <td className={cx(s.td, s.tdMono)}>{request.date}</td>
                      <td className={s.td}>{request.type}</td>
                      <td className={s.td}>{request.confirmer}</td>
                      <td className={cx(s.td, s.tdLogged)}>{request.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className={s.pair}>
            <Panel title="Badges">
              <ul className={s.chips}>
                {BADGES.map((badge) => (
                  <li key={badge.label}>
                    <Tag tone={badge.earned ? 'accent' : 'quiet'}>{badge.label}</Tag>
                  </li>
                ))}
              </ul>
              <p className={s.chipsNote}>
                Faded badges are placeholder milestones not yet earned.
              </p>
            </Panel>

            <Panel title="Departments and groups">
              <ul className={s.chips}>
                {MEMBERSHIPS.map((membership) => (
                  <li key={membership.label}>
                    <Tag icon={membership.icon} tone="alt">
                      {membership.label}
                    </Tag>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="Links">
            <ul className={s.quickLinks}>
              {DASHBOARD_QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Button href={link.url} variant="primary" size="sm">
                    <Icon name={link.icon as IconName} size={13} />
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>

            <div className={s.linkColumns}>
              {(['left', 'right'] as const).map((column) => (
                <div key={column} className={s.linkColumn}>
                  {DASHBOARD_LINK_GROUPS.filter((group) => group.column === column).map(
                    (group) => (
                      <div key={group.title}>
                        <p className={s.groupTitle}>
                          <Icon name={group.icon as IconName} size={12} />
                          {group.title}
                        </p>
                        <ul className={s.groupLinks}>
                          {group.links.map((link) => (
                            <li key={link.label}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className={cx('link-external', s.groupLink)}
                              >
                                <span className={s.groupLinkIcon}>
                                  <Icon name={(link.icon ?? group.icon) as IconName} size={13} />
                                </span>
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* --------------------------------------------- right: the profile */}
        <aside className={s.profile}>
          <Card className={s.profileCard}>
            <ImagePlaceholder src={PROFILE.photo} ratio="1:1" alt="" className={s.photo} />

            <p className={s.profileName}>{PROFILE.name}</p>

            <ul className={s.profileRoles}>
              {PROFILE.roles.map((role) => (
                <li key={role}>
                  <Tag size="xs" tone="accent">
                    {role}
                  </Tag>
                </li>
              ))}
            </ul>

            <dl className={s.fields}>
              {PROFILE_ROWS.map((row) => (
                <div key={row.label}>
                  <dt className={s.fieldLabel}>
                    <Icon name={row.icon} size={12} />
                    {row.label}
                  </dt>
                  <dd className={s.fieldValue}>{row.value}</dd>

                  {/* Reports the current setting only — nothing here changes it. */}
                  {row.visibility && (
                    <p className={s.fieldVisibility}>
                      <Icon name={row.visibility === 'public' ? 'globe' : 'lock'} size={10} />
                      {row.visibility === 'public'
                        ? 'Public to members'
                        : 'Private to management'}
                    </p>
                  )}
                </div>
              ))}
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  )
}
