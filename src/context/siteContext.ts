'use client'

import { createContext, useContext } from 'react'

/** Stand-in identity until real Google auth exists (NEXTJS_MIGRATION.md §4.7). */
export interface SiteUser {
  firstName: string
  fullName: string
}

/** The visitor's preference. May be 'system', which defers to the OS. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** What is actually on screen — never 'system'. */
export type ResolvedTheme = 'light' | 'dark'

export interface SiteContextValue {
  isLoggedIn: boolean
  user: SiteUser | null
  signIn: () => void

  isContactOpen: boolean
  openContact: () => void
  closeContact: () => void
  toggleContact: () => void

  theme: ThemePreference
  /**
   * Components branching on real appearance — the map's tile layer, for
   * instance — must read this, not `theme`.
   */
  resolvedTheme: ResolvedTheme
  toggleTheme: () => void
}

/**
 * Site-wide UI state: the stubbed login flag, the Contact popup, and the theme.
 *
 * Kept in a separate file from the provider component so a module exporting a
 * component never also exports non-components — the react-refresh convention
 * the prototype followed, and still the tidier split under the App Router.
 */
export const SiteContext = createContext<SiteContextValue | null>(null)

export function useSite(): SiteContextValue {
  const value = useContext(SiteContext)
  if (!value) {
    throw new Error('useSite must be used inside <SiteProvider>')
  }
  return value
}
