import { cx } from '@/lib/cx'
import s from './ProtectedEmail.module.css'

/**
 * Scraper-resistant email display.
 *
 * Renders `info [at] project nextech [dot] org` using three defenses:
 *
 *  1. The fragments sit in REVERSED DOM order and are flipped back visually
 *     with `flex-direction: row-reverse`, so the address never appears as a
 *     contiguous string in the DOM, in view-source, or in `textContent`.
 *  2. The " [at] " and " [dot] " separators are CSS pseudo-element content,
 *     so they are not text nodes at all.
 *  3. `user-select: none` blocks selection and copying.
 *
 * ACCEPTED TRADEOFF (confirmed with PNT): a legitimate human visitor cannot
 * copy-paste the address, and screen readers will announce the fragments out
 * of order. The Contact popup is the intended path for actually reaching PNT.
 *
 * Because of #3 this must never be the ONLY way to reach a given inbox.
 *
 * WARNING: The `protected-email`, `sep-at`, and `sep-dot` class names are
 * GLOBAL, defined in globals.css. They are matched as descendants and are on
 * the "must not regress" list, so they deliberately opt out of module scoping.
 * Verify by checking `textContent` in devtools: the address must not be
 * contiguous.
 */
export interface EmailParts {
  user: string
  domain: string
  tld: string
}

export interface ProtectedEmailProps {
  email: EmailParts
  className?: string
  accent?: 'orange' | 'blue'
}

export default function ProtectedEmail({
  email,
  className = '',
  accent = 'orange',
}: ProtectedEmailProps) {
  const { user, domain, tld } = email

  return (
    /* Every address on the site reads the same way: accent colored, bold, and
       monospaced, so the [at]/[dot] form is legible as a literal address
       rather than as prose. Don't override this per call site. */
    <span
      className={cx(
        'protected-email',
        s.root,
        accent === 'blue' ? s.blue : s.orange,
        className,
      )}
      aria-label="email address"
    >
      {/* Reversed on purpose — see the note above. */}
      <span>{tld}</span>
      <span className="sep-dot" />
      <span>{domain}</span>
      <span className="sep-at" />
      <span>{user}</span>
    </span>
  )
}
