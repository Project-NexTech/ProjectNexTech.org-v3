import type { Metadata } from 'next'
import Link from 'next/link'

import GroupDirectory from './GroupDirectory'
import PageHeader from '@/components/ui/PageHeader'
import ClosingCta from '@/components/ui/ClosingCta'
import { FORMS } from '@/constants'

export const metadata: Metadata = {
  title: 'Project Groups',
  description:
    'The school clubs, robotics teams, and community groups running Project NexTech programs locally.',
}

export default function ProjectGroupsPage() {
  return (
    <div>
      <PageHeader
        title="Project Groups"
        subtitle="This is placeholder subtitle text about the school clubs, robotics teams, and community groups running Project NexTech programs locally."
      />

      <GroupDirectory />

      <ClosingCta heading="Start your own group today!">
        <Link href="/volunteer" className="link-internal">
          Become a volunteer
        </Link>
        , begin contributing, and complete the{' '}
        <a
          href={FORMS.projectGroupCreation}
          target="_blank"
          rel="noreferrer"
          className="link-external"
        >
          Project Group Creation Form
        </a>
        !
      </ClosingCta>
    </div>
  )
}
