import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Policies',
  description:
    'Project NexTech organizational policies, including our Constitution.',
}

export default function PoliciesPage() {
  return <PagePlaceholder title="Policies" phase="Phase 4" />
}
