'use client'

import { useMemo, useState } from 'react'

import MapClient from '@/components/map/MapClient'
import type { MapMarker } from '@/components/map/PntMap'
import ProfileCard from '@/components/profile/ProfileCard'
import ProfileGrid, { Lines } from '@/components/profile/ProfileGrid'
import ProfileModal, { type ProfileDetail } from '@/components/profile/ProfileModal'
import Icon from '@/components/ui/Icon'
import { PROJECT_GROUPS, type ProjectGroup } from '@/data/projectGroups'
import { DEFAULT_VIEW } from '@/data/venueCoordinates'
import s from './GroupDirectory.module.css'

/**
 * The map, the card grid, and the shared detail popup.
 *
 * Same card and popup system as Leadership, with the fields relabelled per the
 * brief: name -> group name, role -> group code, join date -> group lead,
 * grade -> member list, school -> affiliation, LinkedIn -> group link.
 *
 * One client island for the same reason as LeadershipRoster: every card drives
 * the same modal. The map arrives through MapClient, never PntMap directly.
 */

function groupDetails(group: ProjectGroup): ProfileDetail[] {
  return [
    { icon: 'users', label: 'Group name', value: group.name },
    { icon: 'tag', label: 'Group code', value: group.code },
    { icon: 'school', label: 'School / team / type', value: group.affiliation },
    {
      icon: 'user',
      label: group.leads.length > 1 ? 'Group leads' : 'Group lead',
      value: <Lines values={group.leads} />,
    },
    // Rendered as separate lines, per the brief.
    { icon: 'users', label: 'Members', value: <Lines values={group.members} /> },
    { icon: 'map-pin', label: 'Region', value: group.region },
    {
      icon: 'link',
      label: 'Group link',
      value: group.link ? 'Visit' : null,
      href: group.link ?? undefined,
    },
  ]
}

export default function GroupDirectory() {
  const [active, setActive] = useState<ProjectGroup | null>(null)

  const groupMarkers = useMemo<MapMarker[]>(
    () =>
      PROJECT_GROUPS.map((group, index) => ({
        id: group.id,
        position: group.position,
        tone: index % 2 === 0 ? 'accent' : 'alt',
        popup: (
          <div className={s.popup}>
            <p className={s.popupName}>{group.name}</p>
            <p className={s.popupCode}>{group.code}</p>
            <p className={s.popupAffiliation}>{group.affiliation}</p>
            <p className={s.popupRegion}>{group.region}</p>
          </div>
        ),
      })),
    [],
  )

  return (
    <>
      <div className={s.mapFrame}>
        <MapClient markers={groupMarkers} center={DEFAULT_VIEW.center} zoom={DEFAULT_VIEW.zoom} />
      </div>

      <ProfileGrid>
        {PROJECT_GROUPS.map((group) => (
          <li key={group.id}>
            <ProfileCard
              image={group.image}
              title={group.name}
              subtitle={group.code}
              meta={
                <div>
                  <p className={s.leadLabel}>
                    {group.leads.length > 1 ? 'Group Leads' : 'Group Lead'}
                  </p>
                  <div className={s.leads}>
                    {group.leads.map((lead) => (
                      <p key={lead} className={s.lead}>
                        <span className={s.leadIcon}>
                          <Icon name="user" size={14} />
                        </span>
                        {lead}
                      </p>
                    ))}
                  </div>
                </div>
              }
              onOpen={() => setActive(group)}
            />
          </li>
        ))}
      </ProfileGrid>

      <ProfileModal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.name ?? ''}
        subtitle={active?.code ?? ''}
        carousel={active?.carousel}
        paragraphs={active?.paragraphs ?? []}
        details={active ? groupDetails(active) : []}
      />
    </>
  )
}
