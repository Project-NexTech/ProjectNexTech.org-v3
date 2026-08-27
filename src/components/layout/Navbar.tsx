'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { NAV_PRIMARY, ORG } from '@/constants'
import { useSite } from '@/context/siteContext'
import { cx } from '@/lib/cx'
import ContactPopup from '@/components/ContactPopup'
import Icon from '@/components/ui/Icon'
import ActiveLink from './ActiveLink'
import ThemeToggle from './ThemeToggle'
import s from './Navbar.module.css'

/**
 * TWO-STAGE COLLAPSE (as specified by PNT — on the "must not regress" list)
 *
 *   >= xl (1280px)  everything inline
 *   lg .. xl        the right-hand utility items fold into the hamburger;
 *                   the primary links stay inline
 *   <  lg (1024px)  everything but the logo folds into the hamburger
 *
 * The drawer therefore holds a different set at each stage, which is why the
 * primary links inside it are hidden at >=lg — above lg they are already
 * inline in the bar.
 *
 * Navbar links are site chrome and keep the normal pointer; the custom
 * redirect cursors are reserved for content links and content buttons.
 */

/** Contact / Dashboard / Log In, shared between the inline bar and the drawer. */
function UtilityItems({
  onNavigate,
  stacked = false,
}: {
  onNavigate?: () => void
  stacked?: boolean
}) {
  const { isLoggedIn, user, signIn, toggleContact } = useSite()
  const router = useRouter()

  const itemClass = cx(s.item, stacked ? s.itemStacked : s.itemInline)

  const handleContact = () => {
    onNavigate?.()
    toggleContact()
  }

  // Clicking Dashboard while signed out behaves exactly like Log In.
  const handleDashboard = () => {
    onNavigate?.()
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      signIn()
    }
  }

  const handleSignIn = () => {
    onNavigate?.()
    signIn()
  }

  return (
    <>
      {/* data-contact-toggle keeps the popup's outside-click handler from
          closing it a beat before this button's own toggle runs. */}
      <button type="button" data-contact-toggle onClick={handleContact} className={itemClass}>
        Contact
      </button>

      <button type="button" onClick={handleDashboard} className={itemClass}>
        Dashboard
      </button>

      {isLoggedIn && user ? (
        /* Not a link, and deliberately never underlined — an underline would
           imply it navigates somewhere. */
        <span className={cx(itemClass, s.greeting)}>Hi, {user.firstName}</span>
      ) : (
        <button type="button" onClick={handleSignIn} className={itemClass}>
          Log In
        </button>
      )}
    </>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  /* The drawer closes from the click handlers below rather than from an effect
     watching the pathname — an effect there would setState during render and
     cascade an extra render on every navigation. */
  useEffect(() => {
    if (!isOpen) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <header className={s.header}>
      <nav className={s.bar}>
        <Link href="/" aria-label={`${ORG.name} home`} className={s.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element --
              A fixed-height, eagerly-loaded chrome mark. Routing it through
              next/image adds an optimizer round-trip on every page for an
              asset that is already small and always visible. Revisit with the
              rest of the imagery in the content phase. */}
          <img src="/media/logo.png" alt={ORG.name} className={s.logoImage} />
        </Link>

        {/* Stage 1: primary links, inline from lg up. */}
        <div className={s.primary}>
          {NAV_PRIMARY.map((item) => (
            <ActiveLink key={item.to} href={item.to!} className={cx(s.item, s.itemInline)}>
              {item.label}
            </ActiveLink>
          ))}
        </div>

        {/* Stage 2: utility items, inline only from xl up. */}
        <div className={s.utility}>
          <UtilityItems />
          <ThemeToggle />
        </div>

        {/* The theme switch stays visible at every width — it is one icon, and
            burying it in the drawer makes it hard to find. */}
        <span className={s.themeSlot}>
          <ThemeToggle />
        </span>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          className={s.hamburger}
        >
          <Icon name={isOpen ? 'close' : 'menu'} size={22} />
        </button>
      </nav>

      {isOpen && (
        <div className={s.drawer}>
          <div className={s.drawerInner}>
            {/* Primary links only appear here below lg, where they are not
                already inline in the bar above. */}
            <div className={s.drawerPrimary}>
              {NAV_PRIMARY.map((item) => (
                <ActiveLink
                  key={item.to}
                  href={item.to!}
                  onClick={() => setIsOpen(false)}
                  className={cx(s.item, s.itemStacked)}
                >
                  {item.label}
                </ActiveLink>
              ))}
              <hr className={s.divider} />
            </div>

            <UtilityItems stacked onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      )}

      {/* Lives inside the header so `top: 100%` anchors it under the navbar
          regardless of the news bar or scroll position. */}
      <ContactPopup />
    </header>
  )
}
