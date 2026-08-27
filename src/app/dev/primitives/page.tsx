import type { Metadata } from 'next'

import { EMAILS } from '@/constants'
import BigNumber from '@/components/ui/BigNumber'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Carousel from '@/components/ui/Carousel'
import Icon from '@/components/ui/Icon'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import PageHeader from '@/components/ui/PageHeader'
import ProtectedEmail from '@/components/ui/ProtectedEmail'
import SectionHeader from '@/components/ui/SectionHeader'
import Tag from '@/components/ui/Tag'
import Wordmark from '@/components/ui/Wordmark'
import s from './page.module.css'

/**
 * TEMPORARY review surface for the Phase 2 primitives.
 *
 * Every page is still a placeholder, so without this nothing imports the
 * primitives and a build proves nothing about them. This renders every variant
 * of every primitive on one page so the Phase 2 gate can actually be checked
 * against the prototype.
 *
 * The prototype had the same thing at /components and deleted it once the real
 * pages existed. DELETE THIS ROUTE at the end of Phase 4.
 */
export const metadata: Metadata = {
  title: 'Primitives (dev)',
  robots: { index: false, follow: false },
}

const BUTTON_VARIANTS = ['primary', 'alt', 'secondary', 'ghost'] as const
const BUTTON_SIZES = ['sm', 'md', 'lg'] as const
const TAG_TONES = ['neutral', 'accent', 'alt', 'quiet'] as const
const RATIOS = ['16:9', '4:3', '1:1', '3:2'] as const

const CAROUSEL_ITEMS = [
  { src: '/media/home/carousel/slide-01.png', heading: 'First slide', caption: 'A placeholder caption for the first slide.' },
  { src: '/media/home/carousel/slide-02.png', heading: 'Second slide', caption: 'A placeholder caption for the second slide.' },
  { src: '/media/home/carousel/slide-03.png', heading: 'Third slide', caption: 'A placeholder caption for the third slide.' },
]

export default function PrimitivesPage() {
  return (
    <div className={s.page}>
      <PageHeader
        title="Primitives"
        subtitle={
          <>
            Every Phase 2 primitive, every variant. A temporary review surface for{' '}
            <Wordmark />, deleted at the end of Phase 4.
          </>
        }
      />

      <section className={s.section}>
        <SectionHeader subtitle="Four variants, three sizes">Button</SectionHeader>
        {BUTTON_SIZES.map((size) => (
          <div key={size} className={s.row}>
            <code className={s.rowLabel}>{size}</code>
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} to="/dev/primitives" variant={variant} size={size}>
                {variant}
              </Button>
            ))}
          </div>
        ))}
        <div className={s.row}>
          <code className={s.rowLabel}>as</code>
          <Button to="/dev/primitives" variant="secondary">
            Link (to)
          </Button>
          <Button href="https://projectnextech.org" variant="secondary">
            Anchor (href)
          </Button>
          <Button variant="secondary" chrome>
            Button, chrome cursor
          </Button>
        </div>
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Four tones, two sizes">Tag</SectionHeader>
        <div className={s.row}>
          <code className={s.rowLabel}>sm</code>
          {TAG_TONES.map((tone) => (
            <Tag key={tone} tone={tone} icon="tag">
              {tone}
            </Tag>
          ))}
        </div>
        <div className={s.row}>
          <code className={s.rowLabel}>xs</code>
          {TAG_TONES.map((tone) => (
            <Tag key={tone} tone={tone} size="xs">
              {tone}
            </Tag>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Plain and interactive">Card</SectionHeader>
        <div className={s.grid}>
          <Card className={s.cardBody}>
            <p>A plain card. Hovering does nothing.</p>
          </Card>
          <Card interactive className={s.cardBody}>
            <p>An interactive card. Hover for the 2px lift.</p>
          </Card>
        </div>
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Positional orange/blue alternation">BigNumber</SectionHeader>
        <div className={s.grid}>
          {[
            { key: 'a', value: 2650, suffix: '+', label: 'students taught', onHome: true },
            { key: 'b', value: 19, suffix: '+', label: 'countries reached', onHome: true },
            { key: 'c', value: 15.6, prefix: '$', suffix: 'k+', label: 'amount raised', decimals: 1, onHome: false },
          ].map((number, index) => (
            <BigNumber key={number.key} number={number} index={index} />
          ))}
        </div>
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Four aspect ratios, no file present">ImagePlaceholder</SectionHeader>
        <div className={s.grid}>
          {RATIOS.map((ratio) => (
            <ImagePlaceholder key={ratio} ratio={ratio} src={`/media/example/${ratio}.png`} />
          ))}
        </div>
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Autoplay, dots, hover arrows, captions">Carousel</SectionHeader>
        <div className={s.narrow}>
          <Carousel items={CAROUSEL_ITEMS} />
        </div>
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Never contiguous in the DOM">ProtectedEmail</SectionHeader>
        <div className={s.row}>
          <ProtectedEmail email={EMAILS.info} />
          <ProtectedEmail email={EMAILS.programs} accent="blue" />
        </div>
      </section>

      <section className={s.section}>
        <SectionHeader small>SectionHeader, small variant</SectionHeader>
      </section>

      <section className={s.section}>
        <SectionHeader subtitle="Stroked glyphs and filled brand marks">Icon</SectionHeader>
        <div className={s.row}>
          {['menu', 'close', 'mail', 'map-pin', 'calendar', 'robot', 'sun', 'moon'].map((name) => (
            <span key={name} className={s.iconCell}>
              <Icon name={name} size={20} />
              <code className={s.iconName}>{name}</code>
            </span>
          ))}
        </div>
        <div className={s.row}>
          {['linkedin', 'instagram', 'youtube', 'facebook', 'discord'].map((name) => (
            <span key={name} className={s.iconCell}>
              <Icon name={name} size={20} />
              <code className={s.iconName}>{name}</code>
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
