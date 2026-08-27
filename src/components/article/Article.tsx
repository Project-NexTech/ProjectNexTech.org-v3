import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'

import { cx } from '@/lib/cx'
import Carousel, { type CarouselItem } from '@/components/ui/Carousel'
import ImagePlaceholder, { type ImageRatio } from '@/components/ui/ImagePlaceholder'
import RailLayout from './RailLayout'
import s from './Article.module.css'

/**
 * ARTICLE FORMATTING
 * ==================
 * The layout the brief calls "article formatting": a wide left column of prose
 * with a narrow right rail holding images and notes, where each rail item sits
 * at the vertical position of the text it was authored next to.
 *
 * AUTHORING
 * ---------
 *   <Article>
 *     <ArticleSection title="History">
 *       <P>First paragraph…</P>
 *       <Figure src="/media/about/history/history-01.png" caption="…" />
 *       <P>Second paragraph…</P>
 *       <Highlight>A pulled quote.</Highlight>
 *     </ArticleSection>
 *   </Article>
 *
 * Body blocks (<P>, <Highlight>, anything else) flow down the left column.
 * Rail blocks (<Figure>, <Note>, <RailCarousel>) carry a static `.rail = true`
 * and jump to the right column, anchored to the top of the run of body blocks
 * they follow. ANY NEW RAIL BLOCK MUST SET `.rail = true`.
 *
 * HOW THE ANCHORING WORKS
 * -----------------------
 * Children are partitioned into groups — "some body blocks plus the one rail
 * block that followed them" — and each group becomes a grid row.
 *
 * Three non-obvious properties hold this together. All three are on the "must
 * not regress" list; do not simplify any of them away.
 *
 *   1. At >=lg the rail cell is zero-height and its contents are absolutely
 *      positioned. Letting the grid size that row makes a tall image stretch
 *      it and punch a gap into the prose.
 *   2. RailLayout measures after paint and pushes each rail item down far
 *      enough to clear the previous one, then sets a minHeight on the grid so
 *      a trailing rail item cannot spill into the next section.
 *   3. The grid is `align-content: start`. Without it, that minHeight is
 *      distributed across the auto-sized rows and gaps the prose — the exact
 *      bug it was added to fix.
 *
 * Below lg everything collapses to one column and rail blocks render inline in
 * authoring order — the weave the brief asks for on mobile.
 */

/* ------------------------------------------------------------- body blocks */

export function P({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={cx(s.paragraph, className)}>{children}</p>
}

/**
 * Centered pull quote or statistic inside the prose column.
 *
 * `tone` is injected automatically by ArticleSection, which alternates
 * orange/blue down the article — authors never set it by hand, so inserting or
 * removing a highlight cannot leave the sequence wrong.
 */
export interface HighlightProps {
  children: ReactNode
  cite?: string
  tone?: 'accent' | 'alt'
  className?: string
}

export function Highlight({ children, cite, tone = 'accent', className = '' }: HighlightProps) {
  return (
    <figure className={cx(s.highlight, className)}>
      <blockquote className={cx(s.highlightQuote, tone === 'alt' ? s.toneAlt : s.toneAccent)}>
        {children}
      </blockquote>
      {cite && <figcaption className={s.highlightCite}>{cite}</figcaption>}
    </figure>
  )
}
/* Static marker the partitioner looks for. Survives a CSS change; does NOT
   survive a careless refactor. */
Highlight.isHighlight = true

/* ------------------------------------------------------------- rail blocks */

export interface FigureProps {
  src?: string
  caption?: string
  heading?: string
  alt?: string
  ratio?: ImageRatio
}

export function Figure({ src, caption, heading, alt, ratio = '4:3' }: FigureProps) {
  return (
    <figure>
      <ImagePlaceholder src={src} alt={alt ?? caption ?? ''} ratio={ratio} />
      {(heading || caption) && (
        <figcaption className={s.figcaption}>
          {heading && <span className={s.figureHeading}>{heading}</span>}
          {caption && <span className={s.figureCaption}>{caption}</span>}
        </figcaption>
      )}
    </figure>
  )
}
Figure.rail = true

/** A carousel that lives in the rail rather than the prose column. */
export function RailCarousel({
  items,
  ratio = '4:3',
  showCaptions = true,
}: {
  items: readonly CarouselItem[]
  ratio?: ImageRatio
  showCaptions?: boolean
}) {
  return <Carousel items={items} ratio={ratio} showCaptions={showCaptions} />
}
RailCarousel.rail = true

/**
 * Sidenote block. Accepts arbitrary children because the Impact page uses this
 * slot for its list of quarterly report PDFs.
 */
export function Note({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className={s.note}>
      {title && <p className={s.noteTitle}>{title}</p>}
      <div className={s.noteBody}>{children}</div>
    </aside>
  )
}
Note.rail = true

/* ----------------------------------------------------------------- section */

type MarkedComponent = { isHighlight?: boolean; rail?: boolean }

function isHighlight(child: ReactNode): child is ReactElement<HighlightProps> {
  return isValidElement(child) && (child.type as MarkedComponent)?.isHighlight === true
}

function isRail(child: ReactNode): boolean {
  return isValidElement(child) && (child.type as MarkedComponent)?.rail === true
}

/** Highlights a section contains, so <Article> can offset the next section. */
function countHighlights(children: ReactNode): number {
  return Children.toArray(children).filter(isHighlight).length
}

interface Group {
  body: ReactNode[]
  rail: ReactNode | null
}

function partition(children: ReactNode, highlightOffset: number): Group[] {
  const groups: Group[] = []
  let body: ReactNode[] = []
  let highlightIndex = highlightOffset

  for (const child of Children.toArray(children)) {
    if (isRail(child)) {
      groups.push({ body, rail: child })
      body = []
      continue
    }

    if (isHighlight(child)) {
      body.push(cloneElement(child, { tone: highlightIndex % 2 === 0 ? 'accent' : 'alt' }))
      highlightIndex += 1
      continue
    }

    body.push(child)
  }

  if (body.length > 0) groups.push({ body, rail: null })

  return groups
}

export interface ArticleSectionProps {
  title?: string
  id?: string
  children: ReactNode
  /** Injected by <Article>. Never set this by hand. */
  highlightOffset?: number
  className?: string
}

/**
 * `highlightOffset` is injected by <Article>; it is the number of highlights in
 * all preceding sections, so the orange/blue alternation continues across
 * section boundaries instead of restarting at each heading.
 */
export function ArticleSection({
  title,
  id,
  children,
  highlightOffset = 0,
  className = '',
}: ArticleSectionProps) {
  const groups = partition(children, highlightOffset)

  return (
    <section id={id} className={className}>
      {title && <h2 className={s.sectionTitle}>{title}</h2>}

      {/* `article-grid` is GLOBAL — the .article--full override in globals.css
          matches it as a descendant, so it cannot be module-scoped.
          RailLayout supplies the container element and measures its rails. */}
      <RailLayout className={cx('article-grid', s.grid)}>
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className={s.contents}>
            <div className={s.body}>{group.body}</div>

            {group.rail ? (
              /* Below lg the rail weaves inline, where a full-bleed image reads
                 badly — so it stays capped near the rail's desktop measure and
                 centered in the column. `article-rail` is global for the same
                 reason as `article-grid`. */
              <div className={cx('article-rail', s.rail)}>
                {/* data-rail-item is the contract with RailLayout, which
                    finds these by DOM query rather than by ref. */}
                <div data-rail-item className={s.railInner}>
                  {group.rail}
                </div>
              </div>
            ) : (
              <div className={s.railSpacer} aria-hidden="true" />
            )}
          </div>
        ))}
      </RailLayout>
    </section>
  )
}

/* --------------------------------------------------- enhanced article meta */

/**
 * The byline block for "enhanced article formatting" — authors, date, and
 * external links, sitting under the subtitle and above the two-column layout.
 */
export function ArticleMeta({
  authors = [],
  date,
  links = [],
}: {
  authors?: readonly string[]
  date?: string
  links?: readonly { url: string; label: string }[]
}) {
  return (
    <div className={s.meta}>
      {authors.length > 0 && (
        <span>
          <span className={s.metaFaint}>By </span>
          {authors.join(', ')}
        </span>
      )}
      {date && <span className={s.metaFaint}>{date}</span>}
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="link-external">
          {link.label}
        </a>
      ))}
    </div>
  )
}

/* ----------------------------------------------------------------- article */

/**
 * `fullWidth` drops the rail entirely — used by Terms, which the brief
 * specifies as enhanced article formatting where the left column "encompasses
 * the full width". The prose is deliberately NOT capped to a narrower reading
 * measure here, per that instruction. The override lives in globals.css so
 * nested sections pick it up without a prop or a context.
 */
export default function Article({
  children,
  fullWidth = false,
  className = '',
}: {
  children: ReactNode
  fullWidth?: boolean
  className?: string
}) {
  /* Walk the sections in order, handing each the running highlight count so
     the orange/blue alternation is continuous across the whole article rather
     than resetting per section. Non-section children (ArticleMeta) pass
     through untouched.

     Written as a reduce carrying the count rather than a mutating counter —
     `react-hooks/immutability` rejects reassigning a captured variable inside
     a callback. */
  const { sections } = Children.toArray(children).reduce<{
    count: number
    sections: ReactNode[]
  }>(
    (accumulated, child) => {
      if (!isValidElement(child) || child.type !== ArticleSection) {
        return { ...accumulated, sections: [...accumulated.sections, child] }
      }

      const section = child as ReactElement<ArticleSectionProps>

      return {
        count: accumulated.count + countHighlights(section.props.children),
        sections: [
          ...accumulated.sections,
          cloneElement(section, { highlightOffset: accumulated.count }),
        ],
      }
    },
    { count: 0, sections: [] },
  )

  return (
    <div className={cx(s.article, fullWidth && 'article--full', className)}>{sections}</div>
  )
}
