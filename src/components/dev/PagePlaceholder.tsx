import s from './PagePlaceholder.module.css'

/**
 * TEMPORARY — delete when the last page is ported.
 *
 * Phase 1 stands every route up so routing, the layout shell, metadata, and
 * theming can be verified before a single page exists. Each route replaces its
 * own placeholder in Phase 4; `phase` records which one, and the file is gone
 * once nothing imports it.
 *
 * The prototype had an equivalent (`PageStub`) for exactly this reason.
 */
export default function PagePlaceholder({
  title,
  phase,
  note,
}: {
  title: string
  phase: string
  note?: string
}) {
  return (
    <div className={s.root}>
      <p className={s.eyebrow}>Not built yet · {phase}</p>
      <h1 className={s.title}>{title}</h1>
      <p className={s.note}>
        {note ??
          'This route exists so navigation and the layout shell can be verified. The real page is ported from the prototype in a later phase.'}
      </p>
    </div>
  )
}
