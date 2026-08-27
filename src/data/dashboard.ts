/**
 * Stand-in dashboard data for one signed-in volunteer.
 *
 * ALL PLACEHOLDER. In the real system this comes from PNT's hours records,
 * keyed to the Google account the member signs in with. Nothing here is
 * fetched; the Dashboard renders it directly.
 *
 * The breakdown categories are the real ones PNT uses (see the brief), so the
 * shapes should survive being wired to real data.
 */

/**
 * The three verdicts PNT's hours records actually use. When Part C replaces
 * this file with API responses these become the backend's verdict enum, so
 * keep the spellings exact.
 */
export type Verdict = 'Approved' | 'Unverified' | 'Denied'

/** One slice of a chart: a label and an hours figure. */
export interface BreakdownEntry {
  label: string
  value: number
}

export interface HoursRequest {
  hours: number
  verdict: Verdict
  department: string
  /** ISO date of the work itself, not of the submission. */
  date: string
  /** Em-dash when the request has not been reviewed yet. */
  confirmer: string
  link: string
  type: string
  description: string
  /** Submission timestamp, as the form records it. */
  time: string
  email: string
}

export interface Badge {
  label: string
  earned: boolean
}

export interface Membership {
  label: string
  /** Named against the Icon registry. */
  icon: string
}

/**
 * `visibility` is display-only: it reports how the member's record is set, and
 * the Dashboard deliberately offers no way to change it here.
 */
export interface ProfileField {
  value: string
  visibility: 'public' | 'private'
}

export interface Profile {
  photo: string
  name: string
  roles: string[]
  grade: string
  school: string
  roboticsTeam: string
  discordUserId: string
  personalEmail: string
  schoolEmail: string
  birthday: ProfileField
  phone: ProfileField
  joinDate: string
}

export const VERDICT_BREAKDOWN: readonly BreakdownEntry[] = [
  { label: 'Approved', value: 104.5 },
  { label: 'Unverified', value: 19 },
  { label: 'Denied', value: 5 },
]

/**
 * The headline hours figure: approved plus unverified, excluding denied.
 *
 * Derived rather than stored, so it can never drift from the breakdown it is
 * displayed next to. Unverified counts because those hours were worked and are
 * simply awaiting sign-off; denied hours were rejected and are not the
 * member's to claim.
 */
export const HOURS_COUNTED = VERDICT_BREAKDOWN.filter(
  (entry) => entry.label !== 'Denied',
).reduce((total, entry) => total + entry.value, 0)

export const DEPARTMENT_BREAKDOWN: readonly BreakdownEntry[] = [
  { label: '1 - Curriculum', value: 38 },
  { label: 'A - Social Media', value: 12.5 },
  { label: 'B - Business', value: 9 },
  { label: 'C - Communications', value: 14 },
  { label: 'D - Software', value: 31 },
  { label: 'L - Leadership', value: 18 },
  { label: 'Other / Miscellaneous', value: 6 },
]

export const CLASSIFICATION_BREAKDOWN: readonly BreakdownEntry[] = [
  { label: 'Teaching Students', value: 46 },
  { label: 'Meeting Attendance', value: 21.5 },
  { label: 'Department Task (Curriculum)', value: 24 },
  { label: 'Department Task (Outreach)', value: 13 },
  { label: 'General Leadership Task', value: 17 },
  { label: 'Other (Approved)', value: 7 },
]

export const RECENT_REQUESTS: readonly HoursRequest[] = [
  {
    hours: 2.5,
    verdict: 'Approved',
    department: '1 - Curriculum',
    date: '2026-08-09',
    confirmer: 'Placeholder Name 3',
    link: 'placeholder-evidence-01',
    type: 'Department Task (Curriculum)',
    description: 'Placeholder description of curriculum revision work.',
    time: '08/09/2026 19:09:02',
    email: 'placeholder@example.org',
  },
  {
    hours: 3,
    verdict: 'Approved',
    department: 'D - Software',
    date: '2026-08-07',
    confirmer: 'Placeholder Name 6',
    link: 'placeholder-evidence-02',
    type: 'Department Task (Curriculum)',
    description: 'Placeholder description of website development work.',
    time: '08/07/2026 21:44:10',
    email: 'placeholder@example.org',
  },
  {
    hours: 1.5,
    verdict: 'Unverified',
    department: 'L - Leadership',
    date: '2026-08-05',
    confirmer: '—',
    link: 'placeholder-evidence-03',
    type: 'Meeting Attendance',
    description: 'Placeholder description of an Executive Committee meeting.',
    time: '08/05/2026 20:02:55',
    email: 'placeholder@example.org',
  },
  {
    hours: 4,
    verdict: 'Approved',
    department: '1 - Curriculum',
    date: '2026-08-02',
    confirmer: 'Placeholder Name 1',
    link: 'placeholder-evidence-04',
    type: 'Teaching Students',
    description: 'Placeholder description of a library program taught in person.',
    time: '08/02/2026 17:30:41',
    email: 'placeholder@example.org',
  },
  {
    hours: 2,
    verdict: 'Approved',
    department: 'C - Communications',
    date: '2026-07-29',
    confirmer: 'Placeholder Name 10',
    link: 'placeholder-evidence-05',
    type: 'Department Task (Outreach)',
    description: 'Placeholder description of outreach to a partner organization.',
    time: '07/29/2026 22:15:03',
    email: 'placeholder@example.org',
  },
  {
    hours: 1,
    verdict: 'Denied',
    department: 'Other / Miscellaneous',
    date: '2026-07-27',
    confirmer: 'Placeholder Name 2',
    link: 'placeholder-evidence-06',
    type: 'Other (Approved)',
    description: 'Placeholder description of a request that was denied.',
    time: '07/27/2026 18:51:19',
    email: 'placeholder@example.org',
  },
  {
    hours: 3.5,
    verdict: 'Approved',
    department: 'A - Social Media',
    date: '2026-07-24',
    confirmer: 'Placeholder Name 8',
    link: 'placeholder-evidence-07',
    type: 'Department Task (Outreach)',
    description: 'Placeholder description of social media content production.',
    time: '07/24/2026 20:12:47',
    email: 'placeholder@example.org',
  },
  {
    hours: 2,
    verdict: 'Approved',
    department: 'D - Software',
    date: '2026-07-21',
    confirmer: 'Placeholder Name 6',
    link: 'placeholder-evidence-08',
    type: 'General Leadership Task',
    description: 'Placeholder description of tooling maintenance.',
    time: '07/21/2026 19:38:22',
    email: 'placeholder@example.org',
  },
  {
    hours: 5,
    verdict: 'Approved',
    department: '1 - Curriculum',
    date: '2026-07-18',
    confirmer: 'Placeholder Name 1',
    link: 'placeholder-evidence-09',
    type: 'Teaching Students',
    description: 'Placeholder description of a weekend robotics session.',
    time: '07/18/2026 16:04:58',
    email: 'placeholder@example.org',
  },
  {
    hours: 1.5,
    verdict: 'Unverified',
    department: 'B - Business',
    date: '2026-07-15',
    confirmer: '—',
    link: 'placeholder-evidence-10',
    type: 'Meeting Attendance',
    description: 'Placeholder description of a grant planning call.',
    time: '07/15/2026 21:27:33',
    email: 'placeholder@example.org',
  },
]

export const BADGES: readonly Badge[] = [
  { label: '100 Hours', earned: true },
  { label: 'First Program Taught', earned: true },
  { label: 'Curriculum Author', earned: true },
  { label: 'Five Regions', earned: false },
  { label: '250 Hours', earned: false },
]

export const MEMBERSHIPS: readonly Membership[] = [
  { label: '1 - Curriculum', icon: 'document' },
  { label: 'D - Software', icon: 'computer' },
  { label: 'Placeholder Group 1', icon: 'users' },
]

/**
 * Editing lives wherever PNT manages member records, not here.
 *
 * "Nexus Tech" is fictional and stays that way until real auth lands in phase
 * 7 — this record is what the stubbed `isLoggedIn` flag shows. The photo path
 * therefore points at its own folder rather than borrowing a real person's
 * portrait, which is what it did until the content phase: it pointed into
 * `leadership/executive-committee/member-01/`, a numbered folder that no
 * longer exists, so it 404'd AND, worse, would have put a real volunteer's
 * face on a fabricated profile if that folder had survived.
 */
export const PROFILE: Profile = {
  photo: '/media/dashboard/profile.png',
  name: 'Nexus Tech',
  roles: ['Executive Committee member', 'Project group lead', 'NT member'],
  grade: '11th grade',
  school: 'Placeholder High School',
  roboticsTeam: 'FTC #10137',
  discordUserId: '284730192847361024',
  personalEmail: 'placeholder.personal@example.org',
  schoolEmail: 'placeholder.student@example.edu',
  birthday: { value: 'March 14, 2009', visibility: 'public' },
  phone: { value: '(555) 010-4471', visibility: 'private' },
  joinDate: 'January 8, 2024',
}
