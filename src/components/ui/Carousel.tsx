'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { cx } from '@/lib/cx'
import { prefersReducedMotion } from '@/lib/motion'
import Icon from './Icon'
import ImagePlaceholder, { type ImageRatio } from './ImagePlaceholder'
import s from './Carousel.module.css'

/**
 * Horizontal image carousel used across the site: the Home hero strip, article
 * asides, leadership popups, and curriculum cards.
 *
 * Slides move as a translated track so a single reduced-motion guard disables
 * the animation without disabling the control.
 *
 * Autoplay starts PAUSED when the visitor prefers reduced motion — decided in
 * the state initializer, not an effect. They can still start it by hand.
 */
const AUTOPLAY_MS = 5000

export interface CarouselItem {
  src?: string
  caption?: string
  heading?: string
  alt?: string
}

export interface CarouselProps {
  items?: readonly CarouselItem[]
  ratio?: ImageRatio
  /** Curriculum cards pass false — their captions live outside the frame. */
  showCaptions?: boolean
  autoPlay?: boolean
  className?: string
}

export default function Carousel({
  items = [],
  ratio = '16:9',
  showCaptions = true,
  autoPlay = true,
  className = '',
}: CarouselProps) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => autoPlay && !prefersReducedMotion())
  const trackId = useId()
  const liveRef = useRef<HTMLSpanElement>(null)

  const count = items.length
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  const prev = useCallback(() => go(index - 1), [go, index])
  const next = useCallback(() => go(index + 1), [go, index])

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Slide ${index + 1} of ${count}`
    }
  }, [index, count])

  useEffect(() => {
    if (!playing || count < 2) return undefined
    // Keyed on `index` so manually advancing also restarts the dwell time.
    const id = setTimeout(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [playing, index, count])

  if (count === 0) return null

  const current = items[index]

  return (
    <div className={cx(s.root, className)}>
      <div className={s.viewport}>
        <div
          id={trackId}
          className={s.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item, i) => (
            <div key={item.src ?? i} className={s.slide}>
              <ImagePlaceholder src={item.src} alt={item.alt ?? item.caption ?? ''} ratio={ratio} />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              aria-controls={trackId}
              className={cx(s.arrow, s.arrowPrev)}
            >
              <Icon name="chevron-left" size={16} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              aria-controls={trackId}
              className={cx(s.arrow, s.arrowNext)}
            >
              <Icon name="chevron-right" size={16} />
            </button>
          </>
        )}
      </div>

      <span ref={liveRef} aria-live="polite" className="sr-only" />

      {count > 1 && (
        /* Dots stay centered in the track; the play/pause control is pinned to
           the left so it doesn't shift as the dot count changes. */
        <div className={s.controls}>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            aria-pressed={playing}
            className={s.playToggle}
          >
            <Icon name={playing ? 'pause' : 'play'} size={14} />
          </button>

          <div className={s.dots}>
            {items.map((item, i) => (
              <button
                key={item.src ?? i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cx(s.dot, i === index && s.dotActive)}
              />
            ))}
          </div>
        </div>
      )}

      {showCaptions && (current.heading || current.caption) && (
        <div className={s.caption}>
          {current.heading && <p className={s.captionHeading}>{current.heading}</p>}
          {current.caption && <p className={s.captionBody}>{current.caption}</p>}
        </div>
      )}
    </div>
  )
}
