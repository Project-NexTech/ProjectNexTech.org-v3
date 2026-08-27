'use client'

import { useEffect, type ReactNode } from 'react'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useSite } from '@/context/siteContext'
import type { LatLng } from '@/data/venueCoordinates'
import s from './PntMap.module.css'

/**
 * Shared Leaflet map, used by the Programs search and the Project Groups page.
 *
 * NEVER IMPORT THIS FILE DIRECTLY FROM A PAGE. Leaflet touches `window` at
 * import time, so it has to load with `ssr: false` — and in Next 16 a
 * `next/dynamic` call with `ssr: false` is not allowed in a Server Component.
 * Import `MapClient` instead; it is the Client Component that owns that call.
 *
 * Tiles are CARTO's basemaps rather than standard OpenStreetMap raster — the
 * default OSM tiles are near-white and read as a hole punched in a dark page.
 * Attribution for both OSM and CARTO is required and is set below.
 *
 * Markers are hand-built divIcons rather than Leaflet's defaults: the default
 * marker images are referenced by a relative path that breaks under a bundler,
 * and a brand-colored pin fits the site better than fixing the image paths.
 */

/* CARTO ships matching light and dark basemaps, so the map follows the site
   theme instead of punching a bright hole in a dark page (or vice versa). */
const TILE_URLS = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
}
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

function markerIcon(color: string) {
  return L.divIcon({
    className: 'pnt-marker',
    html: `<span style="
      display:block;width:14px;height:14px;border-radius:9999px;
      background:${color};border:2px solid rgba(13,14,16,.85);
      box-shadow:0 0 0 1px ${color}66;
    "></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  })
}

/* Literal brand hexes rather than var(--accent): this HTML string is handed to
   Leaflet and inserted outside any element the tokens cascade through. */
const ICONS = {
  accent: markerIcon('#f24c02'),
  alt: markerIcon('#5c9de0'),
}

export type MarkerTone = keyof typeof ICONS

export interface MapMarker {
  id: string
  position: LatLng
  tone?: MarkerTone
  popup?: ReactNode
}

/**
 * Re-frames the map when the caller changes center/zoom after a search.
 *
 * Depends on the lat/lng primitives rather than the `center` array: callers
 * naturally rebuild that array each render, and depending on its identity
 * would re-run setView on every render.
 */
function ViewController({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap()
  const [lat, lng] = center

  useEffect(() => {
    map.setView([lat, lng], zoom)
  }, [map, lat, lng, zoom])

  return null
}

/** Enables or disables every interaction handler in one place. */
function InteractionController({ enabled }: { enabled: boolean }) {
  const map = useMap()

  useEffect(() => {
    const handlers = [
      map.dragging,
      map.touchZoom,
      map.doubleClickZoom,
      map.scrollWheelZoom,
      map.boxZoom,
      map.keyboard,
    ]

    for (const handler of handlers) {
      if (enabled) handler.enable()
      else handler.disable()
    }
  }, [map, enabled])

  return null
}

export interface PntMapProps {
  markers?: readonly MapMarker[]
  center: LatLng
  zoom: number
  /** `false` freezes the map — Programs uses that while its search window covers it. */
  interactive?: boolean
  /**
   * Keeps auto-panned popups clear of anything overlaying the map — the
   * Programs page docks its search panel over the left edge.
   */
  popupPadTopLeft?: [number, number]
  className?: string
}

export default function PntMap({
  markers = [],
  center,
  zoom,
  interactive = true,
  popupPadTopLeft = [24, 24],
  className = '',
}: PntMapProps) {
  const { resolvedTheme } = useSite()

  return (
    <MapContainer
      center={[center[0], center[1]]}
      zoom={zoom}
      scrollWheelZoom={false}
      /* Default position is top-left, where the Programs page docks its search
         panel. Moved to the right so the two never overlap. */
      zoomControl={false}
      className={`${s.map} ${className}`}
    >
      {/* Not rendered while frozen: Leaflet controls sit at z-index 1000 and
          would otherwise punch through the Programs page's scrim. */}
      {interactive && <ZoomControl position="topright" />}
      {/* Keyed so a theme change swaps the layer rather than leaving the old
          tiles cached in place. */}
      <TileLayer
        key={resolvedTheme}
        url={TILE_URLS[resolvedTheme] ?? TILE_URLS.dark}
        attribution={TILE_ATTRIBUTION}
      />
      <ViewController center={center} zoom={zoom} />
      <InteractionController enabled={interactive} />

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.position[0], marker.position[1]]}
          icon={ICONS[marker.tone ?? 'accent'] ?? ICONS.accent}
        >
          {marker.popup && (
            <Popup autoPanPaddingTopLeft={popupPadTopLeft} autoPanPaddingBottomRight={[24, 24]}>
              {marker.popup}
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  )
}
