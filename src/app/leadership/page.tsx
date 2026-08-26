import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Leadership',
  description:
    'The Executive Committee, department managers, Board of Directors, and Board of Advisors who run Project NexTech.',
}

export default function LeadershipPage() {
  return <PagePlaceholder title="Leadership" phase="Phase 4" />
}
