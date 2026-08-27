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
 * The hero carousel.
 *
 * COUNT IS THE CONFIGURATION. There are eight photos in
 * public/media/home/carousel/ today, all 16:9, carried over from the live
 * site. Drop `home-carousel-09.png` into that folder, change this 8 to a 9,
 * and it appears — no other edit anywhere.
 *
 * NO CAPTIONS, deliberately. These are real photographs of real programs and
 * nobody has recorded what each one shows; a written-in caption would be a
 * guess presented as fact. Carousel omits the caption block entirely when
 * there is nothing to show, so the frames read clean until PNT supplies real
 * ones (tracked in LAUNCH_READINESS.md). Add them as a `caption` here.
 */
const CAROUSEL_COUNT = 8

const CAROUSEL = Array.from({ length: CAROUSEL_COUNT }, (_, index) => ({
  src: `/media/home/carousel/home-carousel-${String(index + 1).padStart(2, '0')}.png`,
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
