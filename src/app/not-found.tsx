import Link from 'next/link'

import s from './not-found.module.css'

/**
 * Catches every unmatched path — the App Router equivalent of the prototype's
 * `<Route path="*" element={<NotFound />} />`.
 *
 * Note this needs no deploy-time workaround. The prototype copied
 * dist/index.html to dist/404.html so BrowserRouter deep links survived a
 * refresh on GitHub Pages; running a real Node server removes that entirely
 * (NEXTJS_MIGRATION.md §2.3).
 */
export default function NotFound() {
  return (
    <div className={s.root}>
      <p className={s.code}>404</p>
      <h1 className={s.title}>Page not found</h1>
      <p className={s.body}>
        That page does not exist, or it moved. Try the{' '}
        <Link href="/" className="link-internal">
          home page
        </Link>
        .
      </p>
    </div>
  )
}
