import type { Metadata } from 'next'

import Article, {
  ArticleSection,
  Figure,
  Highlight,
  P,
  RailCarousel,
} from '@/components/article/Article'
import DiscordWidget from '@/components/volunteer/DiscordWidget'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import SectionHeader from '@/components/ui/SectionHeader'
import Wordmark from '@/components/ui/Wordmark'
import { DISCORD, MEDIA_LINKS } from '@/constants'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'Volunteer',
  description:
    'Join the global community of students who run Project NexTech — teaching in person, writing curriculum, or building the tools the organization runs on.',
}

/**
 * Pulls the video id out of whatever YouTube URL shape the constant holds, so
 * PNT can paste a normal watch/share link rather than an embed URL.
 */
function youtubeId(url: string): string | null {
  const match = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/.exec(url)
  return match?.[1] ?? null
}

/**
 * Height of the Google Slides control bar. Fixed, not proportional.
 *
 * Measured rather than assumed: at a 1024px-wide iframe the deck was still
 * letterboxed by ~6px per side, which back-solves to a bar of ~37px. (Google's
 * own 1440x839 embed size implies 29px, which is wrong in practice.)
 *
 * Erring 1px high is deliberate — overshooting adds an invisible sliver of
 * vertical letterbox, whereas undershooting brings the black side bars back.
 */
const SLIDES_CONTROL_BAR_PX = 38

const CAROUSEL_IN_PERSON = [
  'Placeholder caption about teaching a class at a local library branch.',
  'Placeholder caption about setting up materials before students arrive.',
  'Placeholder caption about mentoring a robotics team after school.',
  'Placeholder caption about running a booth at a community event.',
].map((caption, index) => ({
  src: `/media/volunteer/in-person/in-person-${String(index + 1).padStart(2, '0')}.png`,
  caption,
}))

const CAROUSEL_ONLINE = [
  'Placeholder caption about writing curriculum for a new course.',
  'Placeholder caption about teaching an online session to students abroad.',
  'Placeholder caption about designing graphics for social media.',
  'Placeholder caption about building tools for the software department.',
].map((caption, index) => ({
  src: `/media/volunteer/online/online-${String(index + 1).padStart(2, '0')}.png`,
  caption,
}))

const VIDEO_ID = youtubeId(MEDIA_LINKS.volunteerInfoVideo)

export default function VolunteerPage() {
  return (
    <div>
      <PageHeader
        title="Become a volunteer"
        subtitle={
          <>
            Join the global community of students who run <Wordmark />
          </>
        }
      />

      <section>
        <SectionHeader>Watch the video</SectionHeader>
        <div className={s.frame}>
          {VIDEO_ID ? (
            /* Muted is required — browsers block autoplay with sound.
               youtube-nocookie keeps the visitor out of Google's ad profile,
               which matters on a site for students. */
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1`}
              title="Volunteer information video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={s.video}
            />
          ) : (
            <p className={s.videoFallback}>
              Could not read a video id from <code>MEDIA_LINKS.volunteerInfoVideo</code>.
            </p>
          )}
        </div>
      </section>

      <section className={s.section}>
        <SectionHeader>Join our Discord server</SectionHeader>

        <div className={s.discord}>
          <DiscordWidget />

          <div className={s.invite}>
            <a
              href={DISCORD.invite}
              target="_blank"
              rel="noreferrer"
              aria-label="Join the Project NexTech Discord server"
              className={s.logo}
            >
              <Icon name="discord" size={120} />
              {/* eslint-disable-next-line @next/next/no-img-element --
                  a fixed 40px SVG glyph from public/; next/image would add a
                  wrapper and an optimization round-trip for no benefit. */}
              <img
                src="/cursors/link-external.svg"
                alt=""
                width="40"
                height="40"
                className={s.logoCursor}
              />
            </a>

            <p className={s.inviteBody}>
              We run nearly all of our operations through Discord. Join at{' '}
              <a href={DISCORD.invite} target="_blank" rel="noreferrer" className="link-external">
                {DISCORD.vanity}
              </a>{' '}
              or by clicking the logo above.
            </p>
          </div>
        </div>
      </section>

      <Article className={s.article}>
        <ArticleSection title="Why volunteer" id="why-volunteer">
          <P>
            This is placeholder text about what volunteers get out of running programs with{' '}
            <Wordmark />. It should run three to five sentences and be honest about the
            time commitment as well as the payoff.
          </P>
          <ul className={s.bullets}>
            <li>Placeholder bullet about teaching experience.</li>
            <li>Placeholder bullet about verified volunteer hours.</li>
            <li>Placeholder bullet about leadership opportunities.</li>
            <li>Placeholder bullet about joining a global community of students.</li>
          </ul>
          <Highlight>
            A placeholder highlight line about why students keep volunteering.
          </Highlight>
          <Figure
            src="/media/volunteer/why-volunteer/why-volunteer-01.png"
            caption="Placeholder caption for a photo of volunteers running a program."
          />

          <P>
            This is a placeholder closing paragraph for this section, pointing at the two
            ways to contribute described below.
          </P>
        </ArticleSection>

        <ArticleSection title="Ways to contribute in person" id="in-person">
          <P>
            This is placeholder text about teaching programs in person at libraries,
            schools, and community spaces. Two to three sentences.
          </P>
          <RailCarousel items={CAROUSEL_IN_PERSON} />

          <Highlight>A placeholder highlight line about in-person teaching.</Highlight>

          <P>
            This is a placeholder paragraph about assisting rather than leading a class,
            which is how most volunteers start out.
          </P>

          <Highlight>A second placeholder highlight line about in-person work.</Highlight>

          <P>
            This is a placeholder paragraph about helping run events, prepare materials,
            and set up venues before a program begins.
          </P>
        </ArticleSection>

        <ArticleSection title="Ways to contribute online" id="online">
          <P>
            This is placeholder text about the departments that operate entirely online —
            curriculum, social media, business, communications, and software.
          </P>
          <RailCarousel items={CAROUSEL_ONLINE} />

          <Highlight>A placeholder highlight line about remote contribution.</Highlight>

          <P>
            This is a placeholder paragraph about writing and reviewing curriculum for the
            courses other volunteers teach.
          </P>

          <P>
            This is a placeholder paragraph about teaching programs online to students in
            regions where we have no in-person presence.
          </P>

          <Highlight>A second placeholder highlight line about online work.</Highlight>

          <P>
            This is a placeholder paragraph about building and maintaining the tools the
            organization runs on, including this website.
          </P>
        </ArticleSection>
      </Article>

      <section className={s.section}>
        <SectionHeader>Slideshow for prospective volunteers</SectionHeader>
        <div className={s.frame}>
          <div
            className={s.slidesBox}
            style={{ paddingBottom: `calc(56.25% + ${SLIDES_CONTROL_BAR_PX}px)` }}
          >
            <iframe
              src={MEDIA_LINKS.volunteerSlidesEmbed}
              title="Slideshow for prospective volunteers"
              allowFullScreen
              className={s.slides}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
