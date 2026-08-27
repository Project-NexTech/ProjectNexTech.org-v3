import type { Metadata } from 'next'

import PageHeader from '@/components/ui/PageHeader'
import Wordmark from '@/components/ui/Wordmark'
import { DOCS } from '@/constants'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Project NexTech organizational policies, including our Constitution.',
}

/**
 * The Constitution is embedded rather than restated, so this page can never
 * drift out of sync with the document itself.
 *
 * The /preview embed requires the Google Doc to be shared as "anyone with the
 * link can view". If the frame renders a sign-in prompt, that sharing setting
 * is the thing to check first — which is also why the fallback link below is
 * not optional.
 */
export default function PoliciesPage() {
  return (
    <div>
      <PageHeader
        title="Organization policies"
        subtitle={
          <>
            <Wordmark /> uses a Constitution to keep track of all of its policies
          </>
        }
      />

      <iframe
        src={DOCS.constitutionEmbed}
        title="Project NexTech Constitution"
        className={s.frame}
      />

      <p className={s.fallback}>
        Having trouble with the embedded document?{' '}
        <a href={DOCS.constitution} target="_blank" rel="noreferrer" className="link-external">
          Open the Constitution in Google Docs
        </a>
        .
      </p>
    </div>
  )
}
