'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'

const RAIL_GAP = 32

/**
 * WARNING: This must stay equal to --lg in src/app/breakpoints.css. The rail
 * layout is driven from JS at exactly the width where the CSS switches to two
 * columns; if the two drift, the rail silently breaks.
 */
const DESKTOP_QUERY = '(min-width: 1024px)'

/**
 * useLayoutEffect warns when React renders on the server, and this is a Client
 * Component that is still server-rendered for the initial HTML. The layout
 * genuinely has to run before paint on the client, so the fix is to pick the
 * right hook per environment rather than downgrade to useEffect everywhere.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * The client half of the article grid: everything that has to measure the DOM.
 *
 * WHY THIS IS A SEPARATE FILE FROM Article.tsx:
 * `<ArticleSection>` decides which children belong in the rail by reading a
 * static `.rail === true` off each child's component. Every export of a
 * 'use client' module becomes an opaque CLIENT REFERENCE in the server graph,
 * and a reference carries no static properties — so when Article.tsx itself
 * carried the directive, `Figure.rail` read as `undefined` on every
 * Server-Component page, every rail block silently fell into the prose column,
 * and the highlight alternation never fired. Article.tsx therefore has NO
 * directive, and the client boundary is drawn here instead, around the only
 * part that actually needs the browser.
 *
 * Rail items are found by DOM query rather than by a ref array, because this
 * component never sees them as React children — they arrive already rendered.
 * `[data-rail-item]` is the contract with ArticleSection.
 */
export default function RailLayout({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  const layout = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const rails = [...container.querySelectorAll<HTMLElement>('[data-rail-item]')]

    if (!window.matchMedia(DESKTOP_QUERY).matches) {
      for (const rail of rails) rail.style.transform = ''
      container.style.minHeight = ''
      return
    }

    let previousBottom = -Infinity
    let lowest = 0

    for (const rail of rails) {
      /* The rail cell is a zero-height grid item, so its offsetTop is the top
         of the row it anchors to. The grid container is `position: relative`,
         making it the offsetParent, so every measurement shares one coordinate
         space.

         WARNING: do not introduce a `transform` on any ancestor of the grid —
         a transformed element becomes the offsetParent and corrupts these
         measurements. This is also why <Reveal> is deliberately never applied
         inside an ArticleSection. */
      const anchorTop = rail.parentElement!.offsetTop
      const top = Math.max(anchorTop, previousBottom + RAIL_GAP)

      rail.style.transform = top === anchorTop ? '' : `translateY(${top - anchorTop}px)`

      previousBottom = top + rail.offsetHeight
      lowest = Math.max(lowest, previousBottom)
    }

    // Stop a trailing rail item from spilling into whatever follows.
    container.style.minHeight = lowest ? `${lowest}px` : ''
  }, [])

  useIsomorphicLayoutEffect(() => {
    layout()

    const container = containerRef.current
    if (!container) return undefined

    // Prose reflow, image loads, and font swaps all change the geometry.
    const observer = new ResizeObserver(layout)
    observer.observe(container)
    for (const rail of container.querySelectorAll<HTMLElement>('[data-rail-item]')) {
      observer.observe(rail)
    }

    const media = window.matchMedia(DESKTOP_QUERY)
    media.addEventListener('change', layout)

    return () => {
      observer.disconnect()
      media.removeEventListener('change', layout)
    }
  }, [layout])

  useEffect(() => {
    // Late webfont application shifts prose height after observers are wired.
    document.fonts?.ready?.then(layout).catch(() => {})
  }, [layout])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
