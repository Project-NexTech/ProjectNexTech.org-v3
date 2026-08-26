import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Impact',
  description:
    'The reach of our programs in numbers, quarterly impact reports, and a map of everywhere we have taught.',
}

export default function ImpactPage() {
  return <PagePlaceholder title="Impact" phase="Phase 4" />
}
