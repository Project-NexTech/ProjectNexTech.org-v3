import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Contribute',
  description:
    'Donate to Project NexTech or partner with us to bring free STEM education to more students.',
}

export default function ContributePage() {
  return <PagePlaceholder title="Contribute" phase="Phase 4" />
}
