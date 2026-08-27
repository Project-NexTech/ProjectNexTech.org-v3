import { ORG } from '@/constants'
import { cx } from '@/lib/cx'
import s from './Wordmark.module.css'

/**
 * Renders "Project NexTech" locked to Inter.
 *
 * The brief requires the organization name to be set in Inter everywhere,
 * including inside Space Grotesk headings. Always use this component instead
 * of typing the name directly, so a heading font change can never leak into it.
 */
export default function Wordmark({ className = '' }: { className?: string }) {
  return <span className={cx(s.root, className)}>{ORG.name}</span>
}
