import type { Metadata } from 'next'

import Article, {
  ArticleSection,
  Figure,
  Highlight,
  P,
  RailCarousel,
} from '@/components/article/Article'
import Card from '@/components/ui/Card'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import PageHeader from '@/components/ui/PageHeader'
import Reveal from '@/components/ui/Reveal'
import SectionHeader from '@/components/ui/SectionHeader'
import Wordmark from '@/components/ui/Wordmark'
import { cx } from '@/lib/cx'
import { PARTNERS, type Partner } from '@/data/partners'
import { PARTNER_TIERS, type PartnerTone } from '@/constants'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who Project NexTech is, how the organization started, how we think STEM should be taught, and the partners who make our programs possible.',
}

const ABOUT_CAROUSEL = [
  'A placeholder caption for the first photo in the About us carousel.',
  'A placeholder caption for the second photo in the About us carousel.',
  'A placeholder caption for the third photo in the About us carousel.',
  'A placeholder caption for the fourth photo in the About us carousel.',
  'A placeholder caption for the fifth photo in the About us carousel.',
].map((caption, index) => ({
  heading: 'Placeholder heading',
  caption,
  src: `/media/about/about-us/about-us-${String(index + 1).padStart(2, '0')}.png`,
}))

/**
 * A tier's `tone` is a semantic name from constants; the mapping onto a class
 * is the page's business, so constants stays ignorant of how it is styled.
 */
const TONE_CLASSES: Record<PartnerTone, string> = {
  accent: s.toneAccent,
  'accent-alt': s.toneAccentAlt,
  bronze: s.toneBronze,
  silver: s.toneSilver,
  gold: s.toneGold,
}

function PartnerCard({ partner }: { partner: Partner }) {
  const tier = PARTNER_TIERS[partner.tier]

  return (
    <Card interactive className={s.card}>
      <ImagePlaceholder src={partner.logo} ratio="1:1" className={s.logo} alt="" />

      <div className={s.partnerBody}>
        <h3 className={s.partnerName}>
          <a href={partner.url} target="_blank" rel="noreferrer" className="link-external">
            {partner.name}
          </a>
        </h3>
        <p className={cx(s.tier, TONE_CLASSES[tier.tone], tier.bold && s.tierBold)}>
          {tier.label}
        </p>
        <p className={s.description}>{partner.description}</p>
      </div>
    </Card>
  )
}

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="What is Project NexTech?"
        subtitle="We teach STEM to students and do everything else needed to make that happen through an international student-led nonprofit."
      />

      <Article>
        <ArticleSection title="About us" id="about-us">
          <P>
            This is placeholder text introducing who we are and what we do. It should run four
            or five sentences and give a reader arriving cold a clear sense of the
            organization before they go any further. Describe the students we teach, the
            volunteers who teach them, and the scale we operate at today. Keep the tone plain
            and confident rather than promotional. Close with what makes the model unusual —
            that it is run end to end by students.
          </P>
          <RailCarousel items={ABOUT_CAROUSEL} />
        </ArticleSection>

        <ArticleSection title="History" id="history">
          <P>
            This is placeholder text for the opening of our history, covering the founding of{' '}
            <Wordmark /> and the very first program we ever ran. It should say who started the
            organization, where, and what problem they were trying to solve. Three to six
            sentences is the right length for each paragraph in this section.
          </P>
          <Figure
            src="/media/about/history/history-01.png"
            caption="Placeholder caption for a photo of the first Project NexTech program ever run."
          />

          <P>
            This is a placeholder paragraph covering the earliest period of growth, when the
            organization moved from a single classroom to a recurring schedule of programs.
            Describe the first partnerships, the first volunteers who joined from outside the
            founding group, and what changed once programs ran regularly.
          </P>
          <Figure
            src="/media/about/history/history-02.png"
            caption="Placeholder caption for a photo from our earliest period of growth."
          />

          <Highlight>
            A placeholder highlight line marking a turning point in the organization&rsquo;s
            history.
          </Highlight>

          <P>
            This is a placeholder paragraph about expanding beyond San Diego, both to other
            cities in the United States and to programs run internationally. Cover how remote
            programs made that possible and which regions came first.
          </P>
          <Figure
            src="/media/about/history/history-03.png"
            caption="Placeholder caption for a photo from our first programs outside San Diego."
          />

          <P>
            This is a placeholder paragraph about formalizing the organization — incorporating
            as a nonprofit, establishing the Executive Committee and boards, and writing the
            Constitution that still governs how decisions get made.
          </P>
          <Figure
            src="/media/about/history/history-04.png"
            caption="Placeholder caption for a photo from the period when the organization formalized."
          />

          <Highlight>
            A second placeholder highlight line, drawn from somewhere later in this section.
          </Highlight>

          <P>
            This is a placeholder paragraph bringing the history up to the present day, and
            pointing at where the organization is heading next. It should end on the work
            still ahead rather than on past achievements.
          </P>
          <Figure
            src="/media/about/history/history-05.png"
            caption="Placeholder caption for a recent photo representing where the organization is today."
          />
        </ArticleSection>

        <ArticleSection title="Philosophy" id="philosophy">
          <P>
            This is placeholder text about how we think STEM should be taught. Cover why our
            programs are project-based and hands-on rather than lecture-driven, and what we
            think students actually retain from a single session. Three to five sentences.
          </P>

          <Highlight>
            A placeholder highlight line capturing the core of our teaching philosophy.
          </Highlight>

          <P>
            This is a placeholder paragraph about why the organization is run by students
            rather than adults, and what that changes about how our classes feel to the
            students attending them.
          </P>

          <P>
            This is a placeholder paragraph about access — why every program is free, what
            &ldquo;underserved&rdquo; means in practice for us, and how the partnerships
            described below make that possible.
          </P>
        </ArticleSection>
      </Article>

      <section className={s.partners}>
        <SectionHeader>Our partners</SectionHeader>

        <Reveal as="ul" className={s.partnerGrid}>
          {PARTNERS.map((partner) => (
            <li key={partner.name}>
              <PartnerCard partner={partner} />
            </li>
          ))}
        </Reveal>
      </section>
    </div>
  )
}
