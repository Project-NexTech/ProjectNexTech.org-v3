import type { NextConfig } from 'next'

/**
 * NOTE: `output: "export"` must never be set for the REAL site. It is
 * self-hosted on a VPS running a real Node server (NEXTJS_MIGRATION.md §1.1);
 * a static export would remove Server Components, Route Handlers, sessions,
 * and `next/image` optimization. For Docker, set `output: "standalone"`
 * instead (Appendix A.2).
 *
 * ---------------------------------------------------------------------------
 * TEMPORARY — GitHub Pages demo. Remove this whole mechanism before the VPS.
 * Full revert checklist: GITHUB_PAGES_DEMO.md
 * ---------------------------------------------------------------------------
 *
 * The frontend has no backend yet, so PNT is parking the demo on GitHub Pages
 * until the API repo exists. That needs a static export, which the paragraph
 * above forbids — so it is gated behind an env var that ONLY the Pages
 * workflow sets, rather than switched on in the file.
 *
 * The distinction matters. Hard-coding `output: "export"` would silently
 * change what `npm run dev`, `npm run build`, and the eventual VPS build
 * produce, and the rule above would be false while looking true. Gated, every
 * build anyone runs by hand is byte-for-byte what it is today, and the export
 * exists only inside CI where the flag is set. Deleting the flag deletes the
 * demo.
 */
const STATIC_DEMO = process.env.PNT_STATIC_EXPORT === '1'

/** TEMPORARY (Pages demo). Applied only when PNT_STATIC_EXPORT=1. */
const STATIC_DEMO_CONFIG = {
  output: 'export',

  /* Emits `out/about/index.html` rather than `out/about.html`. GitHub Pages
     resolves directory indexes reliably; its extensionless-to-.html fallback
     is the less predictable path, and `/about/` would 404 without this. */
  trailingSlash: true,

  /* Nothing imports `next/image` today (Phases 2-4 chose plain <img> — see
     CLAUDE.md), so this changes nothing right now. It is here so that if
     someone reaches for `next/image` during the demo period the export keeps
     working instead of failing with an error about a missing loader. */
  images: { unoptimized: true },

  /* NO `basePath`. The demo is served from the root of its own host,
     beta.projectnextech.org, via the CNAME the post-build step writes. If this
     ever moves to a project page (project-nextech.github.io/<repo>/) then
     basePath AND assetPrefix both have to be set to '/<repo>' or every asset
     404s. */
} satisfies NextConfig

/** The real configuration. This is what ships to the VPS. */
const SERVER_CONFIG = {
  async redirects() {
    return [
      {
        /* projectnextech.org/discord is advertised on the Volunteer page and in
           print. A real 308 beats the model's client-side <ExternalRedirect>:
           no blank frame while React boots, and link previews resolve.

           TEMPORARY (Pages demo): `redirects()` does not run in a static
           export — there is no server to run it. The Pages build drops this
           branch and `scripts/gh-pages/postbuild.mjs` writes an equivalent
           meta-refresh page to `out/discord/index.html` instead. That is a
           strictly worse redirect (a paint, then a hop) and is one of the
           reasons the demo is temporary. */
        source: '/discord',
        destination: 'https://discord.gg/6yHhgpC',
        permanent: true,
      },
    ]
  },
} satisfies NextConfig

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  ...(STATIC_DEMO ? STATIC_DEMO_CONFIG : SERVER_CONFIG),
}

export default nextConfig
