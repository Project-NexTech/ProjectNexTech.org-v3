'use client'

import { useEffect, useRef, useState } from 'react'

import { EMAILS, SOCIAL, SOCIAL_ORDER } from '@/constants'
import { useSite } from '@/context/siteContext'
import Icon from '@/components/ui/Icon'
import ProtectedEmail from '@/components/ui/ProtectedEmail'
import s from './ContactPopup.module.css'

/**
 * Not a page — a popup anchored under the navbar. On desktop it tucks into the
 * top-right corner; on mobile it spans the width below the navbar. Both keep a
 * small gap from the screen edge.
 *
 * POSITIONING (on the "must not regress" list): this renders INSIDE the sticky
 * <header> in Navbar and is positioned with `top: 100%`, so it always sits
 * directly beneath the navbar. That holds whether or not the news bar is
 * present, and whether or not the page is scrolled — no measuring of chrome
 * height, and nothing to keep in sync if the news bar is toggled off. Don't
 * move it up to the layout.
 *
 * This is site chrome, so its links keep the normal pointer.
 */

const ROTATE_MS = 3500

/** The three inboxes, in the order the brief lists them. */
const CONTACTS = [
  { email: EMAILS.info, accent: 'orange' },
  { email: EMAILS.programs, accent: 'blue' },
  { email: EMAILS.ec, accent: 'orange' },
] as const

function RotatingCta() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SOCIAL_ORDER.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const key = SOCIAL_ORDER[index]
  const social = SOCIAL[key]
  const [before, platform, after] = social.cta

  return (
    <div className={s.ctaSlot}>
      {/* Keyed so each rotation remounts the anchor and replays the rise. */}
      <a key={key} href={social.url} target="_blank" rel="noreferrer" className={s.cta}>
        {before}
        <span className={s.ctaPlatform}>{platform}</span>
        {after}
      </a>
    </div>
  )
}

export default function ContactPopup() {
  const { isContactOpen, closeContact } = useSite()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isContactOpen) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeContact()
    }

    /* Close on an outside click. A full-screen backdrop element would be
       simpler, but it would also swallow the first click on any navbar link
       and on the Contact toggle itself. */
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (panelRef.current?.contains(target)) return
      /* The toggle carries data-contact-toggle so this listener doesn't close
         the popup a beat before the button's own toggle runs. */
      if (target?.closest?.('[data-contact-toggle]')) return
      closeContact()
    }

    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isContactOpen, closeContact])

  if (!isContactOpen) return null

  return (
    <div ref={panelRef} role="dialog" aria-label="Contact Project NexTech" className={s.panel}>
      <div className={s.header}>
        <h2 className={s.title}>Contact us</h2>
        <button
          type="button"
          onClick={closeContact}
          aria-label="Close contact panel"
          className={s.close}
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      {/* The [at]/[dot] form is deliberate anti-scraping, but it is opaque to
          anyone who hasn't seen it before — so say plainly what these are and
          how to type them. */}
      <p className={s.explainer}>
        These are our email addresses. When typing one, replace{' '}
        <span className={s.literal}>[at]</span> with <span className={s.literal}>@</span> and{' '}
        <span className={s.literal}>[dot]</span> with a period, and remove the spaces.
      </p>

      <ul className={s.contacts}>
        {CONTACTS.map(({ email, accent }) => (
          <li key={email.user}>
            <ProtectedEmail email={email} accent={accent} className={s.email} />
            <p className={s.purpose}>{email.purpose}</p>
          </li>
        ))}
      </ul>

      <div className={s.socials}>
        {SOCIAL_ORDER.map((key) => (
          <a
            key={key}
            href={SOCIAL[key].url}
            target="_blank"
            rel="noreferrer"
            className={s.social}
          >
            <Icon name={key} size={14} />
            {SOCIAL[key].label}
          </a>
        ))}
      </div>

      <RotatingCta />
    </div>
  )
}
