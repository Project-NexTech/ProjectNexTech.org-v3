import type { Metadata } from 'next'

import SubjectTabs from './SubjectTabs'
import PageHeader from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Curriculum',
  description:
    'Every course Project NexTech teaches, with the grade range and materials each one needs.',
}

export default function CurriculumPage() {
  return (
    <div>
      <PageHeader
        title="Curriculum"
        subtitle="Every course we teach, with the grade ranges and materials each one needs. This is placeholder subtitle text for program hosts choosing what to run."
      />

      <SubjectTabs />
    </div>
  )
}
