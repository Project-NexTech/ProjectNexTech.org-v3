'use client'

import { DARK_QUERY, THEME_STORAGE_KEY } from '@/lib/theme'
import type { ThemePreference } from './siteContext'

/**
 * The theme lives in two places the browser owns — `localStorage` and the
 * `prefers-color-scheme` media query — so it is an *external store*, not React
 * state, and `useSyncExternalStore` is the primitive for reading one.
 *
 * The prototype read both at MODULE SCOPE, which crashes during prerender
 * (NEXTJS_MIGRATION.md §2.5). The obvious repair — `useState` plus a mount
 * effect that calls `setTheme` — trips `react-hooks/set-state-in-effect`,
 * which the model's CLAUDE.md warns about for exactly this class of code.
 * An external store avoids both problems: no reads at import time, no setState
 * inside an effect, and React handles the server→client handoff itself.
 *
 * Why there is no effect syncing `data-theme` onto <html>: the blocking script
 * in app/ThemeScript.tsx has already set the attribute correctly before first
 * paint, and nothing changes it until the visitor toggles. So the attribute is
 * written where the change actually happens — in `setThemePreference` — rather
 * than being re-derived on every render pass.
 */

/* -------------------------------------------------------------------------
   Stored preference
   ------------------------------------------------------------------------- */

const listeners = new Set<() => void>()

/** Cached so getSnapshot stays cheap and returns a stable value. */
let cached: ThemePreference | null = null

function readStored(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    // Private browsing and some embedded webviews throw on localStorage access.
    return 'system'
  }
}

function applyAttribute(preference: ThemePreference): void {
  /* With no attribute the CSS falls back to the media query, which is what
     'system' should do — so the attribute is removed rather than set. */
  if (preference === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', preference)
  }
}

function persist(preference: ThemePreference): void {
  try {
    if (preference === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY)
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Persistence is a nicety; failing to store must not break the toggle.
  }
}

export function subscribeThemePreference(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange)

  /* `storage` fires in OTHER tabs of the same origin, so switching the theme
     in one tab follows in the rest. A null key means the store was cleared. */
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) return
    cached = readStored()
    applyAttribute(cached)
    listeners.forEach((listener) => listener())
  }

  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener('storage', onStorage)
  }
}

export function getThemePreference(): ThemePreference {
  if (cached === null) cached = readStored()
  return cached
}

/**
 * The server cannot know what the visitor chose, so it renders the neutral
 * case. React uses this for the hydration pass and then re-renders with the
 * real client snapshot — which is why this must NOT try to guess.
 */
export function getServerThemePreference(): ThemePreference {
  return 'system'
}

export function setThemePreference(preference: ThemePreference): void {
  cached = preference
  applyAttribute(preference)
  persist(preference)
  listeners.forEach((listener) => listener())
}

/* -------------------------------------------------------------------------
   System preference
   ------------------------------------------------------------------------- */

let mediaQuery: MediaQueryList | null = null

function getMediaQuery(): MediaQueryList {
  mediaQuery ??= window.matchMedia(DARK_QUERY)
  return mediaQuery
}

export function subscribeSystemPrefersDark(onStoreChange: () => void): () => void {
  const media = getMediaQuery()
  media.addEventListener('change', onStoreChange)
  return () => media.removeEventListener('change', onStoreChange)
}

export function getSystemPrefersDark(): boolean {
  return getMediaQuery().matches
}

/** Matches the light-first default; corrected immediately after hydration. */
export function getServerSystemPrefersDark(): boolean {
  return false
}
