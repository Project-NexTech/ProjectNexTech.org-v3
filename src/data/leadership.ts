/**
 * Leadership roster for the Leadership page.
 *
 * ALL OF THIS IS PLACEHOLDER DATA. No real person is represented here — names
 * are literally "Placeholder Name N" so nothing can be mistaken for a real
 * volunteer. Bios, schools, grades, regions, and join dates are invented.
 *
 * The brief states this page is maintained by hand rather than from a
 * database, so replacing these entries with real people is the intended
 * workflow. Media paths already match the folders scaffolded under
 * public/media/leadership/.
 */

import type { CarouselPhoto } from './projectGroups'

export interface LeadershipMember {
  id: string
  name: string
  /** The primary title shown on the card — always roles[0]. */
  role: string
  /** The full list shown in the popup; people commonly hold more than one. */
  roles: string[]
  image: string
  carousel: CarouselPhoto[]
  paragraphs: string[]
  joinDate: string
  grade: string
  school: string
  region: string
  linkedin: string | null
}

/** Name and role only — no portrait, no popup. */
export interface AdvisorEntry {
  id: string
  name: string
  role: string
}

export interface FeaturedAdvisor extends AdvisorEntry {
  image: string
}

interface MemberInput {
  index: number
  group: string
  name: string
  roles: string[]
  school: string
  grade: string
  joinDate: string
  region: string
  linkedin: string | null
}

const CAROUSEL_LENGTH = 5

function member({
  index,
  group,
  name,
  roles,
  school,
  grade,
  joinDate,
  region,
  linkedin,
}: MemberInput): LeadershipMember {
  const dir = `/media/leadership/${group}/member-${String(index).padStart(2, '0')}`

  return {
    id: `${group}-${index}`,
    name,
    /* `role` is the primary title shown on the card; `roles` is the full list
       shown in the popup, since people commonly hold more than one. */
    role: roles[0],
    roles,
    image: `${dir}/portrait.png`,
    carousel: Array.from({ length: CAROUSEL_LENGTH }, (_, i) => ({
      src: `${dir}/carousel-${String(i + 1).padStart(2, '0')}.png`,
      caption: `A placeholder caption for photo ${i + 1} of ${name}.`,
    })),
    paragraphs: [
      `This is placeholder biography text for ${name}. It should run two to four sentences and cover what they do at Project NexTech day to day. Replace it with something written by the person themselves.`,
      'This is a second placeholder paragraph, covering how they first got involved with the organization and what they worked on before their current role.',
      'This is a third placeholder paragraph, covering what they study or are interested in outside of Project NexTech, and where they hope to take it.',
    ],
    joinDate,
    grade,
    school,
    region,
    linkedin,
  }
}

const EC_ROLES: readonly string[] = [
  'President',
  'Vice President of Operations',
  'Director of Curriculum',
  'Director of Outreach',
  'Director of Analytics',
  'Director of Software',
]

const MANAGER_ROLES: readonly string[] = [
  'Curriculum Manager',
  'Social Media Manager',
  'Business Manager',
  'Communications Manager',
  'Software Manager',
  'Events Manager',
]

const DIRECTOR_ROLES: readonly string[] = [
  'Board Chair',
  'Board Secretary',
  'Board Treasurer',
  'Board Member',
  'Board Member',
  'Board Member',
]

const SCHOOLS: readonly string[] = [
  'Placeholder High School',
  'Francis Parker School',
  'Placeholder Academy',
  'Placeholder Charter School',
  'Placeholder Preparatory',
  'Placeholder Senior High',
]

const REGIONS: readonly string[] = [
  'San Diego, CA',
  'San Diego, CA',
  'Houston, TX',
  'Los Angeles, CA',
  'Monterrey, MX',
  'Cleveland, OH',
]

const JOIN_MONTHS: readonly string[] = ['January', 'March', 'June', 'August', 'September', 'November']

/** Extra hats, given to roughly every third member so the popup's multi-role
 *  layout is exercised. Entirely invented. */
const SECONDARY_ROLES: readonly string[] = [
  'Program Host',
  'Curriculum Reviewer',
  'Project Group Lead',
  'Regional Coordinator',
]

function buildGroup(
  group: string,
  roles: readonly string[],
  startIndex: number,
): LeadershipMember[] {
  return roles.map((role, i) =>
    member({
      index: i + 1,
      group,
      name: `Placeholder Name ${startIndex + i}`,
      roles:
        i % 3 === 1
          ? [role, SECONDARY_ROLES[i % SECONDARY_ROLES.length]]
          : i % 5 === 0
            ? [role, SECONDARY_ROLES[(i + 2) % SECONDARY_ROLES.length], 'Founding Member']
            : [role],
      school: SCHOOLS[i % SCHOOLS.length],
      grade: `${9 + (i % 4)}th grade`,
      /* Full dates, derived from the index so they stay stable across reloads.
         Invented, like everything else here. */
      joinDate: `${JOIN_MONTHS[i % JOIN_MONTHS.length]} ${((i * 7) % 27) + 1}, 202${3 + (i % 3)}`,
      region: REGIONS[i % REGIONS.length],
      // Deliberately absent on some entries so the optional row is exercised.
      linkedin: i % 3 === 0 ? 'https://www.linkedin.com/company/project-nextech' : null,
    }),
  )
}

export const EXECUTIVE_COMMITTEE = buildGroup('executive-committee', EC_ROLES, 1)
export const DEPARTMENT_MANAGERS = buildGroup('department-managers', MANAGER_ROLES, 7)
export const BOARD_OF_DIRECTORS = buildGroup('board-of-directors', DIRECTOR_ROLES, 13)

/** The one advisor with a full card. Has no popup, per the brief. */
export const BOARD_OF_ADVISORS_FEATURED: FeaturedAdvisor = {
  id: 'advisor-featured',
  name: 'Placeholder Name 19',
  role: 'Lead Advisor',
  image: '/media/leadership/board-of-advisors/member-01/portrait.png',
}

/** Name and role only — no portrait, no popup. */
export const BOARD_OF_ADVISORS: readonly AdvisorEntry[] = Array.from({ length: 8 }, (_, i) => ({
  id: `advisor-${i + 1}`,
  name: `Placeholder Name ${20 + i}`,
  role: 'Advisor',
}))
