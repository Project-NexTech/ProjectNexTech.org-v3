'use client'

import { useEffect, useState } from 'react'

import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import { DISCORD } from '@/constants'
import s from './DiscordWidget.module.css'

/**
 * Live server stats from Discord's public widget endpoint.
 *
 * IMPORTANT: this endpoint returns 403 unless "Enable Server Widget" is turned
 * on in Discord under Server Settings -> Widget. If PNT ever turns it off, or
 * the request fails for any other reason, this falls back to a static card
 * that still links to the invite — the section must never render empty.
 *
 * Deliberately fetched from the BROWSER rather than on the server. Doing it in
 * a Server Component would put Discord's latency on every page render and
 * cache one server's view of a live number for every visitor; a failure here
 * degrades one card rather than the request.
 */

interface WidgetMember {
  id: string
  avatar_url: string
}

interface WidgetResponse {
  name?: string
  presence_count?: number
  members?: readonly WidgetMember[]
}

export default function DiscordWidget() {
  const [data, setData] = useState<WidgetResponse | null>(null)
  const [totalMembers, setTotalMembers] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch(DISCORD.widgetApi, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Discord widget returned ${response.status}`)
        return response.json() as Promise<WidgetResponse>
      })
      .then(setData)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== 'AbortError') setFailed(true)
      })

    /* Separate request purely for the total member count, which the widget
       endpoint doesn't carry. Failure here is non-fatal — the total is simply
       omitted and the online count still renders. */
    fetch(DISCORD.inviteApi, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((invite: { approximate_member_count?: number } | null) => {
        if (invite?.approximate_member_count) setTotalMembers(invite.approximate_member_count)
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  const online = data?.presence_count
  const sample = data?.members?.slice(0, 8) ?? []

  return (
    <Card className={s.card}>
      <div className={s.head}>
        <span className={s.mark}>
          <Icon name="discord" size={28} />
        </span>
        <div className={s.identity}>
          <p className={s.name}>{data?.name ?? 'Project NexTech'}</p>
          <p className={s.kind}>Discord server</p>
        </div>
      </div>

      {failed ? (
        <p className={s.fallback}>
          Live server stats are unavailable right now. You can still join using the invite link.
        </p>
      ) : (
        <>
          <div className={s.counts}>
            {totalMembers != null && (
              <p className={s.count}>
                <span className={`${s.value} ${s.valueAlt}`}>
                  {totalMembers.toLocaleString('en-US')}
                </span>
                <span className={s.unit}>members</span>
              </p>
            )}
            <p className={s.count}>
              <span className={`${s.value} ${s.valueAccent}`}>{online ?? '—'}</span>
              <span className={s.unit}>online</span>
            </p>
          </div>

          {sample.length > 0 && (
            <ul className={s.avatars}>
              {sample.map((member) => (
                <li key={member.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      a remote Discord CDN URL that changes per member; routing
                      it through next/image would need a remotePatterns entry
                      and buys nothing at 28px. */}
                  <img
                    src={member.avatar_url}
                    alt=""
                    width="28"
                    height="28"
                    loading="lazy"
                    className={s.avatar}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <p className={s.serverId}>Server ID {DISCORD.serverId}</p>
    </Card>
  )
}
