'use client'

/**
 * Last-resort error UI, shown when the ROOT LAYOUT itself throws. A normal
 * page error is caught by an `error.tsx` boundary further down the tree; this
 * only appears when the shell is broken.
 *
 * Three constraints come from the framework, not from choice:
 *
 *  1. It must render its own <html> and <body> — it REPLACES the root layout.
 *  2. It must be a Client Component, so it cannot export `metadata`. The page
 *     title is set with React's <title> element instead.
 *  3. It does NOT receive globals.css, so no design token is available here.
 *     Everything is inlined, and the palette is duplicated from globals.css by
 *     necessity. Keep the two roughly in step, but do not add tokens here
 *     expecting them to resolve — they will not.
 *
 * Because the stylesheet is absent, the theme's `data-theme` attribute cannot
 * reach this page either. It follows the OS color scheme instead.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          background: '#0d0e10',
          color: '#dfe2e6',
          colorScheme: 'dark',
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
          lineHeight: 1.5,
        }}
      >
        <title>Something went wrong · Project NexTech</title>

        <main style={{ maxWidth: '32rem' }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'ui-monospace, monospace',
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#f24c02',
            }}
          >
            Error
          </p>

          <h1
            style={{
              margin: '0.5rem 0 0',
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#f4f5f6',
            }}
          >
            Something went wrong
          </h1>

          <p style={{ margin: '0.75rem 0 0', color: '#98a0a9' }}>
            The page could not be displayed. Trying again often works; if it does
            not, the site is likely having a problem on our end.
          </p>

          {/* The digest is the only safe handle on the underlying error — the
              message itself is stripped in production builds. Showing it lets
              a visitor quote something actionable in a bug report. */}
          {error.digest && (
            <p
              style={{
                margin: '0.75rem 0 0',
                fontFamily: 'ui-monospace, monospace',
                fontSize: 12,
                color: '#6b737c',
              }}
            >
              Reference: {error.digest}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                font: 'inherit',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                border: '1px solid transparent',
                borderRadius: 2,
                background: '#f24c02',
                color: '#0d0e10',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>

            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                Deliberate: this renders when the ROOT LAYOUT threw, so the
                router is exactly what cannot be trusted. A plain anchor forces
                a full document load and rebuilds the app from scratch, which
                is the whole point of an escape hatch. */}
            <a
              href="/"
              style={{
                font: 'inherit',
                padding: '0.5rem 1rem',
                border: '1px solid #3a3f47',
                borderRadius: 2,
                color: '#f4f5f6',
                textDecoration: 'none',
              }}
            >
              Go home
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
