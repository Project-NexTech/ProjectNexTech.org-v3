import type { Metadata } from 'next'
import Link from 'next/link'

import LeadershipRoster from './LeadershipRoster'
import PageHeader from '@/components/ui/PageHeader'
import ClosingCta from '@/components/ui/ClosingCta'
import { FORMS } from '@/constants'

export const metadata: Metadata = {
  title: 'Leadership',
  description:
    'The students who run Project NexTech — the Executive Committee, department managers, and the boards that support them.',
}

export default function LeadershipPage() {
  return (
    <div>
      <PageHeader
        title="Leadership"
        subtitle="This is placeholder subtitle text about the students who run Project NexTech and the boards that support them."
      />

      {/* Everything that shares the detail popup lives in one client island. */}
      <LeadershipRoster />

      <ClosingCta heading="Interested in applying?">
        <Link href="/volunteer" className="link-internal">
          Become a volunteer
        </Link>
        , begin contributing, and complete the{' '}
        <a
          href={FORMS.leadershipApplication}
          target="_blank"
          rel="noreferrer"
          className="link-external"
        >
          Leadership Application
        </a>
        !
      </ClosingCta>
    </div>
  )
}
