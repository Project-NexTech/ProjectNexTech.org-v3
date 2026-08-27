'use client'

import { useSite } from '@/context/siteContext'
import Icon from '@/components/ui/Icon'
import s from './ThemeToggle.module.css'

/**
 * Light/dark switch for the navbar.
 *
 * Starts on the visitor's system preference and only pins to an explicit
 * choice once clicked — see themeStore.ts for how 'system' is represented.
 * Shows the theme it will switch *to*, which is the convention most people
 * expect from a single-button toggle.
 *
 * HYDRATION: `resolvedTheme` comes from `useSyncExternalStore`, whose server
 * snapshot is always 'light'. The server HTML therefore always renders the
 * moon, and React swaps it for the sun immediately after hydration if the
 * visitor is actually in dark mode. That is a correct handoff, not a mismatch:
 * React uses the server snapshot for the hydration pass by design, so no
 * warning is produced. Only the icon corrects itself — the page itself was
 * already painted in the right theme by the blocking script in ThemeScript.
 */
export default function ThemeToggle({ stacked = false }: { stacked?: boolean }) {
  const { resolvedTheme, toggleTheme } = useSite()
  const goingToDark = resolvedTheme === 'light'
  const label = goingToDark ? 'Switch to dark mode' : 'Switch to light mode'

  if (stacked) {
    return (
      <button type="button" onClick={toggleTheme} className={s.stacked}>
        <Icon name={goingToDark ? 'moon' : 'sun'} size={16} />
        {goingToDark ? 'Dark mode' : 'Light mode'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={s.icon}
    >
      <Icon name={goingToDark ? 'moon' : 'sun'} size={17} />
    </button>
  )
}
