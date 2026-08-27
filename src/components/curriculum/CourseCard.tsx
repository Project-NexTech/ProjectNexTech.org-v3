import GradeRange from './GradeRange'
import Card from '@/components/ui/Card'
import Carousel from '@/components/ui/Carousel'
import Icon from '@/components/ui/Icon'
import Tag from '@/components/ui/Tag'
import { courseMediaDir, courseShots, normalizeMaterial, type Course } from '@/data/courses'
import { MATERIAL_ICONS } from '@/constants'
import s from './CourseCard.module.css'

/* The count comes from the course, not from a constant here — see
   DEFAULT_COURSE_SHOTS in src/data/courses.ts. */
function carouselItems(course: Course) {
  const dir = courseMediaDir(course)
  return Array.from({ length: courseShots(course) }, (_, index) => ({
    src: `${dir}/shot-${String(index + 1).padStart(2, '0')}.png`,
    alt: '',
  }))
}

/**
 * The two info-icon variants the brief specifies, distinguished by color and
 * by the message they carry. Driven entirely by `course.sequential`.
 *
 * The tooltip is CSS-only — no directive needed, so a card rendered by a
 * Server Component ships no JS for it.
 */
function SequenceInfo({ sequential }: { sequential: boolean }) {
  const text = sequential
    ? 'The sessions of this curriculum must be run sequentially.'
    : 'Each session of this curriculum can be run independently.'

  return (
    <span className={s.info}>
      <button
        type="button"
        aria-label={text}
        className={sequential ? s.infoAccent : s.infoAlt}
      >
        <Icon name="info" size={16} />
      </button>

      <span role="tooltip" className={s.tooltip}>
        {text}
      </span>
    </span>
  )
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Card interactive className={s.card}>
      <Carousel items={carouselItems(course)} ratio="16:9" showCaptions={false} />

      <div className={s.metaRow}>
        <p className={s.code}>[{course.code}]</p>

        <div className={s.tags}>
          {course.tags.map((tag) => (
            <Tag key={tag} tone="accent" size="xs">
              {tag}
            </Tag>
          ))}
        </div>

        <span className={s.infoSlot}>
          <SequenceInfo sequential={course.sequential} />
        </span>
      </div>

      <h3 className={s.title}>{course.title}</h3>

      <div className={s.grades}>
        <GradeRange ideal={course.gradeIdeal} ok={course.gradeOk} />
      </div>

      <div className={s.materials}>
        {course.materials.map((material) => {
          const { label, optional } = normalizeMaterial(material)
          return (
            <Tag
              key={label}
              icon={MATERIAL_ICONS[label] ?? 'tag'}
              tone={optional ? 'quiet' : 'neutral'}
            >
              {label}
              {optional && ' (optional)'}
            </Tag>
          )
        })}
      </div>

      <p className={s.description}>{course.description}</p>
    </Card>
  )
}
