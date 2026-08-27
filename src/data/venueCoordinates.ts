/**
 * Latitude/longitude for every program venue, keyed by the `name` field in
 * LOCATIONS (src/constants/index.ts).
 *
 * WARNING: THESE COORDINATES ARE APPROXIMATE AND UNVERIFIED.
 *
 * They were written by hand to unblock the Programs map, not produced by a
 * geocoder. Expect them to be correct to the neighborhood but not to the
 * building. **Do not ship them to families trying to find a classroom.**
 *
 * The fix is a one-time geocoding pass over the `address` field of each
 * LOCATIONS entry, with the results committed back here — geocoding at runtime
 * would add a network dependency and a rate limit to every page load.
 *
 * "Online" has no entry: it has no physical location. See the Programs page
 * for how online programs are handled in results.
 */
/**
 * A [latitude, longitude] pair. Tuple rather than number[] because Leaflet's
 * LatLngExpression requires exactly two elements, and a plain array type would
 * let a three-element mistake through to runtime.
 */
export type LatLng = readonly [number, number]

export const VENUE_COORDINATES: Record<string, LatLng> = {
  /* ---- San Diego ---- */
  'College-Rolando Library': [32.7625, -117.07],
  'Francis Parker School': [32.7975, -117.17],
  'Mission Hills Branch Library': [32.748, -117.169],
  'Rancho Penasquitos Branch Library': [32.953, -117.122],
  'North Park Branch Library': [32.748, -117.13],
  'Rancho Bernardo Branch Library': [33.02, -117.073],
  'Ocean Beach Branch Library': [32.748, -117.248],
  'Scripps Miramar Ranch Branch Library': [32.92, -117.103],
  'Point Loma / Hervey Branch Library': [32.74, -117.24],
  'Carmel Mountain Ranch Branch Library': [32.988, -117.08],
  'Mira Mesa Branch Library': [32.913, -117.144],
  'North Clairemont Library': [32.828, -117.205],
  'Morning Creek Elementary': [32.976, -117.085],
  'San Ysidro Library': [32.558, -117.048],
  'University Heights Branch Library': [32.753, -117.143],
  'Qualcomm Building AY': [32.895, -117.198],
  'Carmel Valley Library': [32.944, -117.227],
  'Pacific Beach/Taylor Library': [32.801, -117.238],
  'Paradise Hills Library': [32.68, -117.043],
  'Canyon View Elementary': [32.962, -117.118],
  'San Diego Miramar College': [32.888, -117.142],
  'Balboa Library': [32.82, -117.185],
  'Cherokee Point Elementary': [32.748, -117.114],
  'Otay Mesa-Nestor Library': [32.585, -117.087],
  'Pacific View Leadership Elementary School': [32.687, -117.035],
  '4S Ranch Branch Library': [33.023, -117.107],
  'Pacific Highlands Ranch Library': [32.949, -117.19],
  'Chula Vista Middle School': [32.635, -117.087],
  'Cardiff-by-the-Sea Library': [33.018, -117.279],
  'Linda Vista Library': [32.793, -117.169],
  'Allied Gardens/Benjamin Library': [32.793, -117.081],

  /* ---- Houston ---- */
  'Julia Ideson Library': [29.759, -95.369],
  'Heights Neighborhood Library': [29.787, -95.398],
  'Alief-Henington Regional Library': [29.7, -95.58],
  'Alice McKean Young Neighborhood Library': [29.701, -95.335],

  /* ---- Monterrey ---- */
  'Biblioteca Pública Municipal Loma Linda': [25.642, -100.31],
  'Biblioteca Pública Municipal Miguel de Cervantes Saavedra': [25.68, -100.33],
  'American School Foundation of Monterrey': [25.648, -100.356],
  'San Roberto International School': [25.651, -100.402],

  /* ---- Dhaka ---- */
  Madrasa: [23.81, 90.41],

  /* ---- Cleveland ---- */
  'Cleveland Public Library': [41.5, -81.69],
  'Martin Luther King, Jr. Branch Library': [41.509, -81.606],
  'Carnegie West Library': [41.483, -81.708],
  'Public Administration Library': [41.504, -81.693],

  /* ---- Los Angeles ---- */
  'Los Angeles Public Library Central': [34.0505, -118.255],
  'West Los Angeles Regional Branch': [34.043, -118.448],
  'West Valley Regional Branch': [34.194, -118.545],
  'Los Angeles Elementary School': [34.045, -118.307],
}

/** Rough center + zoom per region, for framing the map after a search. */
export interface MapView {
  center: LatLng
  zoom: number
}

export const REGION_VIEWS: Record<string, MapView> = {
  'San Diego (US 1)': { center: [32.83, -117.15], zoom: 10 },
  'Houston (US 10)': { center: [29.74, -95.44], zoom: 10 },
  'Monterrey (MX 1)': { center: [25.66, -100.35], zoom: 11 },
  'Dhaka (BD 1)': { center: [23.81, 90.41], zoom: 11 },
  'Cleveland (US 19)': { center: [41.5, -81.67], zoom: 11 },
  'Los Angeles (US 6)': { center: [34.07, -118.36], zoom: 10 },
}

/** Whole-world default before any region is chosen. */
export const DEFAULT_VIEW: MapView = { center: [25, -60], zoom: 2 }
