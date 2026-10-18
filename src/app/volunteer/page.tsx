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
  'Many of our classes are taught at local libraries and community spaces.',
  'Volunteers prepare materials and set up experiments before students arrive.',
  'Volunteers mentor students as they design, build, and improve robotics projects. ',
  'Volunteers teach a strawberry DNA extraction activity to children at a San Diego elementary school STEM fair. ',
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
            With Project NexTech, volunteers gain real world experience in creating, teaching, and outreach of local STEM education. Active volunteers must commit, at minimum, an average of half an hour each week but there are far more opportunities to get involved. Volunteering with Project NexTech gives students a way to give back to their communities and foster a love of STEM in the next generation, while gaining skills of their own.
          </P>
          <ul className={s.bullets}>
            <li><b>Teach real students:</b> Volunteers gain experience teaching students of different ages, learning how to become engaging instructors and adapt their teaching to the needs of each group.</li>
            <li><b>Earn verified volunteer hours:</b> Project NexTech provides volunteer hours verified by our adult board that can be used for school requirements, service awards, and other programs.</li>
            <li><b>Grow into leadership:</b> Committed volunteers can apply for leadership opportunities within Project NexTech, where they can lead teams, organize projects, and help shape the organization&apos;s future.</li>
            <li><b>Join a student community:</b> Volunteers join a global community of more than 300 students working together to reach students across four countries.</li>
          </ul>
          <Highlight>
            Project NexTech helps students use their passion for STEM to do good in their communities.
          </Highlight>
          <Figure
            src="/media/volunteer/why-volunteer/why-volunteer-01.png"
            caption="Placeholder caption for a photo of volunteers running a program."
          />

          <P>
            Once you decide to volunteer, there are two different ways to contribute to Project NexTech&apos;s mission. 
          </P>
        </ArticleSection>

        <ArticleSection title="Ways to contribute in person" id="in-person">
          <P>
            One of Project NexTech&apos;s primary goals is to expand access to engaging STEM education, particularly for students who may have limited access to similar opportunities. We accomplish much of this by running programs at libraries, schools, and community centers. Student volunteers help set up and teach interactive classes, guiding students through experiments, projects, and challenges in an environment where they can build, innovate, ask questions, and learn by doing. 
          </P>
          <RailCarousel items={CAROUSEL_IN_PERSON} />

          <Highlight>Volunteers lead hands-on activities that make STEM subjects approachable, interactive, and exciting for our students.</Highlight>

          <P>
                Most volunteers begin by assisting a class alongside a more experienced instructor. Most classes have multiple instructors, ensuring that both students and volunteer instructors get more in-person involvement as they learn.
          </P>

          <Highlight>In-person volunteers engage with students and their families, making a positive impact on communities around the world.</Highlight>

          <P>
            Volunteers also prepare materials, set up classrooms, organize supplies, and assist with experiments throughout each program. Beyond our recurring classes, volunteers can represent Project NexTech at community events such as STEM fairs, where they lead short activities for local families, introduce students to new STEM concepts, and connect with prospective participants.
          </P>
        </ArticleSection>

        <ArticleSection title="Ways to contribute online" id="online">
          <P>
            Several Project NexTech departments operate primarily or entirely online, including curriculum, social media, business, communications, outreach, and software. These teams meet and collaborate through Discord and play an essential role in making our programs possible. Online volunteers help design what we teach, organize where we teach it, communicate with the communities we serve, and build the systems that keep the organization running. 
          </P>
          <RailCarousel items={CAROUSEL_ONLINE} />

          <Highlight>Curriculum volunteers design each class to be age-appropriate, practical, and engaging for the students we serve.</Highlight>

          <P>
            Project NexTech&apos;s curricula are created and maintained by our volunteers. Curriculum volunteers collaborate to plan, write, test, and review lessons for the courses taught by our instructors. Our curriculum is regularly reviewed using feedback from completed programs, allowing volunteers to identify what worked, improve activities that did not, and continuously refine each course for future students.
          </P>

          <P>
            Volunteers can also teach selected programs online in regions where Project NexTech does not yet have an in-person presence. These classes are taught through video calls and give volunteers the opportunity to teach subjects particularly well suited to an online format, such as programming.
          </P>

          <Highlight>Outreach volunteers maintain ongoing relationships with their communities in order to make Project NexTech&apos;s classes known to nearby students.</Highlight>

          <P>
            A team of volunteers builds and maintains the technology that Project NexTech relies on, including this website, volunteer databases, internal tools, and other software used throughout the organization. These volunteers apply and expand their programming and technical skills while building systems that support Project NexTech&apos;s day-to-day operations and continued growth.
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
