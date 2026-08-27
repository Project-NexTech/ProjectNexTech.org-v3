/**
 * Theme constants shared by a Server Component (app/ThemeScript.tsx) and a
 * Client Component (context/themeStore.ts).
 *
 * WARNING: This file must NOT carry a 'use client' directive, and must never
 * gain one.
 *
 * Every export of a 'use client' module becomes an opaque *client reference*
 * in the server graph — the server sees a proxy, not the value. When this key
 * lived in themeStore.ts, ThemeScript inlined `getItem(undefined)` into the
 * page: no type error, no build error, and a no-flash script that silently did
 * nothing. Constants that both sides read belong in a neutral module like this
 * one.
 */

/** localStorage key holding the visitor's explicit theme choice. */
export const THEME_STORAGE_KEY = 'pnt-theme'

/** Matches the `prefers-color-scheme` block in globals.css. */
export const DARK_QUERY = '(prefers-color-scheme: dark)'
