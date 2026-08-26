/**
 * The 22-course PNT curriculum catalog.
 *
 * PROVENANCE — read before editing:
 *  - 20 of 22 descriptions are VERBATIM from the current live site
 *    (projectnextech.org/programs), captured 2026-08-12.
 *  - [4.3] Intro to Electromagnetism and [4.4] Intro to Astronomy are NOT on
 *    the live site yet. Their descriptions are invented and contain the word
 *    "placeholder" per the brief's convention.
 *  - Courses [2.1] and [2.2] were renamed by the brief (previously "Intro to
 *    FLL" / "Intro to FTC"). Titles follow the brief; descriptions are the
 *    live FLL/FTC text.
 *  - Every `derived` note flags a value that was inferred rather than sourced.
 *    See CLAUDE.md for the full list.
 *
 * CONVENTIONS
 *  - Grades use 0 === Kindergarten, matching GRADES in src/constants.
 *  - `gradeIdeal` sits STRICTLY inside `gradeOk`: `gradeOk[0] <= gradeIdeal[0] - 1`
 *    and `gradeOk[1] >= gradeIdeal[1] + 1`. All four bounds must therefore be
 *    distinct, which is what lets the card's grade graphic put every label on
 *    one row without collisions. Preserve this when editing ranges — where the
 *    OK bound was already capped at grade 12, the ideal bound was pulled down
 *    instead of widening OK past the cap.
 *  - `sequential: false` renders info icon variant 1 ("Each session of this
 *    curriculum can be run independently."); `true` renders variant 2 ("The
 *    sessions of this curriculum must be run sequentially.").
 *  - Tags (NEW / MOST POPULAR / STUDENT FAVORITE) were assigned arbitrarily to
 *    exercise the design and are expected to be reassigned by PNT.
 */

export const COURSE_TAGS = {
  NEW: 'NEW',
  POPULAR: 'MOST POPULAR',
  FAVORITE: 'STUDENT FAVORITE',
} as const

export type CourseTag = (typeof COURSE_TAGS)[keyof typeof COURSE_TAGS]

/** A [low, high] grade bound, 0 === Kindergarten. */
export type GradeRangeTuple = readonly [number, number]

/** Either a bare label, or a label flagged optional ("(if possible)" on the live site). */
export type MaterialSpec = string | { label: string; optional: boolean }

export interface NormalizedMaterial {
  label: string
  optional: boolean
}

export interface Course {
  /** e.g. '3.1'. The leading digit is the subject id. */
  code: string
  subject: number
  title: string
  /** false renders the "independent sessions" info variant; true the sequential one. */
  sequential: boolean
  gradeOk: GradeRangeTuple
  /** Sits STRICTLY inside gradeOk — see the invariant in the header comment. */
  gradeIdeal: GradeRangeTuple
  materials: readonly MaterialSpec[]
  tags: readonly CourseTag[]
  /**
   * Provenance note for a value that was INFERRED rather than sourced from the
   * live site. Not rendered anywhere — it exists so the next editor knows
   * which numbers PNT still has to confirm. See LAUNCH_READINESS.md.
   */
  derived?: string
  description: string
}

export const COURSES: readonly Course[] = [
  /* ---------------------------------------------------------------- 1 · Engineering */
  {
    code: '1.1',
    subject: 1,
    title: 'Maker Space Workshops',
    sequential: false,
    gradeOk: [1, 5],
    gradeIdeal: [2, 4],
    materials: ['Screen', 'Craft Materials'],
    tags: [COURSE_TAGS.POPULAR],
    description:
      'Introducing basic engineering concepts through fun and simple challenges like popsicle stick bridges, spaghetti and marshmallow towers, wooden cars, and more!',
  },
  {
    code: '1.2',
    subject: 1,
    title: 'Intro to Engineering',
    sequential: false,
    gradeOk: [5, 9],
    gradeIdeal: [6, 8],
    materials: ['Screen'],
    tags: [],
    description:
      'Introducing more applicable engineering concepts through engineering challenges that walk students through real-world fields and problems faced by engineers.',
  },
  {
    code: '1.3',
    subject: 1,
    title: 'Intro to TinkerCAD',
    sequential: true,
    gradeOk: [1, 6],
    gradeIdeal: [3, 5],
    materials: ['Screen', { label: 'Computers', optional: true }],
    tags: [COURSE_TAGS.FAVORITE],
    description:
      'Students learn how to make basic 3D models through computer-aided design using the beginner-friendly software TinkerCAD!',
  },
  {
    code: '1.4',
    subject: 1,
    title: 'Intro to Onshape',
    sequential: true,
    gradeOk: [5, 12],
    gradeIdeal: [6, 10],
    materials: ['Screen', { label: 'Computers', optional: true }],
    tags: [],
    description:
      'Students learn how to create 3D models and machines through computer-aided design in Onshape, a professional software used in robotics and industry across the world.',
  },
  {
    code: '1.5',
    subject: 1,
    title: 'Intro to Electrical Engineering',
    sequential: false,
    gradeOk: [5, 12],
    gradeIdeal: [6, 8],
    materials: ['Screen'],
    tags: [],
    description:
      'Students learn about the principles of electrical engineering through activities and experiments with real-world components and circuits that engineers use.',
  },

  /* ---------------------------------------------------------------- 2 · Mentoring */
  {
    code: '2.1',
    subject: 2,
    title: 'Intro to Basic Robotics',
    sequential: false,
    gradeOk: [3, 8],
    gradeIdeal: [5, 7],
    materials: ['Robot Kits', 'Craft Materials', 'Workspace'],
    tags: [COURSE_TAGS.FAVORITE],
    derived: 'Grade ranges specified directly by PNT; live site listed only "Grades 4-8".',
    description:
      'Our volunteer coaches with past participation or judging experience in F.I.R.S.T work with parents and students to start and/or support a F.I.R.S.T Lego League robotics team, prepare for competition, and build engineering and soft skills that are useful in the real world.',
  },
  {
    code: '2.2',
    subject: 2,
    title: 'Intro to Advanced Robotics',
    sequential: true,
    gradeOk: [6, 12],
    gradeIdeal: [7, 10],
    materials: ['Robot Kits', 'Computers', 'Workspace'],
    tags: [],
    description:
      'Our volunteer coaches with past participation or judging experience in F.I.R.S.T work with parents and students to start and/or support a F.I.R.S.T Tech Challenge robotics team, prepare for competition, and build engineering and soft skills that are useful in the real world.',
  },
  {
    code: '2.3',
    subject: 2,
    title: 'Intro to Science Fair',
    sequential: true,
    gradeOk: [5, 12],
    gradeIdeal: [6, 8],
    materials: ['Screen', 'Computers'],
    tags: [],
    description:
      'Students learn how a science fair works and how to compete in their local ISEF-affiliated fair, creating a science or engineering project of their interest and presenting to adult judges, taught by current/former participants. This course was co-developed with the Greater San Diego Science and Engineering Fair (GSDSEF) Student Leadership Board (SLB).',
  },
  {
    code: '2.4',
    subject: 2,
    title: 'Intro to Research',
    sequential: true,
    gradeOk: [8, 12],
    gradeIdeal: [9, 11],
    materials: ['Screen', 'Computers'],
    tags: [COURSE_TAGS.NEW],
    derived:
      'Live site listed "Grades 8+ OK" with no ideal range; OK capped at 12 and ideal inferred. Ideal upper pulled to 11 so it stays strictly inside the OK range.',
    description:
      'Students learn about key concepts of performing original research and participating in academia through demonstrations, case studies, and projects. This courses uses curriculum developed by the International Research Olympiad.',
  },

  /* ---------------------------------------------------------------- 3 · Programming */
  {
    code: '3.1',
    subject: 3,
    title: 'Intro to Python',
    sequential: true,
    gradeOk: [3, 12],
    gradeIdeal: [5, 8],
    materials: ['Screen', { label: 'Computers', optional: true }],
    tags: [COURSE_TAGS.POPULAR],
    derived: 'Live site listed "Grades 3+ OK"; OK capped at 12.',
    description:
      'Students learn how to use the beginner-friendly Python programming language, the most popular language for programming today, and are exposed to its applications in data science and artificial intelligence.',
  },
  {
    code: '3.2',
    subject: 3,
    title: 'Intro to Java',
    sequential: true,
    gradeOk: [5, 12],
    gradeIdeal: [7, 10],
    materials: ['Screen', { label: 'Computers', optional: true }],
    tags: [],
    derived: 'Live site listed "Grades 5+ OK"; OK capped at 12.',
    description:
      'Students learn how to use the Java programming language, one of the most popular languages for programming today, and are exposed to its applications in robotics and app development.',
  },
  {
    code: '3.3',
    subject: 3,
    title: 'Intro to Artificial Intelligence',
    sequential: true,
    gradeOk: [6, 12],
    gradeIdeal: [8, 11],
    materials: ['Screen', { label: 'Computers', optional: true }],
    tags: [],
    derived:
      'Live site listed "Grades 6+ OK"; OK capped at 12. Ideal upper pulled to 11 so it stays strictly inside the OK range.',
    description:
      'Students learn about the applications of programming with Python and math in the field of artificial intelligence such as computer vision, natural language processing, and machine learning.',
  },
  {
    code: '3.4',
    subject: 3,
    title: 'Intro to Front-End Development',
    sequential: true,
    gradeOk: [5, 12],
    gradeIdeal: [6, 10],
    materials: ['Screen', { label: 'Computers', optional: true }],
    tags: [],
    derived: 'Live site listed "Grades 6+ OK"; OK capped at 12.',
    description:
      'Students learn how to create their own basic website using JavaScript, HTML, and CSS, and learn important concepts about frontend development that power the modern internet!',
  },
  {
    code: '3.5',
    subject: 3,
    title: 'Intro to Programming with Scratch',
    sequential: true,
    gradeOk: [1, 8],
    gradeIdeal: [3, 5],
    materials: ['Screen', { label: 'Computers', optional: true }],
    tags: [COURSE_TAGS.POPULAR],
    description:
      'Students learn basic concepts of programming with Scratch, a visual block-coding interface developed by professionals at MIT, to create simple games and scenes!',
  },

  /* ---------------------------------------------------------------- 4 · Physics/Math */
  {
    code: '4.1',
    subject: 4,
    title: 'Intro to Algebra and Geometry',
    sequential: false,
    gradeOk: [2, 7],
    gradeIdeal: [3, 5],
    materials: ['Screen', 'Whiteboard', { label: 'Paper', optional: true }, { label: 'Pens/Pencils', optional: true }],
    tags: [],
    description:
      'An introductory math course for students who are familiar with addition, subtraction, multiplication, and division, but have not yet used variables or geometry principles, in an interactive format.',
  },
  {
    code: '4.2',
    subject: 4,
    title: 'Intro to Classical Physics',
    sequential: false,
    gradeOk: [4, 10],
    gradeIdeal: [5, 8],
    materials: ['Screen', 'Whiteboard', { label: 'Paper', optional: true }, { label: 'Pens/Pencils', optional: true }],
    tags: [],
    description:
      'Students use projects and demonstrations to learn about key classical physics concepts like forces, motion, gravity, buoyancy, springs, and more, while building their own machines!',
  },
  {
    code: '4.3',
    subject: 4,
    title: 'Intro to Electromagnetism',
    sequential: false,
    gradeOk: [6, 12],
    gradeIdeal: [8, 11],
    materials: ['Screen', 'Whiteboard', 'Household Materials'],
    tags: [COURSE_TAGS.NEW],
    derived: 'Entire entry invented — this course is not yet published on the live site.',
    description:
      'This is placeholder copy for a course in which students explore magnetism, electric fields, and the relationship between them through hands-on demonstrations with coils, magnets, and simple motors they assemble themselves.',
  },
  {
    code: '4.4',
    subject: 4,
    title: 'Intro to Astronomy',
    sequential: false,
    gradeOk: [3, 9],
    gradeIdeal: [4, 7],
    materials: ['Screen', 'Whiteboard', 'Craft Materials'],
    tags: [COURSE_TAGS.NEW],
    derived: 'Entire entry invented — this course is not yet published on the live site.',
    description:
      'This is placeholder copy for a course covering the solar system, stellar life cycles, and how astronomers measure distance across space, using scale models and night-sky observation activities students can repeat at home.',
  },

  /* ---------------------------------------------------------------- 5 · Natural Sciences */
  {
    code: '5.1',
    subject: 5,
    title: 'Intro to Earth Science',
    sequential: false,
    gradeOk: [1, 6],
    gradeIdeal: [3, 5],
    materials: ['Screen', { label: 'Whiteboard', optional: true }],
    tags: [],
    description:
      'Students learn about the basics of earth science through activities and experiments, including how populations behave, the layers of earth, why seasons exist, and more!',
  },
  {
    code: '5.2',
    subject: 5,
    title: 'Intro to Biology',
    sequential: false,
    gradeOk: [3, 9],
    gradeIdeal: [5, 8],
    materials: ['Screen', { label: 'Whiteboard', optional: true }],
    tags: [],
    description:
      'Students learn about key concepts of biology and life through experiments and demonstrations, including cell behavior, photosynthesis, nutrients, and more.',
  },
  {
    code: '5.3',
    subject: 5,
    title: 'Intro to Chemistry',
    sequential: false,
    gradeOk: [4, 9],
    gradeIdeal: [5, 8],
    materials: ['Screen', { label: 'Whiteboard', optional: true }, 'Water'],
    tags: [],
    description:
      'Students learn about key concepts of chemistry through labs and experiments, including molecular structure, types of reactions, and more.',
  },
  {
    code: '5.4',
    subject: 5,
    title: 'Natural Science Workshops',
    sequential: false,
    gradeOk: [1, 8],
    gradeIdeal: [3, 5],
    materials: ['Screen', { label: 'Whiteboard', optional: true }, 'Household Materials', 'Water'],
    tags: [COURSE_TAGS.FAVORITE],
    description:
      'Students learn about various natural sciences concepts through fun hands-on experiments and activities such as making hand sanitizer, dissecting plants, making slime, and more!',
  },
]

/**
 * Media folder for a course, e.g. '/media/curriculum/1.1-maker-space-workshops'.
 * Must stay in step with the folder names scaffolded under public/media —
 * renaming a course title means renaming its folder too.
 */
export function courseMediaDir(course: Pick<Course, 'title' | 'code'>): string {
  const slug = course.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `/media/curriculum/${course.code}-${slug}`
}

/** Look up a course by its code, e.g. getCourse('3.1'). */
export function getCourse(code: string): Course | undefined {
  return COURSES.find((course) => course.code === code)
}

/** All courses belonging to a subject id (1-5). */
export function coursesBySubject(subjectId: number): readonly Course[] {
  return COURSES.filter((course) => course.subject === subjectId)
}

/** Normalize a materials entry to { label, optional }. */
export function normalizeMaterial(material: MaterialSpec): NormalizedMaterial {
  return typeof material === 'string' ? { label: material, optional: false } : material
}
