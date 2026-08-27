'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { cx } from '@/lib/cx'
import s from './ActiveLink.module.css'

/**
 * A nav link that knows whether it points at the current page.
 *
 * This replaces react-router's <NavLink> and its `isActive` render prop, the
 * one non-mechanical piece of the routing migration (NEXTJS_MIGRATION.md §2.2).
 * Next has no equivalent, so it is an explicit `usePathname()` comparison.
 *
 * It exists as its own file for two reasons: the active treatment is identical
 * in the Navbar and the Footer and should be defined once, and `usePathname`
 * forces a client component — keeping it here lets the Footer stay a Server
 * Component that merely renders a few of these.
 *
 * The active page gets a faint underline in the accent color, so the current
 * location is legible without relying on color alone. Home is never underlined:
 * the logo is the home link, and marking it would read as noise. That falls out
 * naturally, since NAV_PRIMARY does not contain "/".
 */
export interface ActiveLinkProps {
  href: string
  children: ReactNode
  /** Size and spacing from the caller; active/inactive color is added here. */
  className?: string
  onClick?: () => void
}

export default function ActiveLink({ href, children, className = '', onClick }: ActiveLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      /* Announces the current page to assistive tech, which the underline alone
         does not. The prototype had no equivalent. */
      aria-current={isActive ? 'page' : undefined}
      className={cx(s.root, className, isActive ? s.active : s.inactive)}
    >
      {children}
    </Link>
  )
}
