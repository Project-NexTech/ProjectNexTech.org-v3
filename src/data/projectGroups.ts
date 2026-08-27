/**
 * Project group roster for the Project Groups page.
 *
 * ALL OF THIS IS PLACEHOLDER DATA — group names, codes, leads, members,
 * schools, and team numbers are invented. Like Leadership, the brief says this
 * page is maintained by hand rather than from a database.
 *
 * Media paths already match the folders scaffolded under
 * public/media/project-groups/.
 */

import type { LatLng } from './venueCoordinates'

export interface CarouselPhoto {
  src: string
  caption: string
}

export interface ProjectGroup {
  position: LatLng
  id: string
  name: string
  code: string
  image: string
  carousel: CarouselPhoto[]
  paragraphs: string[]
  /** One or two leads; the page renders a singular or plural label from length. */
  leads: string[]
  members: string[]
  /** Carries school, robotics team number, or group type, per the brief. */
  affiliation: string
  region: string
  link: string | null
}

const CAROUSEL_LENGTH = 5

const GROUP_TYPES = [
  'School club',
  'Robotics team',
  'Community group',
  'School club',
  'Robotics team',
]

/**
 * Region label plus an approximate map position.
 *
 * WARNING: Coordinates are city-level and INVENTED, like the rest of this file — the
 * small offsets below just spread co-located groups apart so their markers
 * don't stack. Replace with real positions alongside the real rosters.
 */
const REGIONS: readonly { label: string; position: LatLng }[] = [
  { label: 'San Diego, CA', position: [32.83, -117.15] },
  { label: 'Houston, TX', position: [29.76, -95.37] },
  { label: 'Monterrey, MX', position: [25.67, -100.31] },
  { label: 'Los Angeles, CA', position: [34.05, -118.25] },
  { label: 'Cleveland, OH', position: [41.5, -81.69] },
  { label: 'Dhaka, BD', position: [23.81, 90.41] },
]

/** Deterministic 4-5 character alphanumeric code, so codes are stable across reloads. */
function groupCode(index: number): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const a = letters[(index * 7) % letters.length]
  const b = letters[(index * 13 + 5) % letters.length]
  const digits = String((index * 337) % 1000).padStart(index % 2 === 0 ? 2 : 3, '0')
  return `${a}${b}${digits}`
}

export const PROJECT_GROUPS: readonly ProjectGroup[] = Array.from({ length: 20 }, (_, i): ProjectGroup => {
  const index = i + 1
  const dir = `/media/project-groups/group-${String(index).padStart(2, '0')}`
  const type = GROUP_TYPES[i % GROUP_TYPES.length]
  const region = REGIONS[i % REGIONS.length]

  /* Nudge co-located groups apart so their markers stay individually
     clickable. Deterministic, so positions don't jump between reloads. */
  const ring = Math.floor(i / REGIONS.length)
  const offset = 0.045 * (ring + 1)
  const position: LatLng = [
    region.position[0] + offset * (ring % 2 === 0 ? 1 : -1),
    region.position[1] + offset * (ring % 3 === 0 ? 1 : -1),
  ]

  return {
    position,
    id: `group-${index}`,
    name: `Placeholder Group ${index}`,
    code: groupCode(index),
    image: `${dir}/region.png`,
    carousel: Array.from({ length: CAROUSEL_LENGTH }, (_, j) => ({
      src: `${dir}/carousel-${String(j + 1).padStart(2, '0')}.png`,
      caption: `A placeholder caption for photo ${j + 1} from this group.`,
    })),
    paragraphs: [
      `This is placeholder text describing what Placeholder Group ${index} does and who it serves. Two to four sentences covering the programs they run locally and how often they meet.`,
      'This is a second placeholder paragraph, covering how the group got started and what support they received from the wider organization.',
      'This is a third placeholder paragraph, covering what the group is planning next and how new members can get involved.',
    ],
    /* One or two leads — every third group gets a co-lead, so the singular and
       plural label are both exercised. Names are invented. */
    leads:
      i % 3 === 0
        ? [`Placeholder Name ${30 + i}`, `Placeholder Name ${60 + i}`]
        : [`Placeholder Name ${30 + i}`],
    members: [
      `Placeholder Member ${i * 3 + 1}`,
      `Placeholder Member ${i * 3 + 2}`,
      `Placeholder Member ${i * 3 + 3}`,
    ],
    /* One field carrying school, robotics team number, or group type, per the brief. */
    affiliation:
      type === 'Robotics team'
        ? `Placeholder Robotics — FTC #${10000 + index * 137}`
        : `Placeholder School — ${type}`,
    region: region.label,
    link: i % 3 === 0 ? 'https://projectnextech.org/' : null,
  }
})
