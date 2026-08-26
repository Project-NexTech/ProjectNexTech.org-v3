import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Curriculum',
  description:
    'All 22 Project NexTech courses across Engineering, Mentoring, Programming, Physics/Math, and Natural Sciences.',
}

export default function CurriculumPage() {
  return <PagePlaceholder title="Curriculum" phase="Phase 4" />
}
