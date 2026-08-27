'use client'

import dynamic from 'next/dynamic'

import type { PntMapProps } from './PntMap'
import s from './MapClient.module.css'

/**
 * The only supported entry point to the map.
 *
 * Leaflet reads `window` at import time, so PntMap must load with
 * `ssr: false` — and in Next 16 `next/dynamic({ ssr: false })` is NOT allowed
 * in a Server Component and errors at build time. This wrapper exists purely
 * to give that call a Client Component to live in, so a server page can render
 * a map by importing MapClient.
 *
 * The loading state is a plain sunken panel rather than a spinner: the map is
 * always inside a fixed-height frame, so a neutral fill is less jarring than
 * something that animates and then disappears.
 */
const PntMap = dynamic(() => import('./PntMap'), {
  ssr: false,
  loading: () => <div className={s.loading} aria-hidden="true" />,
})

export default function MapClient(props: PntMapProps) {
  return <PntMap {...props} />
}
