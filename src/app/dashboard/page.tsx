import type { Metadata } from 'next'

import PagePlaceholder from '@/components/dev/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Your Project NexTech volunteer hours, memberships, and organization links.',
  /* Signed-in surface — never indexed. The real route guard is a
     phase 7 proxy.ts (Middleware is renamed Proxy in Next 16). */
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return <PagePlaceholder title="Dashboard" phase="Phase 4" />
}
