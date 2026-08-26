import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

import Link from 'next/link'

import { NAV_FOOTER, NAV_PRIMARY, ORG } from '@/constants'
import SiteProvider from '@/context/SiteProvider'
import ThemeScript from './ThemeScript'
import './globals.css'
import s from './layout.module.css'

/**
 * Fonts.
 *
 * The prototype imported three `@fontsource-variable/*` packages in main.jsx.
 * `next/font/google` replaces them and keeps the property that mattered: the
 * files are downloaded at BUILD time and served from this origin, so a visitor
 * never makes a request to Google. It also adds automatic preloading and
 * eliminates the layout shift the Fontsource import allowed.
 *
 * Each face is exposed as a CSS variable that globals.css folds into the
 * --font-sans / --font-display / --font-mono stacks, so nothing downstream
 * knows the loader changed.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-src',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display-src',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-src',
  display: 'swap',
})

const DESCRIPTION =
  'Project NexTech is a student-led nonprofit providing free, hands-on STEM education to students around the world.'

export const metadata: Metadata = {
  /* Required for openGraph.images and any other absolute URL Next has to
     build. Without it those resolve relative and link previews break. */
  metadataBase: new URL(`https://${ORG.domain}`),
  title: {
    default: ORG.name,
    /* Page files export a plain string; this wraps it. */
    template: `%s · ${ORG.name}`,
  },
  description: DESCRIPTION,
  applicationName: ORG.name,
  openGraph: {
    type: 'website',
    siteName: ORG.name,
    title: ORG.name,
    description: DESCRIPTION,
    url: '/',
    /* OPEN ITEM (LAUNCH_READINESS.md — "Social preview image"): drop a
       1200x630 PNG at public/media/shared/og/og-default.png and this resolves.
       Until then link previews fall back to text only. */
    images: [{ url: '/media/shared/og/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: ORG.name,
    description: DESCRIPTION,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  /* Follows whichever theme is actually showing, so mobile browser chrome
     matches the page instead of always painting dark. */
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0e10' },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
      /* The theme script writes data-theme here before React hydrates, so the
         server-rendered <html> and the client's differ by design. */
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <SiteProvider>
          <div className={s.shell}>
            {/* PHASE 3 replaces this with NewsBar + Navbar + Footer. */}
            <TemporaryChrome />

            <main className={s.main}>{children}</main>
          </div>
        </SiteProvider>
      </body>
    </html>
  )
}

/**
 * TEMPORARY — Phase 1 only.
 *
 * The real Navbar, NewsBar, and Footer are Phase 3 (they depend on primitives
 * that do not exist yet). This exists so every route is reachable and the
 * routing work can actually be verified. Delete it, and `layout.module.css`'s
 * `.tempNav` block, when Navbar lands.
 */
function TemporaryChrome() {
  const links = [
    { label: 'Home', to: '/' },
    ...NAV_PRIMARY,
    { label: 'Dashboard', to: '/dashboard' },
    ...NAV_FOOTER,
  ].filter((item): item is { label: string; to: string } => Boolean(item.to))

  return (
    <nav className={s.tempNav} aria-label="Temporary navigation (Phase 1)">
      {links.map((item) => (
        <Link key={item.to} href={item.to} className={s.tempNavLink}>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
