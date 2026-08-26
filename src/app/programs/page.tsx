import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Search upcoming and past Project NexTech programs by subject, grade, region, and date, and find one near you on the map.',
}

export default function ProgramsPage() {
  return <PagePlaceholder title="Programs" phase="Phase 4" />
}
