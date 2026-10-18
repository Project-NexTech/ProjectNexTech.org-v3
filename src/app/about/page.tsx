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
import { cx } from '@/lib/cx'
import { PARTNERS, type Partner } from '@/data/partners'
import { PARTNER_TIERS, type PartnerTone } from '@/constants'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who Project NexTech is, how the organization started, how we think STEM should be taught, and the partners who make our programs possible.',
}

/**
 * The "About us" carousel.
 *
 * These are the eight photos the live site showed as its programs gallery, on
 * its own About page — same page, same generic role, so they carry over
 * one-to-one. Six are 4:3 natively; about-us-06 is square and about-us-08 is
 * 16:9, both of which crop to fit.
 *
 * COUNT IS THE CONFIGURATION, and captions are deliberately absent — same
 * reasoning as the home carousel in src/app/page.tsx.
 */
const ABOUT_CAROUSEL_COUNT = 8

const ABOUT_CAROUSEL = Array.from({ length: ABOUT_CAROUSEL_COUNT }, (_, index) => ({
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
      <ImagePlaceholder
        src={partner.logo}
        ratio="1:1"
        fit="contain"
        className={cx(s.logo, partner.ink === 'light' && s.inkChip)}
        alt=""
      />

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
Project NexTech is an international student-led nonprofit that creates and teaches free STEM programs for students. Our high school and college volunteers develop curriculum, organize partnerships, prepare materials, and teach classes covering subjects from engineering and programming to biology, physics, and research. Since 2023, our programs have reached thousands of students through hundreds of classes, workshops, and mentoring opportunities. We work with schools, libraries, community organizations, and other partners to make those opportunities accessible at no cost to students or our hosts. What makes our model unusual is that students do nearly every part of the work themselves, from developing a lesson to putting it in front of a classroom.
          </P>
          <RailCarousel items={ABOUT_CAROUSEL} />
        </ArticleSection>

        <ArticleSection title="History" id="history">
          <P>
            Project NexTech began on May 19, 2023, when eight students at Francis Parker School in San Diego decided they wanted to teach STEM beyond their own classrooms. The group voted on what kind of service project to pursue and chose to create STEM workshops for younger students. Their first program was held at Mira Mesa Library, where four volunteers taught just two students. Those first classes focused on Java and Python and established the fundamental principle that still drives Project NexTech today: students using what they know to teach other students.
          </P>
          <Figure
            src="/media/about/history/history-01.png"
            caption="Project NexTech&apos;s first program at Mira Mesa Library, where four student volunteers taught a class of two students."
          />

          <P>
What began as an occasional workshop gradually became a recurring program. Project NexTech expanded into additional subjects, recruited volunteers beyond its original Francis Parker core group, and began working with more libraries and community organizations throughout San Diego. By early 2024, an agreement with the City of San Diego made it possible to run free programs throughout the San Diego Public Library system, giving volunteers consistent places to teach and families familiar places to attend.
          </P>
          <Figure
            src="/media/about/history/history-02.png"
            caption="Early Project NexTech programs established"
          />

          <Highlight>
            A placeholder highlight line, drawn from somewhere in this section.
          </Highlight>

          <P>
As the organization grew, Project NexTech also began expanding beyond San Diego. Online programs, and remote collaboration allowed volunteers to teach and organize from different communities. Local groups also gave students the ability to bring Project NexTech programs into their own regions. Programs and volunteers eventually expanded across the United States and internationally, reaching students in communities including Mexico and Bangladesh and many others around the world.
          </P>
          <Figure
            src="/media/about/history/history-03.png"
            caption="Project NexTech&apos;s growth beyond San Diego allowed volunteers to bring free STEM education to new communities."
          />

          <P>
However, this same growth also required Project NexTech to become a more formal organization. In 2024, Project NexTech incorporated as a California nonprofit and later a federal 501(c)(3) tax-exempt nonprofit. As these operations expanded, the organization also established a governing hierarchical structure including its student Executive Committee, Board of Directors, and adult Board of Advisors.
          </P>
          <Figure
            src="/media/about/history/history-04.png"
            caption="As Project NexTech grew, its student leadership developed the organization structure needed to support programs at a larger scale."
          /> { /* Add an image of the chart from the organization intro slideshow */}

          <Highlight>
            A second placeholder highlight line, drawn from somewhere later in this section.
          </Highlight>

          <P>
Today dozens of student volunteers contribute to Project NexTech through teaching, curriculum development, outreach, communications, software, business operations, and leadership. Together, they support hundreds of programs and a growing collection of STEM courses used in communities around the world. But scale is not our end goal. Our next challenge is making each program more effective, making our curriculum better, and building an organization that allows students in more communities to create lasting STEM opportunities of their own.
          </P>
          <Figure
            src="/media/about/history/history-05.png"
            caption="Placeholder caption for a recent photo representing where the organization is today."
          />
        </ArticleSection>

        <ArticleSection title="Philosophy" id="philosophy">
          <P>
We believe students learn STEM best when they have something to do with it. Instead of building programs around long school-like lectures, our courses use multiple experiments, engineering challenges, programming projects, demonstrations and hands-on activities to turn concepts into something students can really test for themselves. We don&apos;t expect any of our students to master a field after a single session. Instead, we want them to leave having understood something new about the world, with a reason to keep learning.
          </P>

          <Highlight>
            A placeholder highlight line capturing the core of our teaching philosophy.
          </Highlight>

          <P>
We are intentionally student-led as well. Our volunteers are often close enough in age to the students they teach to remember what made a subject confusing or exciting when they first encountered it themselves. That makes teaching less like a formal lecture and more like an older student peer helping another understand something they care about. At the same time, we give all of our volunteers genuine responsibility in order to develop them as instructors and leaders while creating something useful for other students.
          </P>

          <P>
Access is equally important to our teaching model. Project NexTech programs are free because cost should not determine whether a student gets to explore engineering, programming, science, or another STEM field. Limited access can take many forms, such as expensive extracurricular programs, a lack of nearby opportunities, limited school resources, transportation barriers, or simply not knowing where to begin. By working with libraries, schools, and community organizations, we can bring programs into places families already know and use while our volunteers and supporters help provide the instruction, curriculum, and materials to provide to those who may not have these opportunities elsewhere.
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
