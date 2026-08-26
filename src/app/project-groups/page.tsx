import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Project Groups',
  description:
    'School clubs, robotics teams, and community groups running Project NexTech programs in their own regions.',
}

export default function ProjectGroupsPage() {
  return <PagePlaceholder title="Project Groups" phase="Phase 4" />
}
