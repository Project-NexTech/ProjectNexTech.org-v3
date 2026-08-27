import { NEWS_BAR } from '@/constants'
import { cx } from '@/lib/cx'
import Icon from '@/components/ui/Icon'
import s from './NewsBar.module.css'

/**
 * Announcement strip above the navbar: centered text plus a button, with a
 * close control on the right.
 *
 * Dismissal is held by <SiteChrome>, not here, so it survives navigation but
 * resets on reload — deliberate, so an announcement is not permanently lost
 * after one stray click.
 *
 * No directive: it takes `onDismiss` from a Client Component, which pulls it
 * into the client graph automatically. Set `NEWS_BAR.enabled: false` in
 * constants to hide it sitewide.
 */
export default function NewsBar({ onDismiss }: { onDismiss: () => void }) {
  if (!NEWS_BAR.enabled) return null

  return (
    <div className={s.root}>
      <div className={s.inner}>
        <p className={s.text}>
          <span>{NEWS_BAR.text}</span>
          {/* Content button, so it keeps the external redirect cursor even
              though the strip sits in the chrome. */}
          <a
            href={NEWS_BAR.buttonHref}
            target="_blank"
            rel="noreferrer"
            className={cx(s.button, 'cursor-external')}
          >
            {NEWS_BAR.buttonLabel}
          </a>
        </p>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss announcement"
          className={s.dismiss}
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  )
}

