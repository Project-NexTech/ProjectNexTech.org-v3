/**
 * Partner and sponsor cards for the About page.
 *
 * PROVENANCE — the first seven entries are REAL, taken from the live site's
 * About page (captured 2026-08-12), including their relationship details and
 * links. Descriptions have been rewritten to the ~50-word length the brief
 * asks for, so they are faithful in substance but not verbatim.
 *
 * The remaining five are INVENTED placeholders purely to fill the 12-card grid
 * the brief specifies. Each says "placeholder" and should be replaced or
 * deleted by PNT.
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
    description:
      'Our partner in Nuevo León, Mexico, supporting F.I.R.S.T. Robotics initiatives and STEM classes in the Monterrey region. They make our programming in Mexico possible and help us reach students far outside Southern California.',
  },

  /* ---- Placeholder entries below. Replace or delete. ---- */
  {
    name: 'Placeholder Partner One',
    tier: 'supporting',
    url: 'https://projectnextech.org/',
    logo: '/media/about/partners/partner-placeholder-01.png',
    description:
      'This is placeholder text describing a supporting partner relationship. Replace this entry with a real organization, its logo, its site, and roughly fifty words about what the partnership provides to our students and volunteers.',
  },
  {
    name: 'Placeholder Partner Two',
    tier: 'bronze',
    url: 'https://projectnextech.org/',
    logo: '/media/about/partners/partner-placeholder-02.png',
    description:
      'This is placeholder text describing a bronze-tier sponsor. Replace this entry with a real organization, its logo, its site, and roughly fifty words about what the sponsorship funds and why it matters to the programs we run.',
  },
  {
    name: 'Placeholder Partner Three',
    tier: 'gold',
    url: 'https://projectnextech.org/',
    logo: '/media/about/partners/partner-placeholder-03.png',
    description:
      'This is placeholder text describing a gold-tier sponsor. Replace this entry with a real organization, its logo, its site, and roughly fifty words about the scale of their support and the programs it makes possible each year.',
  },
  {
    name: 'Placeholder Partner Four',
    tier: 'operating',
    url: 'https://projectnextech.org/',
    logo: '/media/about/partners/partner-placeholder-04.png',
    description:
      'This is placeholder text describing an operating partner. Replace this entry with a real organization, its logo, its site, and roughly fifty words about the programs we co-host or the community we reach together.',
  },
  {
    name: 'Placeholder Partner Five',
    tier: 'supporting',
    url: 'https://projectnextech.org/',
    logo: '/media/about/partners/partner-placeholder-05.png',
    description:
      'This is placeholder text describing another supporting partner. Replace this entry with a real organization, its logo, its site, and roughly fifty words about the in-kind support they contribute to our operations.',
  },
]
