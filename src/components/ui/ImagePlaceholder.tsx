'use client'

import { useCallback, useState } from 'react'

import { cx } from '@/lib/cx'
import Icon from './Icon'
import s from './ImagePlaceholder.module.css'

/**
 * An image slot that degrades into a labelled placeholder.
 *
 * The brief requires empty image areas to display the filepath they pull from,
 * so PNT can fill the site in one file at a time. Because media lives in
 * `public/`, the path shown here is the literal path to drop a file into —
 * add the file, refresh, and the real image replaces the placeholder with no
 * code change.
 *
 * WHY THIS IS STILL A CLIENT COMPONENT USING <img>, not next/image:
 * the whole point is the `onError` fallback, and a 404 is the NORMAL case
 * right now — every folder under public/media/ is empty scaffolding. next/image
 * treats a missing source as an error rather than a state to render, and it
 * needs intrinsic dimensions this component does not have. NEXTJS_MIGRATION.md
 * §2.6 calls for moving to next/image; that happens in the content phase, when
 * real files exist and the dashed box stops being the expected result.
 */

/* Kept unexported so this module exports only a component. */
const RATIOS = {
  '16:9': s.ratio16x9,
  '4:3': s.ratio4x3,
  '1:1': s.ratio1x1,
  '3:2': s.ratio3x2,
} as const

export type ImageRatio = keyof typeof RATIOS

export interface ImagePlaceholderProps {
  src?: string
  alt?: string
  ratio?: ImageRatio
  className?: string
  imgClassName?: string
}

/**
 * `className` lands on an OUTER wrapper rather than on the aspect-ratio frame.
 *
 * Under Tailwind this was a bug fix: the frame needs a full width, Tailwind
 * resolved conflicting width utilities by CSS source order, and a caller
 * passing `w-20` silently lost. Under CSS Modules specificity is explicit and
 * that hazard is gone — but the wrapper is kept because it is still the right
 * structure, and it is what makes caller sizing unambiguous.
 */
export default function ImagePlaceholder({
  src,
  alt = '',
  ratio = '4:3',
  className = '',
  imgClassName = '',
}: ImagePlaceholderProps) {
  const [failed, setFailed] = useState(false)
  const frame = cx(s.frame, RATIOS[ratio] ?? RATIOS['4:3'])

  /**
   * Catches an image that already failed BEFORE React hydrated.
   *
   * This is an SSR-only hazard and the prototype could not have hit it: there,
   * the <img> was created by client-side React, so `onError` was always
   * attached before the request started. Here the tag ships in the server HTML,
   * the browser requests it immediately, and a 404 can land while the page is
   * still hydrating — firing an error event that nothing is listening for.
   * `onError` alone therefore silently misses exactly the case this component
   * exists to handle, leaving a broken-image icon where the brief requires the
   * file path.
   *
   * A ref callback runs on commit, when the element is available and its
   * loading state can be read directly: a decoded-but-zero-width image is one
   * that finished and failed.
   */
  const captureEarlyError = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth === 0) setFailed(true)
  }, [])

  return (
    <div className={className}>
      {!src || failed ? (
        <div className={cx(frame, s.empty)}>
          <Icon name="image" size={18} className={s.emptyIcon} />
          <code className={s.path}>{src || 'no path set'}</code>
          <span className={s.ratioLabel}>{ratio}</span>
        </div>
      ) : (
        <div className={cx(frame, s.filled)}>
          {/* eslint-disable-next-line @next/next/no-img-element --
              Deliberate: this component's contract is "render the file if it
              exists, otherwise show its path", and next/image cannot express
              the onError fallback that makes that work. Revisit in the content
              phase, when a missing file stops being the expected case. */}
          <img
            ref={captureEarlyError}
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className={cx(s.img, imgClassName)}
          />
        </div>
      )}
    </div>
  )
}
