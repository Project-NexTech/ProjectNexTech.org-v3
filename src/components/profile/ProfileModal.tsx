'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import Carousel, { type CarouselItem } from '@/components/ui/Carousel'
import Icon, { type IconName } from '@/components/ui/Icon'
import s from './ProfileModal.module.css'

/**
 * Detail popup for a Leadership member or a Project Group.
 *
 * Layout follows the brief: a wide left panel holding a 4:3 carousel above a
 * scrollable body of text, and a narrow right panel of labelled details with
 * icons. Below `lg` the two panels stack.
 *
 * Rendered through a portal so the grid and card that own the trigger can
 * never clip it. `createPortal` needs `document`, and the modal only ever
 * exists in response to a click, so this returns null until it is open — which
 * also means there is nothing to render on the server.
 *
 * `details` is a list of { icon, label, value, href? } — the caller decides
 * what those rows mean, which is how one component serves both a person
 * (join date, grade, school) and a group (lead, members, type).
 */
export interface ProfileDetail {
  icon: IconName
  label: string
  value?: ReactNode
  href?: string
}

export interface ProfileModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle: ReactNode
  carousel?: readonly CarouselItem[]
  paragraphs: readonly string[]
  details: readonly ProfileDetail[]
}

export default function ProfileModal({
  open,
  onClose,
  title,
  subtitle,
  carousel,
  paragraphs,
  details,
}: ProfileModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    // Stop the page behind the modal from scrolling with it.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className={s.overlay}>
      {/* A real button rather than a bare div, so the scrim is reachable by
          keyboard and announced — closing is a genuine action. */}
      <button type="button" aria-label="Close" onClick={onClose} className={s.scrim} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={s.dialog}
      >
        {/* Tight bottom padding here and a small top padding below keep the
            gap between the subtitle and the carousel narrow. */}
        <div className={s.header}>
          <div className={s.identity}>
            <h2 className={s.title}>{title}</h2>
            <p className={s.subtitle}>{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className={s.close}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className={s.panels}>
          <div className={s.main}>
            {carousel && carousel.length > 0 && <Carousel items={carousel} ratio="4:3" />}

            <div className={s.prose}>
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <dl className={s.details}>
            {details
              .filter((detail) => detail.value)
              .map((detail) => (
                <div key={detail.label}>
                  <dt className={s.detailLabel}>
                    <Icon name={detail.icon} size={12} />
                    {detail.label}
                  </dt>
                  <dd className={s.detailValue}>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target="_blank"
                        rel="noreferrer"
                        className="link-external"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </div>,
    document.body,
  )
}
