'use client'

import { useEffect, useState } from 'react'

import { HERO_TAGLINES } from '@/constants'
import s from './RotatingTagline.module.css'

/**
 * The hero headline, cycling through the taglines in the order the brief
 * lists them.
 *
 * The longest tagline is rendered invisibly underneath to reserve height, so
 * the page below doesn't jump as the lines swap. `visibility: hidden` rather
 * than `display: none` — the box still has to be laid out for that to work.
 */

const ROTATE_MS = 4000

/* Computed once at module scope: HERO_TAGLINES is a compile-time constant, so
   re-deriving this on every render buys nothing. */
const LONGEST = HERO_TAGLINES.reduce((a, b) => (a.length >= b.length ? a : b))

export default function RotatingTagline() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_TAGLINES.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <h1 className={s.root}>
      {/* Height reservation only — never announced or shown. */}
      <span className={s.reserve} aria-hidden="true">
        {LONGEST}
      </span>

      {/* Keyed by index so React remounts the span and the entrance animation
          replays on every swap. */}
      <span key={index} className={s.line}>
        {HERO_TAGLINES[index]}
      </span>
    </h1>
  )
}
