import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'Terms of use for projectnextech.org.',
}

export default function TermsPage() {
  return <PagePlaceholder title="Terms" phase="Phase 4" />
}
