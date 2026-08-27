'use client'

import { useState } from 'react'

import NewsBar from './NewsBar'
import Navbar from './Navbar'

/**
 * The chrome above the page content.
 *
 * This is the piece of the prototype's <RootLayout> that could not move into
 * `app/layout.tsx`: the news bar's dismissal is React state, and a root layout
 * is a Server Component. Holding it here keeps the prototype's behavior
 * exactly — dismissal survives navigation, because the App Router preserves
 * client component state inside a layout across route changes, but resets on
 * reload, so an announcement is not permanently lost to one stray click.
 *
 * Kept deliberately thin. The Footer is NOT here: it needs no client state, so
 * it stays a Server Component rendered directly by the layout.
 */
export default function SiteChrome() {
  const [newsDismissed, setNewsDismissed] = useState(false)

  return (
    <>
      {!newsDismissed && <NewsBar onDismiss={() => setNewsDismissed(true)} />}
      <Navbar />
    </>
  )
}
