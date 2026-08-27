import type { Metadata } from 'next'

import Article, {
  ArticleMeta,
  ArticleSection,
  Figure,
  Highlight,
  Note,
  P,
  RailCarousel,
} from '@/components/article/Article'
import PageHeader from '@/components/ui/PageHeader'
import s from './page.module.css'

/**
 * TEMPORARY review surface for the Phase 3 article layout.
 *
 * Deliberately adversarial, because the rail is the most fragile layout in the
 * codebase and the failure modes are all geometric:
 *
 *  - a TALL rail figure (1:1) anchored beside a SHORT paragraph run, which is
 *    the case that gaps the prose if the rail cell is not zero-height;
 *  - two rail items anchored close together, which overlap unless
 *    useRailLayout pushes the second one down;
 *  - a TRAILING rail item at the end of a section, which spills into the next
 *    section unless the grid's minHeight is set;
 *  - highlights spanning a section boundary, to prove the orange/blue
 *    alternation is continuous rather than restarting per section;
 *  - a fullWidth article, which must drop the rail entirely.
 *
 * Test at 1023px, 1024px, and 1440px. DELETE THIS ROUTE at the end of Phase 4.
 */
export const metadata: Metadata = {
  title: 'Article (dev)',
  robots: { index: false, follow: false },
}

const CAROUSEL = [
  { src: '/media/about/history/history-01.png', caption: 'Placeholder caption one.' },
  { src: '/media/about/history/history-02.png', caption: 'Placeholder caption two.' },
]

export default function ArticleDevPage() {
  return (
    <div className={s.page}>
      <PageHeader
        title="Article"
        subtitle="Placeholder article formatting, built to stress the rail layout."
      />

      <Article>
        <ArticleMeta
          authors={['Placeholder Author', 'Second Placeholder']}
          date="August 26, 2026"
          links={[{ url: 'https://projectnextech.org', label: 'Placeholder source' }]}
        />

        <ArticleSection title="Tall rail beside short prose" id="tall">
          <P>
            This is a placeholder paragraph. It is deliberately short, so the rail figure
            beside it is much taller than the prose it anchors to.
          </P>
          <Figure
            src="/media/about/history/history-01.png"
            ratio="1:1"
            heading="A tall placeholder figure"
            caption="This placeholder caption exists to make the rail item taller still, so that any tendency of the grid to size its row from the rail shows up immediately as a gap in the prose to the left."
          />
          <P>
            This is a second placeholder paragraph, following the figure. If the rail cell
            were not collapsed to zero height, a gap would open above this line.
          </P>
          <P>
            This is a third placeholder paragraph, so the prose column has enough height to
            make the comparison legible at desktop widths.
          </P>
        </ArticleSection>

        <ArticleSection title="Two rail items close together" id="crowded">
          <P>
            This is a placeholder paragraph anchoring the first of two rail items that sit
            very close together.
          </P>
          <Note title="Placeholder note">
            A placeholder sidenote. Rail items anchored close together would overlap without
            the layout pass that pushes each one below the previous.
          </Note>
          <P>This is a very short placeholder line.</P>
          <Figure
            src="/media/about/history/history-02.png"
            ratio="4:3"
            caption="A placeholder figure anchored immediately after the note above."
          />
          <P>
            This is a placeholder paragraph closing the section, present so the section has
            somewhere to end.
          </P>
          <Highlight cite="Placeholder attribution">
            A placeholder highlight, which should render in orange as the first of the
            article.
          </Highlight>
        </ArticleSection>

        <ArticleSection title="Trailing rail item" id="trailing">
          <P>
            This is a placeholder paragraph. The rail carousel below is the last thing in
            this section, and must not spill into the section that follows.
          </P>
          <RailCarousel items={CAROUSEL} />
          <Highlight>
            A second placeholder highlight, which should render in blue — the alternation
            continues across section boundaries rather than restarting.
          </Highlight>
        </ArticleSection>

        <ArticleSection title="After the trailing item" id="after">
          <P>
            This is a placeholder paragraph in the following section. If it has been pushed
            sideways or overlapped by the carousel above, the grid minHeight is wrong.
          </P>
          <Highlight>
            A third placeholder highlight, which should return to orange.
          </Highlight>
        </ArticleSection>
      </Article>

      <hr className={s.rule} />

      <h2 className={s.fullWidthLabel}>fullWidth: the rail is dropped entirely</h2>

      <Article fullWidth>
        <ArticleSection title="Full-width section" id="full">
          <P>
            This is a placeholder paragraph in a full-width article. The brief specifies the
            left column encompasses the full width here, so the prose is deliberately not
            capped to a narrower reading measure.
          </P>
          <Figure
            src="/media/about/history/history-01.png"
            caption="This placeholder figure must NOT render — the full-width variant hides the rail."
          />
          <P>
            This is a second placeholder paragraph. The figure above should be invisible, and
            no empty column should be reserved for it.
          </P>
        </ArticleSection>
      </Article>
    </div>
  )
}
