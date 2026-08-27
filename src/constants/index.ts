/**
 * Single source of truth for every non-media constant on the site.
 *
 * Per the brief this file holds social links, big numbers, external links, and
 * in-site document paths — but NO media. Images, videos, and their captions
 * live under public/media/ and are referenced by the components that use them.
 *
 * The 22-course catalog lives in src/data/courses.ts instead, since it is
 * content data rather than site configuration.
 *
 * This file is compiled into the frontend and is deliberately NOT moving to
 * the API service — see NEXTJS_MIGRATION.md §1.5, "What does not move to the
 * backend". It changes twice a year and benefits from code review.
 */

/* ==========================================================================
   Organization
   ========================================================================== */

export const ORG = {
  name: 'Project NexTech',
  legalName: 'Project NexTech, Inc.',
  shortName: 'PNT',
  domain: 'projectnextech.org',
  foundedYear: 2023,
  copyrightYear: 2026,
  tagline: 'Student-led nonprofit organization',
}

/* ==========================================================================
   Emails

   Stored as parts, never as a complete address literal. The scraper-protected
   email component assembles them at render time via CSS pseudo-elements, so a
   full address string appears neither in the DOM nor in this source file.
   ========================================================================== */

export const EMAILS = {
  info: {
    user: 'info',
    domain: 'project nextech',
    tld: 'org',
    purpose: 'For general inquiries about our organization.',
  },
  programs: {
    user: 'programs',
    domain: 'project nextech',
    tld: 'org',
    purpose: 'To schedule programs with our organization.',
  },
  ec: {
    user: 'ec',
    domain: 'project nextech',
    tld: 'org',
    purpose: 'To reach the management for official communication.',
  },
}

/* ==========================================================================
   Social
   ========================================================================== */

/**
 * `cta` is split into [before, platform, after] so the Contact popup can
 * underline just the platform name on hover. The tuple type is what stops a
 * fourth element being added and silently dropped by that component.
 */
export interface SocialLink {
  label: string
  url: string
  cta: readonly [string, string, string]
}

export const SOCIAL = {
  linkedin: {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/project-nextech',
    cta: ['Connect with us on ', 'LinkedIn', ''],
  },
  instagram: {
    label: 'Instagram',
    url: 'https://www.instagram.com/projectnextech/',
    cta: ['Follow us on ', 'Instagram', ''],
  },
  youtube: {
    label: 'YouTube',
    url: 'https://www.youtube.com/@ProjectNexTech',
    cta: ['Subscribe to our ', 'YouTube', ' channel'],
  },
  facebook: {
    label: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61560717552719',
    cta: ['Follow us on ', 'Facebook', ''],
  },
} as const satisfies Record<string, SocialLink>

export type SocialKey = keyof typeof SOCIAL

/** Footer / Contact popup order. */
export const SOCIAL_ORDER: readonly SocialKey[] = [
  'linkedin',
  'instagram',
  'youtube',
  'facebook',
]

export const DISCORD = {
  serverId: '750366801430577263',
  /* Online count, server name, and a sample of online members. Requires
     "Enable Server Widget" in Server Settings → Widget. */
  widgetApi: 'https://discord.com/api/guilds/750366801430577263/widget.json',
  /* The widget endpoint does NOT expose a total member count. This public
     invite lookup does, via approximate_member_count. */
  inviteApi: 'https://discord.com/api/v10/invites/6yHhgpC?with_counts=true',
  invite: 'https://discord.gg/6yHhgpC',
  vanity: 'projectnextech.org/discord',
}

/* ==========================================================================
   Big numbers

   `value` drives the count-up animation; `suffix`/`prefix` are rendered as
   static text so "+" and "$" never animate.
   `onHome: true` marks the subset shown on the Home page — the Impact page
   shows all eight.
   ========================================================================== */

export interface BigNumberSpec {
  key: string
  value: number
  /** Rendered as static text so "$" never animates. */
  prefix?: string
  /** Rendered as static text so "+" never animates. */
  suffix?: string
  label: string
  decimals?: number
  onHome: boolean
}

export const BIG_NUMBERS: readonly BigNumberSpec[] = [
  { key: 'students', value: 2650, suffix: '+', label: 'students taught', onHome: true },
  { key: 'volunteers', value: 340, suffix: '+', label: 'student volunteers', onHome: false },
  { key: 'countries', value: 19, suffix: '+', label: 'countries reached', onHome: true },
  { key: 'hours', value: 7600, suffix: '+', label: 'volunteer hours', onHome: true },
  { key: 'courses', value: 22, suffix: '', label: 'courses made', onHome: false },
  { key: 'raised', value: 15.6, prefix: '$', suffix: 'k+', label: 'amount raised', decimals: 1, onHome: false },
  { key: 'programs', value: 260, suffix: '+', label: 'programs run', onHome: true },
  { key: 'regions', value: 128, suffix: '+', label: 'regions', onHome: false },
]

/* ==========================================================================
   Documents and forms
   ========================================================================== */

export const DOCS = {
  constitution:
    'https://docs.google.com/document/d/1posljuPV7E7J2FoKIQcij3u8srhYzqFB_ICeDiOZeOc',
  /**
   * The PUBLISHED embed (File → Share → Publish to web), which is what the
   * live site uses. A `/preview` URL on the document id above renders a
   * sign-in wall unless the doc happens to be shared link-public; a published
   * URL always renders. Note the id here is the PUBLICATION id and is not the
   * same string as the document id in `constitution` — that is expected.
   */
  constitutionEmbed:
    'https://docs.google.com/document/d/e/2PACX-1vSaaff-zcklIabTOdzSE4GacQ1o_YwWSuJXzWKtF8ProTeE81jBwwpeOZxkSifKN9ITkHyj9y6i9Udw/pub?embedded=true',
  whatIsPnt:
    'https://docs.google.com/presentation/d/18T6YPQbsOw8G0PiixNEzHojUWB8P3dUa2w-_2eBqLao/preview?slide=id.g27ef13cd484_1_1',
  driveRoot: 'https://drive.google.com/drive/folders/0AGqn2uvn83zJUk9PVA',
  calendar:
    'https://calendar.google.com/calendar/embed?src=c_23b9c73e8de272f26064ca35b0bc95d8784b0f4c0d4defa8b35c1ff6aa5ae9d7%40group.calendar.google.com',
  programBookings:
    'https://docs.google.com/spreadsheets/d/1p_Ojxthqf-Vj0SmzJf80Y8qC-L6Kn5Dcsf3zYnNJ-_s/edit?gid=1955344450#gid=1955344450',
  signupSheet:
    'https://docs.google.com/spreadsheets/d/1p_Ojxthqf-Vj0SmzJf80Y8qC-L6Kn5Dcsf3zYnNJ-_s/edit?gid=983163540#gid=983163540',
  registrationForm:
    'https://docs.google.com/document/d/1meRskWvpc-wMwAVi_CfZRpxyldxRjPualNhFVYsZTf4',
  projectGroupTracker:
    'https://docs.google.com/spreadsheets/d/1140t67EhOkUyyc30fa_d6Ke-yQU9NVsTZlleJH4wmbA',
  longTermPlan:
    'https://docs.google.com/spreadsheets/d/1LW9pFXcfG8Hn3ynOLsCmPgUx6ongnfX0AFwxk7u6uZQ/edit?gid=1063408154#gid=1063408154',
  ecManagerNotes:
    'https://docs.google.com/document/d/1O5JmypcRrpNWom3l99o4bfTekEfkyJ9VSyWKgReSEFs',
  boardOfDirectorsNotes:
    'https://docs.google.com/document/d/1pplpOTrCn5gszlLMfmhxFSYxdLQa0FA0IpZSG5ITTBI/edit?tab=t.0',
  boardOfAdvisorsNotes:
    'https://docs.google.com/document/d/1pU8jV5eoH0ubx7btUl0JRbY2CsWSAPRNk5Czgma8fIg/edit?tab=t.0#heading=h.zdze73fp6uun',
  websiteTeamInfo:
    'https://docs.google.com/spreadsheets/d/1SoLfeUgAwgDOGFg4oYC_vHx8lm-_RCQz_wpcS_KKfbc/edit?gid=0#gid=0',
  curriculumAuditLog:
    'https://docs.google.com/spreadsheets/d/1rjH9Cob0Wl83wui3rFLcMlSUImKYA8I1ZInBKfQqsjs',
}

export const FORMS = {
  /** Placeholder until the real Leadership Application exists. */
  leadershipApplication: 'https://forms.gle/KBJzrhxrG6FNEBtz7',
  /** Embedded on Contribute. Taken from the live site's /contribute page. */
  partnership:
    'https://docs.google.com/forms/d/e/1FAIpQLSfThOoGtbO4ltvp2bOnRIBv-Ivj4qt_MjZdB12cdPIfDdjrnQ/viewform',
  projectGroupCreation: 'https://forms.gle/vMXqw5e1zPH7m47b9',
  hoursRequest: 'https://forms.gle/PneL4s3LXThXmNKt5',
  /**
   * The volunteer registration form, linked from the news bar. This is the
   * same form the live site embeds on its /join page as
   * docs.google.com/forms/d/e/1FAIpQLScpE2rJqM4gI4q5C2Ry7PtYJZobi8DX6wITFvSlhmXKadXA_A —
   * the forms.gle link below is its short URL. Do not add a second copy.
   */
  enrollment2026: 'https://forms.gle/Qe4hNkH8CN6eaew89',
  postEvent: 'https://forms.gle/GF1jbatjjcoSBWHn8',
  reimbursementRequest: 'https://forms.gle/puYRwhwpQbopSZ6E9',
  anonymousFeedback: 'https://forms.gle/KBJzrhxrG6FNEBtz7',
  temporaryDriveAccess: 'https://forms.gle/xo5C7T5qyg5Ls4G86',
}

/**
 * Donorbox campaign for the Contribute page.
 *
 * OPEN ITEM: the live site's Contribute page does not expose a campaign slug,
 * The slug and the query string below are the live site's, lifted verbatim
 * from its DonorboxEmbed component so the two sites collect donations against
 * the same campaign with the same defaults.
 *
 * `embedParams` is what makes the form open on a monthly interval at $100 and
 * tags the gift with a designation. Dropping it still works — you just get
 * Donorbox's own defaults instead.
 */
export const DONORBOX = {
  campaignSlug: 'donate-to-project-nextech',
  embedBase: 'https://donorbox.org/embed/',
  embedParams:
    'default_interval=m&designation=General+donation+that+our+student+leaders+may+allocate+as+needed&amount=100',
}

/**
 * Google MyMap shown on the Impact page.
 *
 * WARNING: the `/u/0/` segment is a Google ACCOUNT SLOT, not part of the map
 * id. This URL previously said `/u/2/`, which resolves only for someone whose
 * third signed-in Google account can see the map — for everyone else the
 * iframe renders a permission error. The live site uses `/u/0/` and works.
 * Keep it at 0 whatever My Maps hands you when you copy an embed URL.
 */
export const MYMAP = {
  embedUrl:
    'https://www.google.com/maps/d/u/0/embed?mid=1cfW8EF2DcCvJ3TkhxMR73vx3O3sCFfA&ehbc=2E312F',
}

/**
 * Quarterly impact report PDFs.
 *
 * PLACEHOLDER: every entry currently points at the same stand-in PDF committed
 * at public/documents/impact-reports/placeholder-report.pdf, purely so the
 * links are clickable during review. Replace `path` per report with the real
 * files (or Drive URLs) when they exist.
 *
 * A `file:///` path to a PDF sitting on someone's machine cannot be used here:
 * browsers block file:// navigation from an http(s) page, so such a link does
 * nothing when clicked. Copying the file into public/ is what makes it work.
 */
const PLACEHOLDER_REPORT = '/documents/impact-reports/placeholder-report.pdf'

export interface ImpactReport {
  label: string
  path: string
}

export const IMPACT_REPORTS: readonly ImpactReport[] = [
  { label: 'Fall 2026 Impact Report', path: PLACEHOLDER_REPORT },
  { label: 'Summer 2026 Impact Report', path: PLACEHOLDER_REPORT },
  { label: 'Spring 2026 Impact Report', path: PLACEHOLDER_REPORT },
  { label: 'Winter 2025 Impact Report', path: PLACEHOLDER_REPORT },
]

export const MEDIA_LINKS = {
  /** Placeholder video until the real volunteer info video is recorded. */
  volunteerInfoVideo: 'https://www.youtube.com/watch?v=LDU_Txk06tM',
  volunteerSlidesEmbed:
    'https://docs.google.com/presentation/d/e/2PACX-1vTMRe5ohfcSK208TugQNBneEb-0pdRfM-7Z-aY55nKSu9zUDd3wyK40giYneeY5UR0wI4Uh5oulXvMB/pubembed?start=true&loop=true&delayms=3000',
}

/* ==========================================================================
   Dashboard "wall of links"
   ========================================================================== */

/**
 * The handful of links a volunteer reaches for most often, surfaced as buttons
 * above the full list so they don't have to be hunted for.
 */
export interface DashboardLink {
  label: string
  url: string
  /** Overrides the group's default icon. Named against the Icon registry. */
  icon?: string
}

export interface DashboardLinkGroup {
  title: string
  /** Explicit placement — see the note below on why this is not grid flow. */
  column: 'left' | 'right'
  /** Default icon for every link in the group. */
  icon: string
  links: readonly DashboardLink[]
}

export const DASHBOARD_QUICK_LINKS: readonly Required<DashboardLink>[] = [
  { label: 'Hours Request Form', url: FORMS.hoursRequest, icon: 'form' },
  { label: 'Post-Event Form', url: FORMS.postEvent, icon: 'form' },
  { label: 'Reimbursement Request Form', url: FORMS.reimbursementRequest, icon: 'form' },
  { label: 'Project NexTech Constitution', url: DOCS.constitution, icon: 'document' },
  { label: 'Signup Sheet', url: DOCS.signupSheet, icon: 'sheet' },
]

/**
 * The Dashboard "wall of links", grouped by what kind of thing each link is
 * rather than by the brief's original main/additional split — the flat lists
 * were hard to scan once every link was on screen at once.
 *
 * `icon` on a group is the default for its links; a link can override it
 * (the social entries carry their own brand marks).
 *
 * `column` places each group explicitly rather than letting a two-column grid
 * flow them. Grid flow tied the groups into shared rows, so a short group left
 * a gap under itself waiting for the tall group beside it.
 */
const DASHBOARD_LINK_GROUPS_ALL: readonly DashboardLinkGroup[] = [
  {
    title: 'Forms',
    column: 'left',
    icon: 'form',
    links: [
      { label: 'Hours Request Form', url: FORMS.hoursRequest },
      { label: 'Enrollment Form (2026)', url: FORMS.enrollment2026 },
      { label: 'Post-Event Form', url: FORMS.postEvent },
      { label: 'Reimbursement Request Form', url: FORMS.reimbursementRequest },
      { label: 'Project Group Creation Form', url: FORMS.projectGroupCreation },
      { label: 'Anonymous Feedback Form', url: FORMS.anonymousFeedback },
      { label: 'Temporary Drive Access Form', url: FORMS.temporaryDriveAccess },
    ],
  },
  {
    title: 'Spreadsheets',
    column: 'right',
    icon: 'sheet',
    links: [
      { label: 'Program Bookings', url: DOCS.programBookings },
      { label: 'Signup Sheet', url: DOCS.signupSheet },
      { label: 'Project Group Tracker', url: DOCS.projectGroupTracker },
      { label: 'Long-Term Plan', url: DOCS.longTermPlan },
      { label: 'Website Team Information', url: DOCS.websiteTeamInfo },
      { label: 'Curriculum Audit Log', url: DOCS.curriculumAuditLog },
    ],
  },
  {
    title: 'Documents',
    column: 'left',
    icon: 'document',
    links: [
      { label: 'Project NexTech Constitution', url: DOCS.constitution },
      { label: 'What is Project NexTech?', url: DOCS.whatIsPnt },
      { label: 'Registration Form', url: DOCS.registrationForm },
      { label: 'EC/Manager Meeting Notes', url: DOCS.ecManagerNotes },
      { label: 'BD Meeting Notes', url: DOCS.boardOfDirectorsNotes },
      { label: 'BA Meeting Notes', url: DOCS.boardOfAdvisorsNotes },
    ],
  },
  {
    title: 'Google Workspace',
    column: 'right',
    icon: 'folder',
    links: [
      { label: 'Google Drive', url: DOCS.driveRoot },
      { label: 'Google Calendar', url: DOCS.calendar, icon: 'calendar' },
    ],
  },
  {
    title: 'Site and social',
    column: 'right',
    icon: 'globe',
    links: [
      { label: 'projectnextech.org', url: 'https://projectnextech.org/' },
      { label: 'Discord', url: DISCORD.invite, icon: 'discord' },
      { label: 'LinkedIn', url: SOCIAL.linkedin.url, icon: 'linkedin' },
      { label: 'Instagram', url: SOCIAL.instagram.url, icon: 'instagram' },
      { label: 'YouTube', url: SOCIAL.youtube.url, icon: 'youtube' },
      { label: 'Facebook', url: SOCIAL.facebook.url, icon: 'facebook' },
    ],
  },
]

/**
 * Anything already surfaced as a quick-link button is dropped from the list
 * below it, so no link appears twice on the page.
 *
 * Derived rather than hand-pruned: promoting another link to a button removes
 * it from the list automatically, and demoting one puts it back.
 */
const QUICK_LINK_URLS = new Set(DASHBOARD_QUICK_LINKS.map((link) => link.url))

export const DASHBOARD_LINK_GROUPS = DASHBOARD_LINK_GROUPS_ALL.map((group) => ({
  ...group,
  links: group.links.filter((link) => !QUICK_LINK_URLS.has(link.url)),
})).filter((group) => group.links.length > 0)

/* ==========================================================================
   Subjects

   The leading digit of a course code maps to a subject. Used by the Curriculum
   slider and the Programs subject filter.
   ========================================================================== */

export interface Subject {
  /** The leading digit of a course code. */
  id: number
  key: string
  label: string
}

export const SUBJECTS: readonly Subject[] = [
  { id: 1, key: 'engineering', label: 'Engineering' },
  { id: 2, key: 'mentoring', label: 'Mentoring' },
  { id: 3, key: 'programming', label: 'Programming' },
  { id: 4, key: 'physics-math', label: 'Physics/Math' },
  { id: 5, key: 'natural-sciences', label: 'Natural Sciences' },
]

/* ==========================================================================
   Grades

   0 === Kindergarten throughout the codebase. Ages are the typical US range
   and are shown alongside the grade in the Programs dropdown.
   ========================================================================== */

export interface GradeSpec {
  /** 0 === Kindergarten throughout the codebase. */
  grade: number
  label: string
  ages: string
}

export const GRADES: readonly GradeSpec[] = [
  { grade: 0, label: 'Kindergarten', ages: '5-6' },
  { grade: 1, label: '1st grade', ages: '6-7' },
  { grade: 2, label: '2nd grade', ages: '7-8' },
  { grade: 3, label: '3rd grade', ages: '8-9' },
  { grade: 4, label: '4th grade', ages: '9-10' },
  { grade: 5, label: '5th grade', ages: '10-11' },
  { grade: 6, label: '6th grade', ages: '11-12' },
  { grade: 7, label: '7th grade', ages: '12-13' },
  { grade: 8, label: '8th grade', ages: '13-14' },
  { grade: 9, label: '9th grade', ages: '14-15' },
  { grade: 10, label: '10th grade', ages: '15-16' },
  { grade: 11, label: '11th grade', ages: '16-17' },
  { grade: 12, label: '12th grade', ages: '17-18' },
]

/**
 * Maps the materials vocabulary used in src/data/courses.js onto Icon names.
 * Anything unmapped falls back to a plain tag icon, so a new material won't
 * crash a card — but add it here so it gets a meaningful glyph.
 */
export const MATERIAL_ICONS: Record<string, string> = {
  Screen: 'screen',
  Computers: 'computer',
  Whiteboard: 'whiteboard',
  Paper: 'paper',
  'Pens/Pencils': 'pencil',
  'Craft Materials': 'craft',
  'Household Materials': 'household',
  Water: 'water',
  'Robot Kits': 'robot',
  Workspace: 'workspace',
}

/** Transition points marked on the Curriculum grade number-line. */
export const SCHOOL_TRANSITIONS: readonly { after: number; label: string }[] = [
  { after: 5, label: 'Elementary / Middle' },
  { after: 8, label: 'Middle / High' },
]

/* ==========================================================================
   Regions and program locations
   ========================================================================== */

export const REGIONS: readonly string[] = [
  'San Diego (US 1)',
  'Houston (US 10)',
  'Monterrey (MX 1)',
  'Dhaka (BD 1)',
  'Cleveland (US 19)',
  'Los Angeles (US 6)',
]

/** Sentinel for an unfiltered dropdown/checkbox group on the Programs page. */
export const FILTER_ANY = 'any'

/**
 * Online programs are treated as their own region rather than being assigned
 * to a city. They appear in results and in the region dropdown, but have no
 * coordinates and so never appear on the map.
 */
export const ONLINE_REGION = 'Online'

const SD = 'San Diego (US 1)'
const HOU = 'Houston (US 10)'
const MTY = 'Monterrey (MX 1)'
const DHK = 'Dhaka (BD 1)'
const CLE = 'Cleveland (US 19)'
const LA = 'Los Angeles (US 6)'

/**
 * Real venues PNT has used, supplied in the brief.
 *
 * NOTE FOR PHASE 5: these have no latitude/longitude yet. The Leaflet map needs
 * coordinates per venue — either a hardcoded lookup added here or a one-time
 * geocoding pass whose results get committed. Do not geocode at runtime.
 */
export interface Location {
  name: string
  address: string
  /** `null` only for the Online pseudo-venue, which has no physical region. */
  region: string | null
  /** Online programs appear in results but have no coordinates, so never plot. */
  online?: boolean
}

export const LOCATIONS: readonly Location[] = [
  { name: 'College-Rolando Library', address: '6600 Montezuma Rd, San Diego, CA 92115', region: SD },
  { name: 'Francis Parker School', address: '6501 Linda Vista Rd, San Diego, CA 92111', region: SD },
  { name: 'Mission Hills Branch Library', address: '215 W Washington St, San Diego, CA 92103', region: SD },
  { name: 'Rancho Penasquitos Branch Library', address: '13330 Salmon River Rd, San Diego, CA 92129', region: SD },
  { name: 'North Park Branch Library', address: '3795 31st St, San Diego, CA 92104', region: SD },
  { name: 'Rancho Bernardo Branch Library', address: '17110 Bernardo Center Dr, San Diego, CA 92128', region: SD },
  { name: 'Ocean Beach Branch Library', address: '4801 Santa Monica Ave, San Diego, CA 92107', region: SD },
  { name: 'Scripps Miramar Ranch Branch Library', address: '10301 Scripps Lake Dr, San Diego, CA 92131', region: SD },
  { name: 'Point Loma / Hervey Branch Library', address: '3701 Voltaire St, San Diego, CA 92107', region: SD },
  { name: 'Carmel Mountain Ranch Branch Library', address: '12095 World Trade Dr, San Diego, CA 92128', region: SD },
  { name: 'Mira Mesa Branch Library', address: '8405 New Salem St, San Diego, CA 92126', region: SD },
  { name: 'North Clairemont Library', address: '4616 Clairemont Dr, San Diego, CA 92117', region: SD },
  { name: 'Morning Creek Elementary', address: '10925 Morning Creek Dr S, San Diego, CA 92128', region: SD },
  { name: 'San Ysidro Library', address: '4235 Beyer Blvd, San Diego, CA 92173', region: SD },
  { name: 'University Heights Branch Library', address: '4193 Park Blvd, San Diego, CA 92103', region: SD },
  { name: 'Qualcomm Building AY', address: '10155 Pacific Heights Blvd, San Diego, CA 92121', region: SD },
  { name: 'Carmel Valley Library', address: '3919 Townsgate Dr, San Diego, CA 92130', region: SD },
  { name: 'Pacific Beach/Taylor Library', address: '4275 Cass St, San Diego, CA 92109', region: SD },
  { name: 'Paradise Hills Library', address: '5922 Rancho Hills Dr, San Diego, CA 92139', region: SD },
  { name: 'Canyon View Elementary', address: '9225 Adolphia St, San Diego, CA 92129', region: SD },
  { name: 'San Diego Miramar College', address: '10440 Black Mountain Rd, San Diego, CA 92126', region: SD },
  { name: 'Balboa Library', address: '4255 Mt. Abernathy Ave, San Diego, CA 92117', region: SD },
  { name: 'Cherokee Point Elementary', address: '3735 38th St, San Diego, CA 92105', region: SD },
  { name: 'Otay Mesa-Nestor Library', address: '3003 Coronado Ave, San Diego, CA 92154', region: SD },
  { name: 'Pacific View Leadership Elementary School', address: '6196 Childs Ave, San Diego, CA 92139', region: SD },
  { name: '4S Ranch Branch Library', address: '10433 Reserve Dr, San Diego, CA 92127', region: SD },
  { name: 'Pacific Highlands Ranch Library', address: '12911 Pacific Pl, San Diego, CA 92130', region: SD },
  { name: 'Chula Vista Middle School', address: '415 5th Ave, Chula Vista, CA 91910', region: SD },
  { name: 'Cardiff-by-the-Sea Library', address: '2081 Newcastle Ave, Cardiff, CA 92007', region: SD },
  { name: 'Linda Vista Library', address: '2160 Ulric St, San Diego, CA 92111', region: SD },
  { name: 'Allied Gardens/Benjamin Library', address: '5188 Zion Ave, San Diego, CA 92120', region: SD },
  { name: 'Julia Ideson Library', address: '500 McKinney St, Houston, TX 77002', region: HOU },
  { name: 'Heights Neighborhood Library', address: '1302 Heights Blvd, Houston, TX', region: HOU },
  { name: 'Alief-Henington Regional Library', address: '11903 Bellaire Blvd, Houston, TX 77072', region: HOU },
  { name: 'Alice McKean Young Neighborhood Library', address: '5107 Griggs Road, Houston, TX 77021', region: HOU },
  { name: 'Biblioteca Pública Municipal Loma Linda', address: 'Océano Indico 414, Loma Linda, Monterrey, Nuevo León 64210', region: MTY },
  { name: 'Biblioteca Pública Municipal Miguel de Cervantes Saavedra', address: 'Av. Morones Prieto, Col. Buenos Aires, Monterrey, Nuevo León 64800', region: MTY },
  { name: 'American School Foundation of Monterrey', address: 'Ave. Ignacio Morones Prieto No. 1500, San Isidro, Monterrey, Nuevo León', region: MTY },
  { name: 'San Roberto International School', address: 'Real San Agustín No.4, San Pedro Garza Garcia, Nuevo León 66260', region: MTY },
  { name: 'Madrasa', address: '5M83+GH, Bangladesh', region: DHK },
  { name: 'Cleveland Public Library', address: '325 Superior Ave E, Cleveland, OH 44114', region: CLE },
  { name: 'Martin Luther King, Jr. Branch Library', address: '10601 Euclid Ave, Cleveland, OH 44106', region: CLE },
  { name: 'Carnegie West Library', address: '1900 Fulton Rd, Cleveland, OH', region: CLE },
  { name: 'Public Administration Library', address: '601 Lakeside Ave E #100, Cleveland, OH', region: CLE },
  { name: 'Los Angeles Public Library Central', address: '630 W 5th St, Los Angeles, CA 90071', region: LA },
  { name: 'West Los Angeles Regional Branch', address: '11360 Santa Monica Blvd, Los Angeles, CA 90025', region: LA },
  { name: 'West Valley Regional Branch', address: '19036 Vanowen St, Reseda, CA 91335', region: LA },
  { name: 'Los Angeles Elementary School', address: '1211 S Hobart Blvd, Los Angeles, CA 90006', region: LA },
  /* Online programs have no physical venue. See CLAUDE.md — how these should
     behave in the region filter and on the map is an open Phase 5 question. */
  { name: 'Online', address: 'N/A', region: null, online: true },
]

/** Session labels available to a program. */
export const SESSIONS: readonly string[] = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6']

/* ==========================================================================
   Navigation
   ========================================================================== */

/**
 * A nav item either navigates (`to`) or triggers site-wide UI (`action`) —
 * never both, and never neither. The union makes that structural rather than a
 * convention the Navbar has to defend against.
 */
export type NavItem =
  | { label: string; to: string; action?: never }
  | { label: string; action: 'contact' | 'login'; to?: never }

export const NAV_PRIMARY: readonly NavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Impact', to: '/impact' },
  { label: 'Programs', to: '/programs' },
  { label: 'Curriculum', to: '/curriculum' },
  { label: 'Leadership', to: '/leadership' },
  { label: 'Project Groups', to: '/project-groups' },
  { label: 'Contribute', to: '/contribute' },
  { label: 'Volunteer', to: '/volunteer' },
]

/**
 * Right-hand nav items. These collapse into the hamburger first; at the
 * narrowest breakpoint NAV_PRIMARY joins them and only the logo stays visible.
 */
export const NAV_UTILITY: readonly NavItem[] = [
  { label: 'Contact', action: 'contact' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Log In', action: 'login' },
]

export const NAV_FOOTER: readonly NavItem[] = [
  { label: 'Terms', to: '/terms' },
  { label: 'Policies', to: '/policies' },
]

/* ==========================================================================
   News bar

   Sits above the navbar. Set `enabled: false` to hide it sitewide.
   ========================================================================== */

export const NEWS_BAR = {
  enabled: true,
  text: 'Placeholder announcement — enrollment for the 2026 season is now open.',
  buttonLabel: 'Enroll now',
  buttonHref: FORMS.enrollment2026,
}

/* ==========================================================================
   Home page
   ========================================================================== */

/** Rotating hero taglines, in this order. */
export const HERO_TAGLINES: readonly string[] = [
  'Free and effective STEM education',
  'For students, by students',
  'Teaching students around the world',
]

export const HOME_CTAS: readonly NavItem[] = [
  { label: 'Find a program', to: '/programs' },
  { label: 'About us', to: '/about' },
  { label: 'Meet the team', to: '/leadership' },
  { label: 'Volunteer with us', to: '/volunteer' },
  { label: 'Contribute', to: '/contribute' },
  { label: 'Host a program', action: 'contact' },
]

/* ==========================================================================
   Partner tiers (About page)
   ========================================================================== */

/**
 * `tone` is a semantic name, NOT a class name. The prototype shipped Tailwind
 * utilities here (`className: 'text-accent'`), which meant this file knew how
 * the About page styled its cards. The About page now maps a tone onto one of
 * its own module classes; constants stay ignorant of styling.
 */
export type PartnerTone = 'accent' | 'accent-alt' | 'bronze' | 'silver' | 'gold'

export interface PartnerTier {
  label: string
  tone: PartnerTone
  bold: boolean
}

export const PARTNER_TIERS = {
  operating: { label: 'Operating Partner', tone: 'accent', bold: false },
  supporting: { label: 'Supporting Partner', tone: 'accent-alt', bold: false },
  bronze: { label: 'Bronze Sponsor', tone: 'bronze', bold: true },
  silver: { label: 'Silver Sponsor', tone: 'silver', bold: true },
  gold: { label: 'Gold Sponsor', tone: 'gold', bold: true },
} as const satisfies Record<string, PartnerTier>

export type PartnerTierKey = keyof typeof PARTNER_TIERS

/* ==========================================================================
   Data file paths (in-site, served from public/)
   ========================================================================== */

export const DATA_PATHS = {
  programsCsv: '/data/programs.csv',
}
