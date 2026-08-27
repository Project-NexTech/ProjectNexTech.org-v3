'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/motion'
import { cx } from '@/lib/cx'
import s from './Reveal.module.css'

/**
 * Fades content up as it scrolls into view, once.
 *
 * Kept deliberately small: a short rise and a fade, nothing that moves far or
 * lasts long. The brief asks for "very simple animations peppered throughout",
 * so this is applied to page sections rather than to individual elements.
 *
 * Reduced motion is handled in the state INITIALIZER — starting `shown` at
 * true means the content is simply there, with no observer and no transition.
 * Setting state inside the effect instead would trip
 * `react-hooks/set-state-in-effect`. Don't tidy it back.
 *
 * WARNING: This must never be applied inside <ArticleSection>. Reveal
 * transitions a transform, and a transformed ancestor becomes the
 * `offsetParent` — which corrupts the rail layout's `offsetTop` measurements.
 * See NEXTJS_MIGRATION.md §3.8.
 *
 * `delay` staggers siblings; keep it small, since anything long enough to
 * notice reads as sluggish rather than polished.
 */
export interface RevealProps {
  children: ReactNode
  /** Milliseconds. Staggers siblings; keep under ~200. */
  delay?: number
  className?: string
  as?: ElementType
}

export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const [shown, setShown] = useState(() => prefersReducedMotion())
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()
        setShown(true)
      },
      /* Slightly inside the viewport, so content animates as it arrives rather
         than after it is already fully visible. */
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={shown && delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cx(s.root, shown ? s.shown : s.hidden, className)}
    >
      {children}
    </Tag>
  )
}
