import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who Project NexTech is, how we started, the philosophy behind our programs, and the partners who make them possible.',
}

export default function AboutPage() {
  return <PagePlaceholder title="About" phase="Phase 4" />
}
