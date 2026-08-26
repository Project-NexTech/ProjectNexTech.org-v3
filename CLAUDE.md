@AGENTS.md

## Project NexTech — read before working in this repo

This repo is the production rebuild of **projectnextech.org**. It starts as a
bare `create-next-app` scaffold; the site itself does not exist here yet.

**Start with `NEXTJS_MIGRATION.md`.** It is the plan of record: how the
finished prototype in `../pnt-site-v3-model/` becomes this site, in phases with
verification gates.

Key decisions already made, so they are not re-litigated:

- **Next.js 16 App Router, TypeScript.** Not Next 15 — see `NEXTJS_MIGRATION.md`
  §2.0 for the breaking changes that matter here (Proxy replaces Middleware,
  async request APIs, `next/dynamic` + `ssr: false` restrictions, Turbopack).
- **Plain CSS Modules. No Tailwind, no MUI, no CSS-in-JS.**
- **Postgres**, replacing the Google Sheets the current site depends on.
- **Frontend and backend are separate services** with an HTTP contract. This
  repo is the FRONTEND: it must never import a database driver, never hold
  `DATABASE_URL`, and never contain SQL. The API lives in its own repo and
  owns the schema, migrations, and every query. See `NEXTJS_MIGRATION.md` §1.5
  for the boundary rules and Part D for how the two are kept in step.
- **Self-hosted on a VPS** (Coolify or manual) — *not* a static export, *not*
  GitHub Pages. `output: "export"` must never be set.

Companion documents:

- `initial_prompt_v1.md` — the authoritative design/content spec. Wins on
  anything visual.
- `LAUNCH_READINESS.md` — content and backend items blocking launch.
- `../pnt-site-v3-model/CLAUDE.md` — the prototype's architecture notes. The
  source of the "must not regress" list; it describes a Vite/Tailwind build, so
  read it as a reference implementation rather than as instructions for here.

## Phase status

The migration runs in phases with a verification gate at each one. **Stop at
the end of each phase and wait for approval before starting the next.**

Note the phase table below is *not* identical to `NEXTJS_MIGRATION.md` §7.
That plan assumed Tailwind would be installed here, used through the routing
work, and removed afterwards. PNT chose instead to **never install Tailwind**
and convert each file once — routing change and CSS Modules conversion in the
same edit. Phases 2-4 are therefore §3.7's bottom-up conversion order, and
there is no "remove Tailwind" step because there is nothing to remove.

| Phase | Scope | Status |
|---|---|---|
| 1 | Foundation — tokens, Preflight replacement, breakpoints, fonts, constants/context/data in TS, `public/`, root layout, 13 routes, `/discord` | ✅ **Complete** |
| 2 | Primitives → `.tsx` + CSS Modules (Card, Button, Tag, Icon, SectionHeader, PageHeader, Wordmark, ImagePlaceholder, BigNumber, CountUp, Reveal, Carousel, ProtectedEmail) | ⬜ Not started |
| 3 | Layout chrome (Navbar, Footer, NewsBar, ContactPopup, ThemeToggle) + `Article.tsx` | ⬜ Not started |
| 4 | Feature components + all 13 pages | ⬜ Not started |
| C | Real content pass — the 177 images and the real roster from `../ProjectNexTech.org-new/` | ⬜ Not started |

Phases 5-8 of `NEXTJS_MIGRATION.md` (Postgres, the API repo, auth, VPS) are
out of scope until the frontend is done.

## Decisions taken during the build

These were open in `NEXTJS_MIGRATION.md` and are now closed. Don't re-litigate.

- **No Tailwind, ever.** Each file is ported once. §3.2's Preflight replacement
  therefore had to land in `globals.css` *first*, before any component — it is
  the reset the prototype's markup silently depends on.
- **TypeScript from the start.** Files land as `.tsx`/`.ts` as they are ported;
  `allowJs` stays on only because the scaffold set it.
- **Real content is its own phase**, after the port. Porting with placeholders
  keeps a structural diff against the prototype readable.
- **Fonts come from `next/font/google`**, not Fontsource. The prototype's
  `node_modules` is absent so the `.woff2` files were unavailable to copy.
  Same privacy property: files are fetched at *build* time and served from this
  origin, so no visitor ever hits Google.

## Phase 1 notes

Delivered: `globals.css` (tokens verbatim from the prototype, plus the
Preflight replacement and `@custom-media` breakpoints), `next.config.ts` with
the `/discord` 308, `postcss.config.mjs`, the DB-driver import ban in
`eslint.config.mjs`, `constants/` + `context/` + `data/` ported to TypeScript,
all of `public/` (87 media folders, cursors, documents, CSV, robots.txt), the
root layout with fonts and metadata, the no-flash theme script, and 12 routes
plus a 404.

**Four things here are load-bearing and easy to break:**

1. **`src/lib/theme.ts` must never gain a `'use client'` directive.** Every
   export of a `'use client'` module becomes an opaque *client reference* in
   the server graph. When `THEME_STORAGE_KEY` lived in `themeStore.ts`, the
   Server Component `ThemeScript` inlined `localStorage.getItem(undefined)`
   into every page — no type error, no build error, and a no-flash script that
   silently did nothing. Constants both sides read live in a neutral module.

2. **The theme is an external store, not React state.** `themeStore.ts` +
   `useSyncExternalStore`. The prototype read `localStorage` and `matchMedia`
   at module scope, which crashes prerender (§2.5); the obvious repair —
   `useState` plus a mount effect calling `setTheme` — is rejected by
   `react-hooks/set-state-in-effect`, which *is* enabled here via
   `eslint-config-next`. The store avoids both. There is deliberately **no
   effect syncing `data-theme` onto `<html>`**: the blocking script already set
   it correctly before first paint, so the attribute is written only where it
   actually changes, in `setThemePreference`.

3. **`@custom-media` is resolved by `postcss-custom-media`, not by the
   browser.** VS Code's built-in CSS server flags `@custom-media` as an unknown
   at-rule; that warning is wrong and can be ignored. Verify the real thing by
   grepping the built CSS for `min-width:1024px`.

4. **`eslint.config.mjs` uses the modern flat imports** (`defineConfig`,
   `eslint-config-next/core-web-vitals`). Rewriting it to the older
   `FlatCompat` + `@eslint/eslintrc` pattern — which is what most training data
   and tutorials show — makes ESLint die with `TypeError: Converting circular
   structure to JSON` before it lints anything. This is exactly the trap
   `AGENTS.md` warns about.

**Temporary, delete when superseded:** `<TemporaryChrome>` and `.tempNav` in
`src/app/layout.{tsx,module.css}` (Phase 3, when Navbar lands), and
`src/components/dev/PagePlaceholder.*` (Phase 4, when the last page is ported).

**Verified at the Phase 1 gate:** `tsc --noEmit` clean · `eslint` clean ·
`next build` clean, 13 routes prerendered · all 12 routes + a 404 serve 200/404
with correct per-route titles · `/discord` returns 308 to `discord.gg/6yHhgpC`
· `/dashboard` carries `noindex, nofollow` · fonts self-hosted as 17 local
`.woff2` with zero `googleapis`/`gstatic` references in the HTML ·
`@custom-media` resolved to literal pixel values in the built CSS ·
`robots.txt`, cursors, favicon, `programs.csv`, and `/media/logo.png` all serve.
