/**
 * Partner and sponsor cards for the About page.
 *
 * PROVENANCE — the first seven entries are REAL, taken from the live site's
 * About page (captured 2026-08-12), including their relationship details and
 * links. Descriptions have been rewritten to the ~50-word length the brief
 * asks for, so they are faithful in substance but not verbatim.
 *
 * The five INVENTED placeholder entries that once padded this list out to the
 * 12-card grid the brief specifies were DELETED in the content phase. A card
 * naming an organization that does not exist is worse than a shorter grid, and
 * the grid reflows cleanly at seven. Append real partners here as they sign.
 *
 * TIERS WERE ASSIGNED BY INFERENCE, not stated on the live site — Qualcomm's
 * "Silver Sponsor" in particular is a guess from the ">$4,000 in grants"
 * figure. PNT should correct these. Valid keys are in PARTNER_TIERS
 * (src/constants): operating, supporting, bronze, silver, gold.
 */

import type { PartnerTierKey } from '@/constants'

export interface Partner {
  name: string
  /** Key into PARTNER_TIERS. Typed so a typo cannot silently render untiered. */
  tier: PartnerTierKey
  url: string
  logo: string
  /**
   * Set to 'light' when the logo file is a WHITE-INK mark on transparency.
   *
   * Those assets came from a site that only ever had a dark theme, so nobody
   * noticed: on this site's light card they are all but invisible (measured at
   * 72% and 70% of their ink having no usable contrast). The About page gives
   * a flagged logo a dark chip to sit on, in light mode only.
   *
   * This is a property of the FILE, not of the brand — replace the asset with
   * a dark or full-color variant and delete the flag.
   */
  ink?: 'light'
  description: string
}

export const PARTNERS: readonly Partner[] = [
  {
    name: 'City of San Diego',
    tier: 'operating',
    url: 'https://www.sandiego.gov/',
    logo: '/media/about/partners/partner-city-of-san-diego.png',
    description:
      'A Right of Entry contract with the City lets us run free STEM programs inside San Diego branch libraries. It is the backbone of our in-person work, giving families a familiar, accessible place to attend classes at no cost anywhere in the city.',
  },
  {
    name: 'International Research Olympiad',
    tier: 'operating',
    url: 'https://www.internationalresearcholympiad.org/',
    logo: '/media/about/partners/partner-international-research-olympiad.png',
    description:
      'Every Project NexTech school club is IRO-affiliated, and portions of our Research curriculum were developed directly by the IRO. The partnership connects our students to a global research community and keeps our academic material current.',
  },
  {
    name: 'Greater San Diego Science and Engineering Fair',
    tier: 'operating',
    url: 'https://www.gsdsef.org/',
    logo: '/media/about/partners/partner-gsdsef.png',
    description:
      'We co-host annual science fair bootcamps with GSDSEF, and our Science Fair curriculum was co-developed with their Student Leadership Board. Together we help students take a project from first idea through judging at an ISEF-affiliated fair.',
  },
  {
    name: 'Francis Parker School',
    tier: 'operating',
    url: 'https://www.francisparker.org/',
    logo: '/media/about/partners/partner-francis-parker-school.png',
    ink: 'light',
    description:
      'The school our founding members attended, and the first place that opened its doors to us. A facilities use agreement lets us host programs on campus for students across Linda Vista and the wider San Diego community.',
  },
  {
    name: 'Qualcomm',
    tier: 'silver',
    url: 'https://www.qualcomm.com/',
    logo: '/media/about/partners/partner-qualcomm.png',
    description:
      'Qualcomm has contributed over $4,000 through its grant programs and opens its San Diego campus to host our programs. That funding covers materials and kits that would otherwise put our hands-on engineering courses out of reach.',
  },
  {
    name: 'Google for Nonprofits',
    tier: 'supporting',
    url: 'https://www.google.org/',
    logo: '/media/about/partners/partner-google.png',
    description:
      'Through the Google for Nonprofits program we receive Google Workspace at no cost. Nearly all of our organizational infrastructure — shared drives, calendars, forms, and volunteer records — runs on tools this partnership provides.',
  },
  {
    name: 'Cyberius',
    tier: 'operating',
    url: 'https://www.instagram.com/cyberius6017/',
    logo: '/media/about/partners/partner-cyberius.png',
    ink: 'light',
    description:
      'Our partner in Nuevo León, Mexico, supporting F.I.R.S.T. Robotics initiatives and STEM classes in the Monterrey region. They make our programming in Mexico possible and help us reach students far outside Southern California.',
  },
  {
    name: 'SweetGeeks Foundation',
    tier: 'silver',
    url: 'https://www.sweetgeeksfoundation.org/',
    logo: '/media/about/partners/partner-sweetgeeks-foundation.png',
    description:
      'Placeholder',
  },
]
