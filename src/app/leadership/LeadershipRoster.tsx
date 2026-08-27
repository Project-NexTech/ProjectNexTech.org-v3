'use client'

import { useState } from 'react'

import ProfileCard from '@/components/profile/ProfileCard'
import ProfileGrid, { Lines } from '@/components/profile/ProfileGrid'
import ProfileModal, { type ProfileDetail } from '@/components/profile/ProfileModal'
import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import {
  BOARD_OF_ADVISORS,
  BOARD_OF_ADVISORS_FEATURED,
  BOARD_OF_DIRECTORS,
  DEPARTMENT_MANAGERS,
  EXECUTIVE_COMMITTEE,
  type LeadershipMember,
} from '@/data/leadership'
import s from './LeadershipRoster.module.css'

/**
 * The four leadership sections and the shared detail popup.
 *
 * This is one client island rather than four, because all four grids drive the
 * SAME modal — splitting them would mean four copies of `active` and four
 * modals. The page around it (header, CTA) stays a Server Component.
 */

function memberDetails(member: LeadershipMember): ProfileDetail[] {
  return [
    { icon: 'user', label: 'Name', value: member.name },
    {
      icon: 'tag',
      label: member.roles.length > 1 ? 'Roles' : 'Role',
      value: <Lines values={member.roles} />,
    },
    { icon: 'calendar', label: 'Joined', value: member.joinDate },
    { icon: 'users', label: 'Grade', value: member.grade },
    { icon: 'school', label: 'School', value: member.school },
    { icon: 'map-pin', label: 'Region', value: member.region },
    {
      icon: 'linkedin',
      label: 'LinkedIn',
      value: member.linkedin ? 'Profile' : null,
      href: member.linkedin ?? undefined,
    },
  ]
}

function MemberGrid({
  members,
  onOpen,
}: {
  members: readonly LeadershipMember[]
  onOpen: (member: LeadershipMember) => void
}) {
  return (
    <ProfileGrid>
      {members.map((member) => (
        <li key={member.id}>
          <ProfileCard
            image={member.image}
            title={member.name}
            subtitle={member.role}
            onOpen={() => onOpen(member)}
          />
        </li>
      ))}
    </ProfileGrid>
  )
}

export default function LeadershipRoster() {
  const [active, setActive] = useState<LeadershipMember | null>(null)

  return (
    <>
      <section className={s.section}>
        <SectionHeader subtitle="Runs the organization day to day">
          Executive Committee
        </SectionHeader>
        <MemberGrid members={EXECUTIVE_COMMITTEE} onOpen={setActive} />
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Leads each department's volunteers and projects">
          Department Managers
        </SectionHeader>
        <MemberGrid members={DEPARTMENT_MANAGERS} onOpen={setActive} />
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Provides governance and financial oversight">
          Board of Directors
        </SectionHeader>
        <MemberGrid members={BOARD_OF_DIRECTORS} onOpen={setActive} />
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Offers outside guidance on strategy and growth">
          Board of Advisors
        </SectionHeader>

        <ProfileGrid className={s.advisors}>
          <li className={s.featured}>
            <ProfileCard
              image={BOARD_OF_ADVISORS_FEATURED.image}
              title={BOARD_OF_ADVISORS_FEATURED.name}
              subtitle={BOARD_OF_ADVISORS_FEATURED.role}
            />
          </li>

          {BOARD_OF_ADVISORS.map((advisor) => (
            <li key={advisor.id}>
              <Card className={s.advisorCard}>
                <p className={s.advisorName}>{advisor.name}</p>
                <p className={s.advisorRole}>{advisor.role}</p>
              </Card>
            </li>
          ))}
        </ProfileGrid>
      </section>

      <ProfileModal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.name ?? ''}
        /* Header shows only the primary role, matching the card. The full list
           lives in the popup's ROLES detail row. */
        subtitle={active?.role ?? ''}
        carousel={active?.carousel}
        paragraphs={active?.paragraphs ?? []}
        details={active ? memberDetails(active) : []}
      />
    </>
  )
}
