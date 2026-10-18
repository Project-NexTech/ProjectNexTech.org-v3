import type { Metadata } from 'next'

import Article, {
  ArticleSection,
  Figure,
  Highlight,
  Note,
  P,
  RailCarousel,
} from '@/components/article/Article'
import BigNumber from '@/components/ui/BigNumber'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import Reveal from '@/components/ui/Reveal'
import { cx } from '@/lib/cx'
import { BIG_NUMBERS, IMPACT_REPORTS, MYMAP } from '@/constants'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'Impact',
  description:
    'How far Project NexTech programs reach, what they change for students and volunteers, and our quarterly impact reports.',
}

/** Long captions, per the brief — these stand in for volunteer quotes. */
const VOLUNTEER_CAROUSEL = [
  'This is a placeholder caption standing in for a direct quote from a volunteer about what running their first program taught them, why they came back for a second one, and what they would tell a student considering signing up to teach.',
  'This is a placeholder caption standing in for a quote from a volunteer who moved from assisting classes to leading a department, describing what changed about the work and what they had to learn to make that step.',
  'This is a placeholder caption standing in for a quote from a volunteer who started a project group in their own city, covering how they recruited other students and what the first few months actually looked like.',
].map((caption, index) => ({
  src: `/media/impact/volunteers/volunteers-${String(index + 1).padStart(2, '0')}.png`,
  caption,
}))

/**
 * OPEN ITEM (LAUNCH_READINESS.md): PNT has to supply the My Maps embed URL —
 * Share -> Embed, then copy the iframe's src. Until then this renders a
 * labelled stand-in rather than a blank band at the top of the page.
 */
function MyMapEmbed() {
  if (!MYMAP.embedUrl) {
    return (
      <div className={s.placeholder}>
        <p className={s.placeholderLabel}>Google MyMap embed</p>
        <p className={s.placeholderBody}>
          The map of everywhere we have run programs appears here once an embed URL is set. In
          Google My Maps choose Share → Embed, copy the iframe&rsquo;s <code>src</code>, and set{' '}
          <code>MYMAP.embedUrl</code> in <code>src/constants/index.ts</code>.
        </p>
      </div>
    )
  }

  return (
    <iframe
      src={MYMAP.embedUrl}
      title="Map of Project NexTech programs"
      className={s.embed}
    />
  )
}

export default function ImpactPage() {
  return (
    <div>
      <PageHeader
        title="See our impact"
        subtitle="We measure our impact through the students who participate in our programs, the volunteers who work with us to make the programs possible, and the communities where they occur. Our figures are compiled from extensive program records, robust volunteer racking, and live reports from Project NexTech teams operating in different regions. Behind every number is an individual student who chose to spend time with us learning, teaching, building, engaging or sharing STEM with others."
      />

      {/* Full width of the content container, matching the navbar's bounds. */}
      <section>
        <MyMapEmbed />
      </section>

      <section className={s.numbers}>
        <ul className={s.numberGrid}>
          {BIG_NUMBERS.map((number, index) => (
            <Reveal as="li" key={number.key} delay={(index % 4) * 70}>
              {/* Offsetting by the row index turns the alternation into a
                  checkerboard, so the second row of four starts on blue
                  instead of repeating the first row's orange. */}
              <BigNumber number={number} index={index + Math.floor(index / 4)} />
            </Reveal>
          ))}
        </ul>
      </section>

      <Article className={s.article}>
        <ArticleSection title="Impact on our students" id="students">
          <P>
Project NexTech gives students opportunities to experience STEM by doing it. During our programs, students move from being introduced to a concept to applying it through an experiment, engineering challenge, piece of code, model, or project of their own. Our goal is not for a student to master an entire subject in a few hours; it is for them to understand something they did not understand before, become more comfortable experimenting with it, and leave with a reason to continue exploring. Because our programs are free, students can try unfamiliar subjects without cost becoming another barrier to getting started.
          </P>
          <Figure
            src="/media/impact/students/students-01.png"
            caption="More than X,XXX students have participated in Project NexTech programs since 2023."
          />

          <Highlight>
            A placeholder highlight line, ideally a statistic about student outcomes.
          </Highlight>

          <P>
Many of our courses are structured deliberately as multi-session series in which students build on concepts and projects over several weeks. Returning students can take on increasingly difficult challenges, ask more advanced questions, and become more independent as instructors shift from demonstrating a process to helping students solve problems themselves.
          </P>

          <Highlight>
            A second placeholder highlight line about what students say afterwards.
          </Highlight>

          <P>
            This is a placeholder paragraph about students who went on to compete in
            science fairs, join robotics teams, or start their own projects.
          </P>
          <Figure
            src="/media/impact/students/students-02.png"
            caption="Placeholder caption for a photo of a student presenting their work."
          />
        </ArticleSection>

        <ArticleSection title="Building volunteers and leaders" id="volunteers">
          <P>
The students teaching our programs are learning too. Project NexTech gives high school and college volunteers real responsibility for explaining technical ideas, working with younger students, preparing activities, communicating with community partners, and following through on commitments to a team. Our volunteers are trained from the ground up with an experienced instructor, allowing the programs to create learning opportunities for both attending students and student volunteers.
          </P>
          <RailCarousel items={VOLUNTEER_CAROUSEL} />

          <Highlight>A placeholder highlight line about volunteer growth.</Highlight>

          <P>
Volunteers are able to take on more responsibility as they gain experience. An instructor may begin by assisting with an activity, later lead a class, help improve the curriculum they taught, coordinate programs with a community partner, or move into a department or leadership position
          </P>

          <Highlight>
            A second placeholder highlight line, ideally a volunteer statistic.
          </Highlight>

          <P>
            This is a placeholder paragraph about where our volunteers go afterwards and
            what they carry with them from the experience.
          </P>
        </ArticleSection>

        <ArticleSection title="Shaping better communities" id="communities">
          <P>
Project NexTech programs are built around the community spaces that students and families already use. Libraries, schools, and community organizations provide trusted and accessible places to learn, while Project NexTech provides volunteers, curriculum, and hands-on programming at no cost to participating students. When programs return to the same location, families gain access to STEM opportunities without needing to seek out a new organization or pay for a separate extracurricular program each time.
          </P>
          <Figure
            src="/media/impact/communities/communities-01.png"
            caption="Placeholder caption for a photo from a community program."
          />

          <P>
Since beginning in San Diego in 2023, Project NexTech has expanded through both locally organized programs and online collaboration. Our programs have now reached students across more than XX countries and over XXX regions. Each new community is different, so expansion depends on local volunteers and partners who understand where students gather, what opportunities already exist, and what kinds of programs are actually useful there. Instead of assuming that one model works everywhere, we use a common curriculum and organizational framework while allowing local teams to adapt how programs are delivered.
          </P>
        </ArticleSection>

        <ArticleSection title="Quarterly impact reports" id="reports">
          <P>
Our quarterly impact reports provide a more detailed record of Project NexTech&apos;s work than the totals shown above. Each report summarizes A, B, C, D,E, F.  Figures are compiled from Project NexTech&apos;s internal program and volunteer records and reviewed before publication. Publishing these reports also gives us a consistent record to submit to our sponsors and donors.
          </P>
          <Note title="All reports">
            <ul className={s.reports}>
              {IMPACT_REPORTS.map((report, index) => (
                <li key={report.label}>
                  <a
                    href={report.path}
                    target="_blank"
                    rel="noreferrer"
                    /* Alternates orange/blue down the list, matching the Big
                       Numbers and article highlights. */
                    className={cx(
                      'cursor-external',
                      s.report,
                      index % 2 === 0 ? s.reportAccent : s.reportAlt,
                    )}
                  >
                    <span className={s.reportIcon}>
                      <Icon name="document" size={13} />
                    </span>
                    {report.label}
                  </a>
                </li>
              ))}
            </ul>
          </Note>

          <P>
As the organization has grown, Project NexTech’s methods for recording impact have become more robust and more structured. Earlier records may contain less detail than newer reports, and some categories or definitions have changed as our tracking systems developed. When comparing reports from different periods, readers should therefore use the methodology described in each individual report rather than assuming that every metric was collected in exactly the same way.
          </P>
        </ArticleSection>
      </Article>
    </div>
  )
}
