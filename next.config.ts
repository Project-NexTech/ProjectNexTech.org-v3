import type { NextConfig } from 'next'

/**
 * NOTE: `output: "export"` must never be set here. The site is self-hosted on a
 * VPS running a real Node server (NEXTJS_MIGRATION.md §1.1); a static export
 * would remove Server Components, Route Handlers, sessions, and `next/image`
 * optimization. For Docker, set `output: "standalone"` instead (Appendix A.2).
 */
const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        /* projectnextech.org/discord is advertised on the Volunteer page and in
           print. A real 308 beats the model's client-side <ExternalRedirect>:
           no blank frame while React boots, and link previews resolve. */
        source: '/discord',
        destination: 'https://discord.gg/6yHhgpC',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
