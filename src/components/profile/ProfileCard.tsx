import type { ReactNode } from 'react'

import Card from '@/components/ui/Card'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import s from './ProfileCard.module.css'

/**
 * The card used by both Leadership and Project Groups: a square image on the
 * left, identity on the right, and an optional "Learn more" that opens the
 * detail popup.
 *
 * The two pages differ only in labelling — a person's name and role become a
 * group's name and code — so they share this component rather than each
 * growing their own near-duplicate.
 *
 * No directive: `onOpen` is supplied by a Client Component in both callers,
 * and this file uses no hooks of its own.
 */
export interface ProfileCardProps {
  image?: string
  title: ReactNode
  subtitle: ReactNode
  /** Extra identity row — Project Groups uses this for the group lead(s). */
  meta?: ReactNode
  onOpen?: () => void
}

export default function ProfileCard({ image, title, subtitle, meta, onOpen }: ProfileCardProps) {
  return (
    <Card interactive className={s.card}>
      <ImagePlaceholder src={image} ratio="1:1" className={s.image} alt="" />

      <div className={s.body}>
        <h3 className={s.title}>{title}</h3>
        <p className={s.subtitle}>{subtitle}</p>

        {meta && <div className={s.meta}>{meta}</div>}

        {onOpen && (
          <button type="button" onClick={onOpen} className={`link-internal ${s.more}`}>
            Learn more
          </button>
        )}
      </div>
    </Card>
  )
}
