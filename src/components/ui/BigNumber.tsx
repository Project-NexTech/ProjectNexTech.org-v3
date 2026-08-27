import type { BigNumberSpec } from '@/constants'
import { cx } from '@/lib/cx'
import Card from './Card'
import CountUp from './CountUp'
import s from './BigNumber.module.css'

/**
 * One Big Number in a small, subtle card: the figure animates up in an accent
 * color, the label stays in normal text color. Prefixes and suffixes ($, +, k+)
 * are static so they don't animate alongside the digits.
 *
 * `index` drives the alternating orange/blue treatment across a row — callers
 * pass the position in the list rather than picking a color themselves, so a
 * reordered list re-alternates correctly. This is one of the three places the
 * alternation is positional; see the "must not regress" list.
 *
 * Used on Home (a subset) and Impact (all eight).
 */
export interface BigNumberProps {
  number: BigNumberSpec
  /** Position in the list. Drives orange/blue alternation — never hand-assign. */
  index?: number
  className?: string
}

export default function BigNumber({ number, index = 0, className = '' }: BigNumberProps) {
  const { value, prefix, suffix, decimals = 0, label } = number

  return (
    <Card className={cx(s.root, className)}>
      <p className={cx(s.figure, index % 2 === 0 ? s.accent : s.accentAlt)}>
        {prefix}
        <CountUp value={value} decimals={decimals} />
        {suffix}
      </p>
      <p className={s.label}>{label}</p>
    </Card>
  )
}
