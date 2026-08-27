import type { Metadata } from 'next'

import HomeCtas from '@/components/home/HomeCtas'
import RotatingTagline from '@/components/home/RotatingTagline'
import BigNumber from '@/components/ui/BigNumber'
import Carousel from '@/components/ui/Carousel'
import Reveal from '@/components/ui/Reveal'
import Wordmark from '@/components/ui/Wordmark'
import { BIG_NUMBERS } from '@/constants'
import s from './page.module.css'

export const metadata: Metadata = {
  description:
    'Project NexTech is a student-led nonprofit providing free, hands-on STEM education to students around the world.',
}

/**
 * Captions live here rather than in filenames so they can be edited without
 * renaming media. Drop files into public/media/home/carousel/ to fill these.
 */
const CAROUSEL = [
  'A placeholder caption for a photo from one of our library programs.',
  'A placeholder caption showing students building during a maker space workshop.',
  'A placeholder caption from a robotics mentoring session.',
  'A placeholder caption showing volunteers preparing materials before a class.',
  'A placeholder caption from a programming course in progress.',
  'A placeholder caption showing a student presenting a science fair project.',
  'A placeholder caption from a physics demonstration.',
  'A placeholder caption showing an international program run online.',
  'A placeholder caption from a natural sciences experiment.',
  'A placeholder caption showing our volunteers at a community event.',
  'A placeholder caption from a partner-hosted program.',
  'A placeholder caption showing students at the end of a course.',
].map((caption, index) => ({
  src: `/media/home/carousel/home-carousel-${String(index + 1).padStart(2, '0')}.png`,
  caption,
}))

const HOME_NUMBERS = BIG_NUMBERS.filter((number) => number.onHome)

export default function HomePage() {
  return (
    <div className={s.root}>
      <section>
        <RotatingTagline />
        <p className={s.lede}>
          <Wordmark className={s.wordmark} /> is a student-led nonprofit organization
        </p>
      </section>

      <Reveal as="section" className={s.carousel}>
        <Carousel items={CAROUSEL} ratio="16:9" />
      </Reveal>

      <Reveal as="section">
        <HomeCtas />
      </Reveal>

      <section>
        <ul className={s.numbers}>
          {HOME_NUMBERS.map((number, index) => (
            /* Staggered so the row assembles left to right. */
            <Reveal as="li" key={number.key} delay={index * 70}>
              <BigNumber number={number} index={index} />
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  )
}
