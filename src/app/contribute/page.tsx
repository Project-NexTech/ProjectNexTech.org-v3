import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import PageHeader from '@/components/ui/PageHeader'
import ProtectedEmail from '@/components/ui/ProtectedEmail'
import Wordmark from '@/components/ui/Wordmark'
import { cx } from '@/lib/cx'
import { DONORBOX, EMAILS } from '@/constants'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'Contribute',
  description:
    'Partner with Project NexTech or donate to fund the free STEM programs we run for students.',
}

type Tone = 'accent' | 'alt'

const PARTNERSHIP_TYPES: readonly { label: string; tone: Tone; body: string }[] = [
  {
    label: 'Operating partners',
    tone: 'accent',
    body: 'Organizations we co-host programs with, or work alongside on curriculum and events. This is placeholder text describing what an operating partnership involves.',
  },
  {
    label: 'Supporting partners',
    tone: 'alt',
    body: 'Organizations providing in-kind support — software, space, materials, or services. This is placeholder text describing what we typically receive and give back.',
  },
  {
    label: 'Sponsors',
    tone: 'accent',
    body: 'Organizations funding us directly through grants or donations, recognized at bronze, silver, and gold tiers. This is placeholder text about what sponsorship funds.',
  },
  {
    label: 'Program hosts',
    tone: 'alt',
    body: 'Libraries, schools, and community spaces that give us a room to teach in. This is placeholder text about what hosting a program actually asks of a venue.',
  },
  {
    label: 'Curriculum collaborators',
    tone: 'accent',
    body: 'Organizations that co-develop courses with our curriculum department. This is placeholder text describing how a collaboration of that kind usually starts.',
  },
]

const DONATION_POINTS: readonly { tone: Tone; body: string }[] = [
  {
    tone: 'accent',
    body: 'Every program we run is free to attend, so donations are what cover materials, kits, and printing. This is placeholder text about where the money goes first.',
  },
  {
    tone: 'alt',
    body: 'Funding lets us reach regions where students have no local STEM programming at all. This is placeholder text about expanding to new areas.',
  },
  {
    tone: 'accent',
    body: 'We are a registered 501(c)(3) nonprofit, so your donation is tax-deductible. This is placeholder text confirming what documentation you receive.',
  },
]

function Bullet({ tone, label, children }: { tone: Tone; label?: string; children: ReactNode }) {
  return (
    <li className={s.bullet}>
      <span
        className={cx(s.dot, tone === 'alt' ? s.dotAlt : s.dotAccent)}
        aria-hidden="true"
      />
      <span className={s.bulletBody}>
        {label && (
          <span className={tone === 'alt' ? s.labelAlt : s.labelAccent}>{label} — </span>
        )}
        {children}
      </span>
    </li>
  )
}

/**
 * OPEN ITEM (LAUNCH_READINESS.md): the live site exposes no Donorbox campaign
 * slug, so PNT has to supply it from the Donorbox dashboard. Until then this
 * renders a labelled stand-in rather than an empty column — the page has to
 * look deliberate while it waits.
 */
function DonorboxEmbed() {
  if (!DONORBOX.campaignSlug) {
    return (
      <div className={s.placeholder}>
        <p className={s.placeholderLabel}>Donorbox embed</p>
        <p className={s.placeholderBody}>
          The donation form appears here once a campaign slug is set. Copy it from the Donorbox
          dashboard under Campaign → Embed, then set <code>DONORBOX.campaignSlug</code> in{' '}
          <code>src/constants/index.ts</code>.
        </p>
      </div>
    )
  }

  return (
    <iframe
      src={`${DONORBOX.embedBase}${DONORBOX.campaignSlug}`}
      title="Donate to Project NexTech"
      name="donorbox"
      allow="payment"
      className={s.embed}
    />
  )
}

export default function ContributePage() {
  return (
    <div>
      <PageHeader
        title="Help our students further our mission"
        subtitle="This is placeholder subtitle text about the two ways to support our work — partnering with us directly, or funding the programs we already run."
      />

      <div className={s.columns}>
        <section>
          <h2 className={s.heading}>
            Partner with <Wordmark />
          </h2>

          <ul className={s.list}>
            {PARTNERSHIP_TYPES.map((type) => (
              <Bullet key={type.label} tone={type.tone} label={type.label}>
                {type.body}
              </Bullet>
            ))}
          </ul>

          <p className={s.note}>
            If any of these sound like a fit, email us and we can work out the details together.
          </p>
          <p className={s.email}>
            <ProtectedEmail email={EMAILS.ec} />
          </p>
        </section>

        <section>
          <h2 className={s.heading}>
            Donate to <Wordmark />
          </h2>

          <ul className={s.list}>
            {DONATION_POINTS.map((point) => (
              <Bullet key={point.body} tone={point.tone}>
                {point.body}
              </Bullet>
            ))}
          </ul>

          <div className={s.embedWrap}>
            <DonorboxEmbed />
          </div>
        </section>
      </div>
    </div>
  )
}
