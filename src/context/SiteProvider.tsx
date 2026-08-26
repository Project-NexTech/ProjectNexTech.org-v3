'use client'

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'

import {
  SiteContext,
  type ResolvedTheme,
  type SiteContextValue,
} from './siteContext'
import {
  getServerSystemPrefersDark,
  getServerThemePreference,
  getSystemPrefersDark,
  getThemePreference,
  setThemePreference,
  subscribeSystemPrefersDark,
  subscribeThemePreference,
} from './themeStore'

/** Stand-in identity until real Google auth exists. */
const STUB_USER = {
  firstName: 'Nexus',
  fullName: 'Nexus Tech',
}

/**
 * TEMPORARY AUTH BEHAVIOR (agreed with PNT, replaced in phase 7):
 *
 * There is no Google OAuth yet. So "signing in" is one boolean:
 *
 *   - First click of "Log In" *or* "Dashboard" opens google.com in a new tab
 *     and flips the flag. Both entry points share the flag, so clicking
 *     "Log In" once means "Dashboard" opens straight to the dashboard.
 *   - Once flipped, the navbar shows "Hi, Nexus" instead of "Log In".
 *   - The flag is deliberately NOT persisted; a reload signs you back out.
 */
export default function SiteProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  /**
   * THEME
   *
   * `theme` is the visitor's *preference* and may be 'system'; `resolvedTheme`
   * is what is actually on screen. Components branching on real appearance —
   * the map's tile layer, for instance — must read `resolvedTheme`.
   *
   * Both come from an external store rather than component state; see
   * themeStore.ts for why. On the server, and during the hydration pass, these
   * read 'system' / false. React then re-renders with the browser's real
   * values, so there is no hydration mismatch and no theme flash — the
   * blocking script has already painted the correct theme.
   */
  const theme = useSyncExternalStore(
    subscribeThemePreference,
    getThemePreference,
    getServerThemePreference,
  )

  const systemPrefersDark = useSyncExternalStore(
    subscribeSystemPrefersDark,
    getSystemPrefersDark,
    getServerSystemPrefersDark,
  )

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme

  const toggleTheme = useCallback(() => {
    setThemePreference(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme])

  const signIn = useCallback(() => {
    window.open('https://google.com', '_blank', 'noopener,noreferrer')
    setIsLoggedIn(true)
  }, [])

  const openContact = useCallback(() => setIsContactOpen(true), [])
  const closeContact = useCallback(() => setIsContactOpen(false), [])
  const toggleContact = useCallback(() => setIsContactOpen((open) => !open), [])

  const value = useMemo<SiteContextValue>(
    () => ({
      isLoggedIn,
      user: isLoggedIn ? STUB_USER : null,
      signIn,
      isContactOpen,
      openContact,
      closeContact,
      toggleContact,
      theme,
      resolvedTheme,
      toggleTheme,
    }),
    [
      isLoggedIn,
      signIn,
      isContactOpen,
      openContact,
      closeContact,
      toggleContact,
      theme,
      resolvedTheme,
      toggleTheme,
    ],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
