'use client'

import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from '@/lib/motion'

/**
 * Counts from zero up to `value` the first time it scrolls into view.
 *
 * Reduced-motion handling is done in the state INITIALIZER rather than with a
 * setState inside the effect: `react-hooks/set-state-in-effect` rejects the
 * latter, and initializing straight to the final value is simpler anyway.
 * Don't tidy it back.
 *
 * No CSS module — this renders bare text and takes its type from whatever
 * wraps it (BigNumber supplies the display face and accent color).
 */

const DURATION_MS = 1600

function format(value: number, decimals: number): string {
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US')
}

export interface CountUpProps {
  value: number
  decimals?: number
}

export default function CountUp({ value, decimals = 0 }: CountUpProps) {
  /* Called directly rather than cached in a ref — reading a ref during render
     is what `react-hooks/refs` forbids, and the media query is cheap. */
  const [current, setCurrent] = useState(() => (prefersReducedMotion() ? value : 0))
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const element = ref.current
    if (!element) return undefined

    let frame: number | undefined
    let startedAt: number | undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()

        const step = (timestamp: number) => {
          startedAt ??= timestamp
          const progress = Math.min((timestamp - startedAt) / DURATION_MS, 1)
          // easeOutCubic — fast start, settles gently on the final number.
          setCurrent(value * (1 - Math.pow(1 - progress, 3)))
          if (progress < 1) frame = requestAnimationFrame(step)
        }

        frame = requestAnimationFrame(step)
      },
      { threshold: 0.3 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    /* The label carries the final value so assistive tech announces the real
       figure rather than whatever frame the animation is on. */
    <span ref={ref} aria-label={format(value, decimals)}>
      <span aria-hidden="true">{format(current, decimals)}</span>
    </span>
  )
}
