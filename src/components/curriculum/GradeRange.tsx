import { cx } from '@/lib/cx'
import { SCHOOL_TRANSITIONS } from '@/constants'
import type { GradeRangeTuple } from '@/data/courses'
import s from './GradeRange.module.css'

/**
 * The K-12 grade number-line on a Curriculum card.
 *
 * All four bounds sit on ONE label row, which is only possible because the
 * data guarantees four strictly distinct values ordered
 * `okLow < idealLow < idealHigh < okHigh` — see the range rules in
 * src/data/courses.ts. Below that row the orange ideal bar sits directly on
 * top of the blue OK bar, edges touching, over a faint baseline.
 *
 * The gray K and 12 extents share that same row. When the OK range actually
 * reaches K or 12 its blue label *replaces* the gray one rather than stacking
 * on top of it.
 *
 * Labels are anchored, not centered: lows align to the left of their position
 * and highs to the right, so nothing clips past either end of the track.
 *
 * No hooks and no browser APIs, so this file carries no directive — it
 * compiles into whichever graph imports it.
 */

const MIN_GRADE = 0
const MAX_GRADE = 12

/* Vertical layout, in px. One label row keeps this compact. */
const LABEL_TOP = 0
const IDEAL_BAR_TOP = 14
const BAR_HEIGHT = 5
const OK_BAR_TOP = IDEAL_BAR_TOP + BAR_HEIGHT
const BASELINE_TOP = OK_BAR_TOP + BAR_HEIGHT
const TRANSITION_HEIGHT = BASELINE_TOP + 2
const TRACK_HEIGHT = BASELINE_TOP + 1

type Tone = 'faint' | 'accent' | 'alt'

const TONES: Record<Tone, string> = {
  faint: s.toneFaint,
  accent: s.toneAccent,
  alt: s.toneAlt,
}

const percent = (grade: number) => ((grade - MIN_GRADE) / (MAX_GRADE - MIN_GRADE)) * 100
const gradeLabel = (grade: number) => (grade === 0 ? 'K' : String(grade))

function Label({ grade, tone, align }: { grade: number; tone: Tone; align: 'left' | 'right' }) {
  return (
    <span
      className={cx(s.label, TONES[tone], align === 'right' && s.alignRight)}
      style={{ top: LABEL_TOP, left: `${percent(grade)}%` }}
    >
      {gradeLabel(grade)}
    </span>
  )
}

function Bar({ range, top, tone }: { range: GradeRangeTuple; top: number; tone: 'accent' | 'alt' }) {
  const [start, end] = range
  const left = percent(start)
  /* A one-grade band would otherwise be invisible. */
  const width = Math.max(percent(end) - left, 1.5)

  return (
    <div
      className={cx(s.bar, tone === 'accent' ? s.barAccent : s.barAlt)}
      style={{ top, left: `${left}%`, width: `${width}%`, height: BAR_HEIGHT }}
    />
  )
}

export default function GradeRange({ ideal, ok }: { ideal: GradeRangeTuple; ok: GradeRangeTuple }) {
  const [okLow, okHigh] = ok
  const [idealLow, idealHigh] = ideal

  // The gray extents give way when a blue bound already occupies that spot.
  const showGrayK = okLow !== MIN_GRADE
  const showGrayMax = okHigh !== MAX_GRADE

  return (
    <div className={s.root}>
      <div className={s.track} style={{ height: TRACK_HEIGHT }}>
        {SCHOOL_TRANSITIONS.map((transition) => (
          <span
            key={transition.after}
            title={transition.label}
            className={s.transition}
            style={{ left: `${percent(transition.after + 0.5)}%`, height: TRANSITION_HEIGHT }}
          />
        ))}

        {showGrayK && <Label grade={MIN_GRADE} tone="faint" align="left" />}
        {showGrayMax && <Label grade={MAX_GRADE} tone="faint" align="right" />}

        <Label grade={okLow} tone="alt" align="left" />
        <Label grade={idealLow} tone="accent" align="left" />
        <Label grade={idealHigh} tone="accent" align="right" />
        <Label grade={okHigh} tone="alt" align="right" />

        <Bar range={ideal} top={IDEAL_BAR_TOP} tone="accent" />
        <Bar range={ok} top={OK_BAR_TOP} tone="alt" />

        <span className={s.baseline} style={{ top: BASELINE_TOP }} />
      </div>

      <p className={s.legend}>
        <span className={s.toneAccent}>
          Grades {gradeLabel(idealLow)}-{gradeLabel(idealHigh)} ideal
        </span>
        <span className={s.toneFaint}>, </span>
        <span className={s.toneAlt}>
          Grades {gradeLabel(okLow)}-{gradeLabel(okHigh)} OK
        </span>
      </p>
    </div>
  )
}
