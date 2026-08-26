import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Volunteer',
  description:
    'Teach, build curriculum, or help run Project NexTech. Everything you need to start volunteering with us.',
}

export default function VolunteerPage() {
  return <PagePlaceholder title="Volunteer" phase="Phase 4" />
}
