'use client'

import Button from '@/components/ui/Button'
import { useSite } from '@/context/siteContext'
import { HOME_CTAS } from '@/constants'
import s from './HomeCtas.module.css'

/**
 * The Home page's CTA row.
 *
 * Split out of the page purely because one item ("Host a program") opens the
 * Contact popup rather than routing, and that needs the site context. Keeping
 * it here lets `app/page.tsx` stay a Server Component.
 */
export default function HomeCtas() {
  const { openContact } = useSite()

  return (
    <ul className={s.row}>
      {HOME_CTAS.map((cta) => (
        <li key={cta.label}>
          {cta.to ? (
            <Button to={cta.to} variant={cta.to === '/programs' ? 'primary' : 'secondary'}>
              {cta.label}
            </Button>
          ) : (
            <Button onClick={openContact}>{cta.label}</Button>
          )}
        </li>
      ))}
    </ul>
  )
}
