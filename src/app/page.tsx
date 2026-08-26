import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  description:
    'Project NexTech is a student-led nonprofit providing free, hands-on STEM education to students around the world.',
}

export default function HomePage() {
  return <PagePlaceholder title="Home" phase="Phase 4" />
}
