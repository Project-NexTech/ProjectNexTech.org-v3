/**
 * Leadership roster for the Leadership page.
 *
 * PROVENANCE: every person, role, bio, join date, grade, school, region, and
 * LinkedIn URL here is REAL, taken from the live site's team page and
 * `src/data/teamData.ts` in ../ProjectNexTech.org-new (captured 2026-08-26).
 * Nothing on this page is invented any more.
 *
 * The brief states this page is maintained by hand rather than from a
 * database, so editing these entries directly is the intended workflow.
 *
 * MEDIA FOLDERS ARE NAMED AFTER THE PERSON, NOT NUMBERED.
 *
 * The scaffolding used `member-01`, `member-02`, ... which works only until
 * someone leaves or joins in the middle of a group: every folder below them
 * then refers to a different person, and each photo silently belongs to the
 * wrong face. No error, no type failure. `slug` below is the single source of
 * both the folder name and the image paths, so the two cannot drift.
 *
 * `shots` is how many carousel photos that person actually has. It is a real
 * count, not a convention — several people have four rather than five, and the
 * advisors' chair has a portrait only. Add a photo, bump the number.
 *
 * PHOTOS WITHOUT A HOME: Varshith Vijjapu and Colin Thompson have complete
 * photo sets on the live site but appear nowhere on its team page; J.P. Pierce
 * and Jocelyn Slape are advisors, which render as name-only cards here; Kush
 * Kharia has a portrait only. All five sets were copied to
 * public/media/leadership/unlisted/ so nothing is lost, and none is referenced
 * from this file. Wire one up by moving its folder and adding an entry here.
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
  /** Comma-separated, rendered as its own popup row. Absent for some people. */
  extracurriculars?: string
  /** Comma-separated, rendered as its own popup row. Absent for some people. */
  interests?: string
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
  /** Folder name under public/media/leadership/<group>/ AND the React key. */
  slug: string
  group: string
  name: string
  roles: string[]
  /** How many carousel-NN.png files actually exist for this person. */
  shots: number
  joinDate: string
  grade: string
  school: string
  region: string
  linkedin: string | null
  extracurriculars?: string
  interests?: string
  paragraphs: string[]
}

function member(input: MemberInput): LeadershipMember {
  const dir = `/media/leadership/${input.group}/${input.slug}`

  return {
    id: input.slug,
    name: input.name,
    /* `role` is the primary title shown on the card; `roles` is the full list
       shown in the popup, since people commonly hold more than one. */
    role: input.roles[0],
    roles: input.roles,
    image: `${dir}/portrait.png`,
    /* No captions: these are candid photos the live site never captioned, and
       Carousel omits the caption block entirely when there is nothing to show.
       Inventing captions for real photographs would be worse than none. */
    carousel: Array.from({ length: input.shots }, (_, i) => ({
      src: `${dir}/carousel-${String(i + 1).padStart(2, '0')}.png`,
      caption: '',
    })),
    paragraphs: input.paragraphs,
    joinDate: input.joinDate,
    grade: input.grade,
    school: input.school,
    region: input.region,
    linkedin: input.linkedin,
    extracurriculars: input.extracurriculars,
    interests: input.interests,
  }
}

/* ==========================================================================
   Executive Committee
   ========================================================================== */

export const EXECUTIVE_COMMITTEE: readonly LeadershipMember[] = [
  member({
    slug: 'matthew-hsu',
    group: 'executive-committee',
    name: 'Matthew Hsu',
    roles: ['Director of Operations'],
    shots: 5,
    joinDate: 'May 29, 2024',
    grade: '12th grade',
    school: 'Homeschool',
    region: 'San Diego, CA',
    linkedin: 'https://www.linkedin.com/in/matthew-hsu-a00a48362/',
    extracurriculars: 'Robotics, Competitive Math, Competitive Physics',
    interests: 'Engineering, Robotics, Physics, Computer-Aided Design, Programming',
    paragraphs: [
      'Matthew manages the Project NexTech leadership team, coordinates volunteers, and leads the development and teaching of Engineering curriculum. He also teaches programs in San Diego and is a member of the Executive Committee. Matthew volunteers with Project NexTech because he loves to help younger students discover STEM through interactive projects. He wants to meaningfully expand STEM access across underserved communities.',
      "Outside of Project NexTech, Matthew is the captain of his robotics team, NOMAD. He also builds engineering projects; competes in math, computer science, and physics contests; coaches science olympiad; and volunteers to help students through faith.",
    ],
  }),
  member({
    slug: 'pryya-surarujiroj',
    group: 'executive-committee',
    name: 'Pryya "Sompan" Surarujiroj',
    roles: ['Director of Curriculum'],
    shots: 5,
    joinDate: 'April 1, 2025',
    grade: '12th grade',
    school: 'Rancho Bernardo High School',
    region: 'San Diego, CA',
    linkedin: null,
    interests: 'Biology, Neuroscience, Programming, Colorguard, Art',
    paragraphs: [
      'Sompan develops curriculum about chemistry, biology, and earth science. She also helps book and teach programs in San Diego. Sompan volunteers with Project NexTech to give back to her community and share her passion for STEM with students who may be less fortunate.',
      "Outside of Project NexTech, Sompan is a member of her school's Color Guard and is a member of FRC Team 2658. She also teaches programming for a local business.",
    ],
  }),
  member({
    slug: 'tanvi-gupta',
    group: 'executive-committee',
    name: 'Tanvi Gupta',
    roles: ['Director of Outreach'],
    shots: 5,
    joinDate: 'July 15, 2025',
    grade: '12th grade',
    school: 'Lawrence E. Elkins High School',
    region: 'Houston, TX',
    linkedin: null,
    extracurriculars: 'Research, Engineering, Choir, Reading',
    interests: 'Music, Chemistry, Engineering, Math, Volunteering',
    paragraphs: [
      "Tanvi leads Project NexTech's Logistics team, reaching out to new locations and organizing programs. She is also a member of the Executive Committee and teaches programs in Houston. Tanvi volunteers with Project NexTech because she wants to provide others with access to STEM education that she had growing up.",
      "Outside of Project NexTech, Tanvi is very involved with marketing and business for a local company, her school's choir, and conducts faith-driven volunteering for fun.",
    ],
  }),
  member({
    slug: 'ishan-jha',
    group: 'executive-committee',
    name: 'Ishan Jha',
    roles: ['Director of Analytics'],
    shots: 5,
    joinDate: 'September 24, 2025',
    grade: '10th grade',
    school: 'Del Norte High School',
    region: 'San Diego, CA',
    linkedin: null,
    extracurriculars: 'CyberPatriot, Software Development, Tennis',
    interests: 'Tennis, Programming, Math, Science, Cricket',
    paragraphs: [
      'Ishan leads the creation and teaching of Physics/Math curriculum in Project NexTech. He also teaches programs in San Diego, and is a member of the Executive Committee. Ishan volunteers with Project NexTech to give to students who are less fortunate, because he believes everyone deserves equal access to quality education.',
      'Outside of Project NexTech, Ishan enjoys building software applications and competing in cybersecurity and programming competitions.',
    ],
  }),
  member({
    slug: 'daniel-eremin',
    group: 'executive-committee',
    name: 'Daniel Eremin',
    roles: ['Director of Software'],
    shots: 5,
    joinDate: 'April 21, 2024',
    grade: '12th grade',
    school: 'Francis Parker School',
    region: 'San Diego, CA',
    linkedin: 'https://www.linkedin.com/in/daniel-eremin-269a45355/',
    extracurriculars: 'Robotics, Sailing, Tennis, Soccer, Hackathons',
    interests:
      'Robotics, Science, Frontend Website Design, Control Systems, Programming, Math, Engineering, Sailing',
    paragraphs: [
      'Daniel manages the website, Discord server, and Google Workspace, and updates internal databases. He also sometimes creates Programming curriculum and teaches programs in San Diego. Daniel volunteers with Project NexTech because he enjoys helping people, and education is a good way to help others.',
      "Outside of Project NexTech, Daniel is an avid technology enthusiast, programmer, and electrical engineer, coding and wiring on his school's robotics team. He also plays soccer and tennis, and sails.",
    ],
  }),
]

/* ==========================================================================
   Department Managers
   ========================================================================== */

export const DEPARTMENT_MANAGERS: readonly LeadershipMember[] = [
  member({
    slug: 'forest-liang',
    group: 'department-managers',
    name: 'Forest Liang',
    roles: ['Curriculum Manager'],
    shots: 5,
    joinDate: 'August 22, 2024',
    grade: '11th grade',
    school: 'Francis Parker School',
    region: 'San Diego, CA',
    linkedin: null,
    extracurriculars: 'Robotics, FIRST Volunteering, FIRST Mentoring, Cross Country, Track',
    interests: 'Machining, Programming, Science, Running, History, Engineering',
    paragraphs: [
      'Forest leads programs and curricula in the Mentoring department, teaching programs in San Diego and helping robotics teams around the world. He volunteers with Project NexTech because he recognizes the importance of STEM education for students, and wants others to have the opportunities he had.',
      "Outside of Project NexTech, Forest leads manufacturing and assembly in his school's robotics team, and is also part of the programming and wiring teams. He also runs for Cross Country and Track and Field at school.",
    ],
  }),
  member({
    slug: 'jayati-babla',
    group: 'department-managers',
    name: 'Jayati Babla',
    roles: ['Curriculum Manager'],
    shots: 4,
    joinDate: 'March 13, 2025',
    grade: '11th grade',
    school: 'Francis Parker School',
    region: 'San Diego, CA',
    linkedin: null,
    extracurriculars: 'Model United Nations, Key Club, Ceramics',
    interests: 'Politics, History, Art, Biology, Basketball',
    paragraphs: [
      'Jayati leads Natural Sciences curricula and programs at Project NexTech. She also teaches programs in San Diego and helps with social media advertising and outreach. She volunteers with Project NexTech because she wants to aid the education of students who might otherwise receive little exposure to science and technology.',
      "Outside of Project NexTech, Jayati is an involved member of her school's Model United Nations team, researching for and attending conferences. She also volunteers with Girl Scouts and Key Club, and makes ceramic art.",
    ],
  }),
  member({
    slug: 'aanya-babla',
    group: 'department-managers',
    name: 'Aanya Babla',
    roles: ['Social Media Manager'],
    shots: 4,
    joinDate: 'March 31, 2025',
    grade: '11th grade',
    school: 'Francis Parker School',
    region: 'San Diego, CA',
    linkedin: null,
    extracurriculars: 'Crochet, Hiking, Reading',
    paragraphs: [
      "Aanya leads Project NexTech's social media presence and informs the community about Project NexTech's work. She also teaches programs in San Diego. Aanya volunteers with Project NexTech to make learning about STEM accessible and enjoyable to all.",
      'Outside of Project NexTech, Aanya loves to help her community through Key Club, volunteer at Girl Scouts summer camps, participate in Feminist Club, and spend time with her family.',
    ],
  }),
]

/* ==========================================================================
   Board of Directors
   ========================================================================== */

export const BOARD_OF_DIRECTORS: readonly LeadershipMember[] = [
  member({
    slug: 'shounak-ray-chaudhuri',
    group: 'board-of-directors',
    name: 'Shounak Ray Chaudhuri',
    roles: ['Chair'],
    shots: 5,
    joinDate: 'May 19, 2023',
    grade: '1st year',
    school: 'Caltech',
    region: 'San Diego, CA',
    linkedin: 'https://www.linkedin.com/in/shounakrc/',
    extracurriculars: 'STEM Research, Science Fair, Robotics, Speech and Debate, Sailing',
    interests:
      'Autonomous Vehicles, Mechanical Design, Computer Vision, Mechatronics, Machine Learning, Mathematics, Geopolitics, Music',
    paragraphs: [
      'Shounak leads Project NexTech, running backend logistics, coordinating the Executive Committee, and leadership team, filling in wherever help is needed. He also mentors robotics teams and teaches programs in San Diego. Shounak founded Project NexTech in 2023 because he has benefitted from high-quality STEM education growing up, and sees Project NexTech as the best way to pass that along to students around the world.',
      'Outside of Project NexTech, Shounak engineers robots, builds software systems, conducts academic research, presents at science fairs, competes in Speech and Debate, leads multiple school clubs, and develops advanced autonomous vehicle projects.',
    ],
  }),
  member({
    slug: 'peyton-slape',
    group: 'board-of-directors',
    name: 'Peyton Slape',
    roles: ['Senior Member'],
    shots: 5,
    joinDate: 'July 8, 2024',
    grade: '2nd year',
    school: 'San Diego Miramar College',
    region: 'San Diego, CA',
    linkedin: 'https://www.linkedin.com/in/peyton-slape-5b4756303/',
    extracurriculars: 'STEM Research, Robotics Mentoring, AUV Competitions',
    interests:
      'Mechanobiology, Biomechanics, Control Theory, Robot Localization, Bioengineering',
    paragraphs: [
      "Peyton leads Project NexTech's curriculum efforts, coordinating the curriculum departments and creating curriculum materials. He also mentors robotics teams and teaches programs in San Diego and is a member of the Board of Directors. Peyton volunteers with Project NexTech because he wants to give back, using his skills and experience to expand access to curriculum he had less exposure to growing up.",
      'Outside of Project NexTech, Peyton mentors robotics teams, conducts computational biology research, and works on projects involving computational modeling, control theory, and more.',
    ],
  }),
  member({
    slug: 'julian-garcia',
    group: 'board-of-directors',
    name: 'Julian Garcia',
    roles: ['Senior Member'],
    shots: 5,
    joinDate: 'September 16, 2024',
    grade: '1st year',
    school: 'UC Berkeley',
    region: 'Berkeley, CA',
    linkedin: 'https://www.linkedin.com/in/julian-angelo-garcia-2451b62a8/',
    extracurriculars: 'Robotics, Speech and Debate, Software Development',
    interests: 'Computer Science, Mathematics, Psychology, Philosophy, Comedy',
    paragraphs: [
      'Julian leads the creation and teaching of Programming curriculum at Project NexTech, helping new volunteers. They also teach programs in San Diego. Julian volunteers with Project NexTech to help share their passion for programming and computer science with uninitiated students, and to make a difference in their community.',
      "Outside of Project NexTech, Julian is the president of their school's robotics team, MarauderTech, and competes in Speech and Debate. In their free time, Julian works on programming projects and loves to watch movies.",
    ],
  }),
  member({
    slug: 'praem-kumar',
    group: 'board-of-directors',
    name: 'Praem Kumar',
    roles: ['Senior Member'],
    shots: 5,
    /* The live site has no detail line for Praem, only the holding sentence
       below. Empty strings, not invented values — ProfileModal drops a detail
       row whose value is falsy, so these simply do not render. */
    joinDate: '',
    grade: '',
    school: '',
    region: '',
    linkedin: null,
    paragraphs: [
      'Praem Kumar is a senior member of the Board of Directors at Project NexTech. More information about him will be added soon.',
    ],
  }),
]

/* ==========================================================================
   Board of Advisors

   The chair gets a full card with a portrait; the rest are name-and-role only,
   per the brief. None of them has a popup.
   ========================================================================== */

export const BOARD_OF_ADVISORS_FEATURED: FeaturedAdvisor = {
  id: 'kausik-ray-chaudhuri',
  name: 'Kausik Ray Chaudhuri',
  role: 'Chair',
  image: '/media/leadership/board-of-advisors/kausik-ray-chaudhuri/portrait.png',
}

export const BOARD_OF_ADVISORS: readonly AdvisorEntry[] = [
  { id: 'jp-pierce', name: 'J.P. Pierce', role: 'Member' },
  { id: 'paul-hsu', name: 'Paul Hsu', role: 'Member' },
  { id: 'jocelyn-slape', name: 'Jocelyn Slape', role: 'Member' },
  { id: 'rima-chatterjee', name: 'Rima Chatterjee', role: 'Member' },
  { id: 'moumita-chatterjee', name: 'Moumita Chatterjee', role: 'Member' },
  { id: 'sumit-anand', name: 'Sumit Anand', role: 'Member' },
  { id: 'sam-jha', name: 'Sam Jha', role: 'Member' },
]
