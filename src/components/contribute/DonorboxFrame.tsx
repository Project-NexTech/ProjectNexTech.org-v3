'use client'

import { useEffect, useRef } from 'react'

import s from './DonorboxFrame.module.css'

/**
 * The Donorbox donation form, sized to its own content.
 *
 * Donorbox's documented embed is a FIXED-HEIGHT iframe (their snippet says
 * 900px) plus `https://donorbox.org/widget.js`, which listens for a height the
 * form posts out and resizes the frame to match. Without the resizer the form
 * renders at whatever height you hard-coded — ours was 900px against a form
 * that is roughly 640px, so a quarter of the panel was empty.
 *
 * This is that resizer, reimplemented against the same protocol rather than by
 * loading their script into the top frame. Three reasons:
 *
 *  1. `widget.js` guards on a global (`window.DBOX_EMBEDED`) and does all its
 *     work once, on DOMContentLoaded. In an App Router SPA the second visit to
 *     this page is a client navigation with no new document, so the script
 *     short-circuits and the fresh iframe is never wired up. An effect keyed to
 *     the element's own lifetime cannot get that wrong.
 *  2. It REWRITES `iframe.src` (appending `a=b`) to force `allowpaymentrequest`
 *     on, which reloads the payment form a second time. Ours ships that
 *     attribute in the markup, so the form loads once.
 *  3. It is a third-party script running in the top frame. Donorbox already
 *     sees the visitor through the iframe, so this is not new exposure — but
 *     nothing on this site loads a remote script it does not have to, and the
 *     part of that script we need is the twenty lines below.
 *
 * The protocol: the host stamps the frame with a `data-donorbox-id` and posts
 * `{ action: 'set-iframe-id', msg: <id> }` into it. The form then posts its
 * height out, echoing that id back, whenever the content resizes — choosing a
 * different amount, switching to a monthly plan, opening the card fields. The
 * `+ 3` matches their script and keeps the form's bottom border off the edge.
 *
 * If the message never arrives — Donorbox changes the protocol, a blocker eats
 * the frame — the iframe keeps the height CSS gave it. That is exactly today's
 * behavior, so the failure mode is the status quo, not an empty panel. Note
 * that `scrolling="no"` is deliberately NOT set even though Donorbox's snippet
 * sets it: once the height tracks the content there is nothing to scroll, and
 * the one situation that would produce a scrollbar is the one where the resize
 * did not happen and the donor needs to reach the button anyway.
 */

const DONORBOX_ORIGIN = 'https://donorbox.org'
const FRAME_ID = 'pnt-donorbox'

interface DonorboxMessage {
  from?: string
  iframeID?: string
  height?: number | string
  close?: boolean
  scrollIntoView?: boolean
}

export default function DonorboxFrame({ src }: { src: string }) {
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const frame = ref.current
    if (!frame) return

    /* Announce the id the form should tag its height messages with. Sent on
       every load because the form only keeps it for the document it is in. */
    const announce = () => {
      frame.contentWindow?.postMessage(
        { action: 'set-iframe-id', msg: FRAME_ID },
        DONORBOX_ORIGIN,
      )
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== DONORBOX_ORIGIN) return

      const data = event.data as DonorboxMessage | null
      if (!data || typeof data !== 'object' || data.from !== 'dbox') return
      if (data.close || data.scrollIntoView) return
      if (data.iframeID && data.iframeID !== FRAME_ID) return

      const height = parseInt(String(data.height), 10)
      if (!(height > 0)) return

      frame.style.height = `${height + 3}px`
    }

    window.addEventListener('message', onMessage)
    frame.addEventListener('load', announce)
    announce()

    return () => {
      window.removeEventListener('message', onMessage)
      frame.removeEventListener('load', announce)
    }
  }, [])

  return (
    <iframe
      ref={ref}
      src={src}
      title="Donate to Project NexTech"
      /* Donorbox addresses the frame by name; without it the form does not
         answer the handshake above. */
      name="donorbox"
      data-donorbox-id={FRAME_ID}
      allow="payment"
      className={s.embed}
    />
  )
}
