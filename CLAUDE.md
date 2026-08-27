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

  TEMPORARY EXCEPTION, 2026-08-27: a demo is parked on GitHub Pages until the
  backend exists, which needs exactly the static export this rule forbids. It
  is gated behind an env var only CI sets, so every build run by hand is
  unchanged and this rule still holds for all of them. See
  `GITHUB_PAGES_DEMO.md`, which is a revert checklist. Delete the demo before
  phase 8.

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
| 1 | Foundation — tokens, Preflight replacement, breakpoints, fonts, constants/context/data in TS, `public/`, root layout, 13 routes, `/discord` | Complete |
| 2 | Primitives → `.tsx` + CSS Modules (Card, Button, Tag, Icon, SectionHeader, PageHeader, Wordmark, ImagePlaceholder, BigNumber, CountUp, Reveal, Carousel, ProtectedEmail) | Complete |
| 3 | Layout chrome (Navbar, Footer, NewsBar, ContactPopup, ThemeToggle) + `Article.tsx` | Complete |
| 4 | Feature components + all 13 pages | Complete |
| C | Real content pass — the 177 images and the real roster from `../ProjectNexTech.org-new/` | Complete |

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

3. **`@custom-media` is resolved at build time, not by the browser.** VS
   Code's built-in CSS server flags `@custom-media` as an unknown at-rule;
   that warning is wrong and can be ignored.

   CORRECTION (made in Phase 3): the verification originally recorded here —
   "grep the built CSS for `min-width:1024px`" — was insufficient, and passed
   for the wrong reason. Resolution is PER FILE, and that single match came
   from `globals.css` itself. See the Phase 3 notes. The correct check is
   that nothing unresolved survives the build:

   ```bash
   grep -o "media (--" .next/static/chunks/*.css   # must return nothing
   ```

4. **`eslint.config.mjs` uses the modern flat imports** (`defineConfig`,
   `eslint-config-next/core-web-vitals`). Rewriting it to the older
   `FlatCompat` + `@eslint/eslintrc` pattern — which is what most training data
   and tutorials show — makes ESLint die with `TypeError: Converting circular
   structure to JSON` before it lints anything. This is exactly the trap
   `AGENTS.md` warns about.

**Temporary scaffolding is all gone as of Phase 4:** `<TemporaryChrome>` and
`.tempNav` were removed in Phase 3, `src/components/dev/PagePlaceholder.*` and
`src/app/dev/` in Phase 4. Nothing under `src/` is a stand-in for code any
more; the remaining placeholders are *content* (see Phase C).

**Verified at the Phase 1 gate:** `tsc --noEmit` clean · `eslint` clean ·
`next build` clean, 13 routes prerendered · all 12 routes + a 404 serve 200/404
with correct per-route titles · `/discord` returns 308 to `discord.gg/6yHhgpC`
· `/dashboard` carries `noindex, nofollow` · fonts self-hosted as 17 local
`.woff2` with zero `googleapis`/`gstatic` references in the HTML ·
`@custom-media` resolved to literal pixel values in the built CSS ·
`robots.txt`, cursors, favicon, `programs.csv`, and `/media/logo.png` all serve.

## Running the site locally

**Use `npm run dev` for dev testing.** That is the default for working on the
site — Turbopack dev server, hot reload, no build step.

```bash
npm run dev            # dev testing — use this
```

**Use `npm run build` + `npm start` only when testing a final build** — the
prerender output, the built CSS, production bundles, route counts, anything the
dev server does not represent faithfully. Every phase gate recorded in this file
was verified that way, which is why they all say "next build + next start".

```bash
npm run build          # required first
npm start              # serves what npm run build produced
```

**Never run `npm start` without `npm run build` first.** It builds nothing — it
serves whatever happens to be sitting in `.next`, which is either a stale build
or nothing at all. The stale case is the dangerous one: the site comes up and
looks fine while serving the previous code, so a change you just made appears
not to have applied. The Phase C notes record the same failure arriving by a
different route (`EADDRINUSE`).

Both build commands need **Node 22** on `PATH` — see the next section.

## Temporary: GitHub Pages demo

**Read `GITHUB_PAGES_DEMO.md` before touching `next.config.ts`, the workflow,
or `metadataBase`.** It is written as a revert checklist.

Short version: the frontend finished ahead of the backend, so a demo is served
from GitHub Pages at <https://beta.projectnextech.org> as a static export. Six
files are involved; four are new and delete cleanly, two are edits.

**The export is gated behind `PNT_STATIC_EXPORT`, which only the Pages workflow
sets.** That is the part not to undo. With the flag unset — every local build,
and the VPS — `next.config.ts` produces exactly what it produced before: no
`out/`, the `/discord` 308 intact, `metadataBase` on the production domain.
Setting `output: 'export'` directly in the config instead would make the rule
above quietly false while still reading as true, and would silently discard the
Route Handlers and sessions that phases 5-7 add.

Deploys run on every push to `main`. If `beta.projectnextech.org` does not
resolve yet, PNT still has to add the `beta` CNAME record and switch the repo's
Pages source to GitHub Actions — see that document.

## Toolchain: use Node 22 LTS, not Node 23

**`next build` fails on Node 23.1.0** with:

```
Error occurred prerendering page "/_global-error"
Error [InvariantError]: Invariant: Expected workStore to be initialized.
```

It is not this codebase. A four-line `create-next-app`-shaped app with zero PNT
code reproduces it, and the same tree builds cleanly on **Node 22.13.1**. Next
16.3.3 hits an AsyncLocalStorage invariant prerendering its internal
`/_global-error` route on the Node 23 line. `next dev` is unaffected, which is
what makes it easy to miss until a build.

Node 23 is a non-LTS "Current" release. `NEXTJS_MIGRATION.md` §1.1 says "Node
20.9+ is required" — sharpen that to **an LTS line (20.x or 22.x)**, both
locally and on the VPS, and pin it (`.nvmrc` / the Docker base image) before
phase 8.

To build locally while nvm's default is 23:

```bash
nvm use 22.13.1     # needs an elevated shell on nvm4w
```

## Phase 2 notes

Delivered: all 13 primitives as `.tsx` + `.module.css` — `Icon`, `Reveal`,
`CountUp`, `Wordmark`, `ProtectedEmail`, `Card`, `Tag`, `Button`,
`SectionHeader`, `PageHeader`, `BigNumber`, `ImagePlaceholder`, `Carousel`.
Plus `src/lib/motion.ts`, a global `.sr-only`, and `src/app/global-error.tsx`.

**Client/server split, and why it is not what §2.4 assumed:**

- `'use client'`: `Reveal`, `CountUp`, `Carousel`, `ImagePlaceholder`.
- Everything else has **no directive at all**, which is stronger than marking
  it server. An undirected component compiles into whichever graph imports it.
  `Button` is the case §2.4 called "awkward": it needs `onClick` only when a
  Client Component renders it, and it uses no hooks — so one undirected file
  serves both, and a server page that renders a Button ships zero client JS for
  it. No split, no directive.
- `SectionHeader` and `PageHeader` stay server components that *render*
  `<Reveal>`. The client boundary is Reveal's, not theirs.

**Three things here are load-bearing:**

1. **`ImagePlaceholder` needs the `ref` callback, not just `onError`.** Under
   SSR the `<img>` ships in the server HTML, so a 404 can fire its error event
   *before* React hydrates and attaches `onError` — and the handler never runs.
   The result is a broken-image icon exactly where the brief requires the file
   path. The prototype could not hit this: its `<img>` was created by
   client-side React, so the handler was always attached first. The ref
   callback re-checks `complete && naturalWidth === 0` on commit. Verified: 0
   broken images, 7/7 placeholders showing their path.

2. **`ImagePlaceholder` still uses `<img>`, not `next/image`**, against §2.6.
   Its contract is "render the file if it exists, otherwise show its path", and
   `next/image` treats a missing file as an error rather than a state to
   render. A 404 is the *normal* case while `public/media/` is empty
   scaffolding. Revisit in the content phase. The `no-img-element` lint rule is
   disabled at that one line with this reason.

3. **`prefersReducedMotion()` in `src/lib/motion.ts` is a plain function, not a
   hook**, and is called from `useState` initializers in all three consumers.
   Both the prototype's CLAUDE.md and `react-hooks/set-state-in-effect` reject
   the effect-based spelling. Don't tidy it back.

**Temporary, delete at the end of Phase 4:** the `/dev/primitives` route
(`src/app/dev/`). It renders every variant of every primitive on one page.
Without it nothing imports the primitives and a build proves nothing about
them. The prototype had the same thing at `/components`.

**Verified at the Phase 2 gate** (Node 22, `next build` + `next start`, driven
in a real browser): `tsc --noEmit` clean, `eslint` clean, 16/16 routes
prerendered. No hydration warnings — the only console errors are the seven
expected media 404s, and the only warnings are Next's own CSS-chunk preloads.
`Reveal` fires on all 9 section headers; `CountUp` animates to 2,650+ / 19+ /
$15.6k+ including the decimal variant; `BigNumber` alternates orange/blue by
index; `Carousel` autoplays, tracks dots, and pins its play/pause control.
`ProtectedEmail`'s `textContent` reads `"orgproject nextechinfo"` — reversed
and non-contiguous — with `row-reverse`, `user-select: none`, pseudo-element
separators, and the real address absent from the page HTML. In dark mode
`data-theme="dark"` is set before first paint with no flash, `--surface`
resolves to `#141619`, and `--accent-alt` to the lifted `#5c9de0`.

## Phase 3 notes

Delivered: `Navbar` (two-stage collapse), `Footer`, `NewsBar`, `ContactPopup`,
`ThemeToggle`, `ActiveLink`, `SiteChrome`, and the article system
(`Article.tsx` + `RailLayout.tsx`). `<TemporaryChrome>` and `.tempNav` are gone
from the root layout.

**Two silent bugs were found here, both worth understanding before Phase 4.**

### 1. `@custom-media` resolves PER FILE

`postcss-custom-media` only sees `@custom-media` declarations that live in the
file it is currently processing. The declarations were in `globals.css`, so no
`*.module.css` ever saw them — and an unresolved `@media (--lg)` does not
error. It ships to the browser verbatim, where it is an unrecognized media
query and is silently dropped.

Every responsive rule written in Phases 2 and 3 was therefore dead: Navbar's
entire two-stage collapse, Footer's three-column layout, ContactPopup's desktop
positioning, Article's two-column grid, and the `sm:` type sizes on PageHeader
and BigNumber. Sixteen unresolved queries shipped.

The fix is `@csstools/postcss-global-data`, which injects
`src/app/breakpoints.css` into every file before `postcss-custom-media` runs.
**The plugin order in `postcss.config.mjs` matters and is not optional.**

**Verify after any PostCSS or CSS change:**

```bash
grep -o "media (--" .next/static/chunks/*.css   # must return NOTHING
```

### 2. Static component markers do not survive the server/client boundary

`ArticleSection` decides what belongs in the rail by reading a static
`.rail === true` off each child's component, and alternates highlight colors by
reading `.isHighlight`. Every export of a `'use client'` module becomes an
opaque CLIENT REFERENCE in the server graph, and **a client reference carries
no static properties**.

So while `Article.tsx` carried `'use client'`, every article authored by a
Server-Component page silently lost its entire rail — every `<Figure>`,
`<Note>`, and `<RailCarousel>` fell into the prose column, and every highlight
rendered orange because the tone was never injected. It typechecked, linted,
and built cleanly.

This is the same failure mode as the Phase 1 `THEME_STORAGE_KEY` bug. **Reading
any property off an export of a `'use client'` module from the server side
gives `undefined`, never an error.**

The fix draws the boundary where it actually belongs:

- **`Article.tsx` has NO directive**, so its block components are real
  functions in whichever graph imports them, and the markers work. It must
  never gain one.
- **`RailLayout.tsx` is the `'use client'` half** — only the DOM measuring.
  It finds rail items by `querySelectorAll('[data-rail-item]')` rather than by
  a ref array, because it never sees them as React children.

`useLayoutEffect` there is selected per environment
(`typeof window !== 'undefined' ? useLayoutEffect : useEffect`), since a Client
Component is still server-rendered for the initial HTML and would otherwise
warn.

### Other Phase 3 decisions

- **`SiteChrome`** holds the news bar's dismissal. That state lived in the
  prototype's `RootLayout`, which cannot work here because a root layout is a
  Server Component. Client state inside a layout survives navigation in the App
  Router, so the behavior is unchanged. The `Footer` is deliberately NOT in
  `SiteChrome` — it needs no client state and stays a Server Component.
- **`ActiveLink`** replaces react-router's `<NavLink isActive>` with a
  `usePathname()` comparison, the one non-mechanical part of §2.2. Isolating it
  is what lets `Footer` stay a Server Component. It also sets
  `aria-current="page"`, which the prototype did not.
- **`Navbar` uses `<img>` for the logo**, not `next/image`, with the lint rule
  disabled at that line. Same reasoning as `ImagePlaceholder`; revisit in the
  content phase.

**Temporary, delete at the end of Phase 4:** `/dev/primitives` and
`/dev/article` (`src/app/dev/`). The article route is deliberately adversarial —
a tall rail figure beside short prose, two rail items anchored close together,
a trailing rail item, highlights spanning a section boundary, and a fullWidth
article.

**Verified at the Phase 3 gate** (Node 22, `next build` + `next start`, driven
in a real browser): `tsc` clean, `eslint` clean, 17/17 routes prerendered, zero
unresolved media queries, no hydration warnings.

Article, at 1440 / 1024 / 1023px:

- rail cell `height: 0` with `position: absolute` contents at >=lg (property 1)
- grid `minHeight` set per section (419/423/288px) and cleared below lg
  (property 2), with **zero overlaps** in the two-rail section
- grid `align-content: start` (property 3)
- the JS constant and the CSS breakpoint agree exactly: `matchMedia` is true at
  1024 and false at 1023
- at 1023 the grid is one column, transforms and minHeight are cleared, the
  rail is capped at 420px, and blocks weave in authoring order
  (P, ASIDE, P, P, FIGURE, P)
- highlights alternate orange, blue, orange ACROSS section boundaries
- `fullWidth` renders its rail `display: none`

Navbar collapse: `>=xl` everything inline, no hamburger; `lg..xl` primary
inline with utilities folded; `<lg` both folded. Exactly one theme toggle
visible at every width. ContactPopup renders inside the sticky `<header>` at
`top: 100%`, 380px wide, z-index 50, with the toggle carrying
`data-contact-toggle`. In dark mode the header is `--surface` at 95% behind a
blur, with the orange rule above and the lifted-blue rule below.

## Phase 4 notes

Delivered: the feature components (`RotatingTagline`, `HomeCtas`,
`GradeRange`, `CourseCard`, `ProfileCard`, `ProfileGrid`, `ProfileModal`,
`SearchPanel`, `DiscordWidget`, `PntMap` + `MapClient`, `ClosingCta`) and all
13 pages. `src/app/dev/` and `src/components/dev/` are deleted.

New dependencies: `leaflet`, `react-leaflet`, `recharts`, `papaparse` (plus
`@types/leaflet` and `@types/papaparse`). PapaParse and `public/data/programs.csv`
both disappear when Programs reads the API (Part C).

### The page/island split

Every page file is a **Server Component that exports `metadata`**. Where a page
needs browser state, that state lives in one sibling client island rather than
in the page:

| Page | Island | Why it is ONE island, not several |
|---|---|---|
| `/` | `components/home/HomeCtas` | only "Host a program" needs `openContact` |
| `/leadership` | `LeadershipRoster` | four grids, ONE shared `ProfileModal` |
| `/project-groups` | `GroupDirectory` | map + grid + the same shared modal |
| `/curriculum` | `SubjectTabs` | tab state drives the card grid |
| `/programs` | `ProgramSearch` | filters, CSV, and map framing are one machine |
| `/dashboard` | `DashboardView` | gated on `isLoggedIn` in its entirety |

`/about`, `/impact`, `/volunteer`, `/terms`, `/policies`, `/contribute` have no
island at all — their only client code is `Reveal`, `Carousel`, `CountUp`, and
`DiscordWidget`, each of which owns its own boundary.

**`Article.tsx` still has no directive, and this is now load-bearing in
production.** Four pages author articles from a Server Component. Verified at
the gate: rail blocks land in the rail on every one of them (see below). This
is the Phase 3 client-reference bug, and it would have come back silently.

### Two prerender hazards that the prototype could not have

Both are the same shape: a value that is fine in a client-only SPA but wrong
when the page is prerendered AND server-rendered before hydration. Both are
fixed with `useSyncExternalStore`, the same pattern `themeStore.ts` uses.

**1. Curriculum's "a different subject leads each visit."** The prototype wrote
`useState(() => random subject)`. Here that either bakes one subject into the
static HTML forever, or differs between the server render and the first client
render — a hydration mismatch. `SubjectTabs.tsx` therefore reads the lead
subject from a store: the server snapshot is `SUBJECTS[0]`, and the client
snapshot picks once, lazily, and keeps it. Verified: six loads produced four
different leading subjects, with zero console errors.

**2. Programs' default date range.** `NEXTJS_MIGRATION.md` §2.5 flagged this.
`new Date()` at module scope does NOT help — a Client Component is still
server-rendered for the initial HTML, so the server's clock and the browser's
disagree. `ProgramSearch.tsx` uses a `todayIso` store whose **server snapshot
is the empty string**, which renders empty date inputs. Verified: the served
HTML carries `value=""` for both inputs, the browser fills in today and +30
days, and the page logs zero console errors.

In both cases the state that the user then edits is `useState<T | null>(null)`
with the store value as the fallback (`selectedId ?? leadSubjectId`,
`edited ?? defaults`). That is what keeps the defaults tracking the store as it
arrives without ever calling `setState` from an effect.

### Other Phase 4 decisions

- **`MapClient` is the only supported way to render a map.** `PntMap` must
  never be imported by a page: Leaflet reads `window` at import time, so it
  needs `ssr: false`, and in Next 16 that spelling is illegal in a Server
  Component (§2.6). `MapClient` exists purely to give `dynamic()` a Client
  Component to live in.
- **Recharts loads through `next/dynamic` too**, but WITHOUT `ssr: false` — it
  is SSR-safe, and the split is only about keeping ~370 kB off the initial
  payload. Verified: `recharts` appears nowhere in `/dashboard`'s served HTML.
  The `loading` fallbacks reserve each chart's exact height so the panel does
  not jump.
- **The two "open item" embeds render labelled, dashed stand-ins** rather than
  nothing when their constant is unset (`DONORBOX.campaignSlug` on Contribute,
  `MYMAP.embedUrl` on Impact). A blank column reads as a bug; a labelled box
  reads as waiting on PNT. See LAUNCH_READINESS.md.
- **Tailwind's named `group/info`** on the Curriculum card's tooltip becomes
  `.info:hover .tooltip, .info:focus-within .tooltip`. Keyboard access is not
  incidental here — verified that focusing the button alone reveals it.
- **`ClosingCta`** was extracted rather than letting `/project-groups` import
  `/leadership`'s `page.module.css`. A cross-route CSS import would have worked
  and would have been wrong.
- **`DiscordWidget` fetches from the browser, deliberately.** Doing it in a
  Server Component would put Discord's latency on every render and cache one
  server's view of a live number for every visitor.
- **`<img>` (not `next/image`) in two more places**, each with the lint rule
  disabled inline and a reason: Discord member avatars (remote CDN URLs that
  would need a `remotePatterns` entry, at 28px) and the Volunteer page's
  40px cursor glyph. Same standing decision as `ImagePlaceholder` and the
  Navbar logo; revisit all of them together in Phase C.

### Toolchain footnote

`npm run build` is the right command, but on this machine it can still fail
with the Node 23 `workStore` invariant even when Node 22 is first on `PATH` —
the `next` shim resolves `node` through the nvm4w symlink rather than through
`PATH`, so the npm script gets Node 23 anyway.

The fix is to make Node 22 the shell's actual runtime, then use the npm script
normally:

```bash
nvm use 22.13.1        # needs an elevated shell on nvm4w
npm run build
```

Invoking the binary directly bypasses the shim, and is the escape hatch for
when that is not possible — not the normal way to build:

```bash
node ./node_modules/next/dist/bin/next build
```

Pinning the runtime (`.nvmrc`, Docker base image) before Phase 8 removes the
trap and makes `npm run build` simply correct.

**Verified at the Phase 4 gate** (Node 22, `next build` + `next start`, driven
in a real browser at 1440 / 1100 / 1023px, light and dark): `tsc` clean,
`eslint` clean, **13/13 routes prerendered**, **zero unresolved media queries**,
and **no hydration warnings on any page** — every console error is an expected
`public/media/` 404, and the only console warnings are Next's own CSS-chunk
preloads plus Google's inside the My Maps iframe.

- **Article on Server-Component pages** — About: 5 rail figures in one section,
  `height: 0` cells, absolute contents, `minHeight` 331/1523px, zero overlaps.
  Impact: all three rail block types land in the rail (`FIGURE`, `RailCarousel`,
  `Note`), zero overlaps across four sections. Highlights alternate orange,
  blue, orange ACROSS section boundaries on About (3), Impact (4), Volunteer
  (5), Terms (3). Terms `fullWidth` renders 1092px prose beside a 0px rail. At
  1023px: one column, `minHeight` and transforms cleared, rail capped at 420px.
- **Leaflet** — CARTO light basemap in light mode and `dark_all` in dark
  (the `key={resolvedTheme}` swap), `.leaflet-container` `z-index: 0`, 20
  markers alternating orange/blue, zoom control top-right, both attributions.
  The doubled overrides still win from a lazily-loaded chunk: zoom buttons
  `#1b1e22`, attribution links in lifted blue.
- **The modal-over-map rule holds** — with a group popup open,
  `elementFromPoint` over the visible map returns the modal scrim, not Leaflet.
- **ProfileModal** — portaled to `<body>`, `z-index: 50`, `overflow: hidden` on
  `<body>`, dialog focused, 570/260 panels, prose capped at 288px, Escape
  closes and restores scroll. Group labels relabelled per the brief.
- **Programs** — CSV parsed, 6 programs found, 6 venue markers, scrim gone
  after search, panel docked at 290px/left 12px, zoom control appears only
  once unfrozen, venue popup themed at 256px with a signup link.
- **Dashboard** — `noindex, nofollow`; signed out shows Log in; signed in shows
  "Hi, Nexus", 808/300 layout, 3 Recharts surfaces (3 donut slices, 13 bars),
  10 table rows, 5 quick links, 5 link groups, 9 profile fields, sticky aside.
- **GradeRange** — all six labels on ONE row (identical `getBoundingClientRect`
  top), unique anchors, highs anchored right, ideal bar directly on the OK bar,
  both school transitions with their titles.
- **Curriculum** — tabs alternate orange/blue, auto-advance at 10s, a click
  extends the next interval to 30s. Info tooltip opens on focus alone.
- **Home** — tagline rotates every 4s over a hidden height reservation;
  CountUp reaches 2,650+ / 19+ / 7,600+ / 260+ on scroll.
- **Volunteer** — `youtube-nocookie` embed, Slides box at
  `calc(56.25% + 38px)` = 614px at 1024px wide, and the live Discord widget
  (495 members / 103 online / 8 avatars) in real blurple `#5865f2`.
- **ProtectedEmail still holds** on Terms and Contribute: `textContent` reads
  `"orgproject nextechinfo"` / `"orgproject nextechec"`, and neither real
  address appears anywhere in the served HTML.
- **Navbar two-stage collapse** — >=xl all inline; lg..xl primary inline with
  utilities folded; <lg logo, one theme toggle, and the hamburger only.
  Exactly one theme toggle visible at every width.

## Phase C notes

The 177 images in `../ProjectNexTech.org-new/public/img/` are accounted for:
**171 copied**, 6 consciously skipped, 0 unaccounted for. The Leadership page
holds the 20 real people. No fabricated person or organization is left on the
site.

### What the images map onto

| Source | Destination | Count |
|---|---|---|
| `partners/*.png` | `about/partners/partner-*.png` | 7 |
| `carousel_1-8.png` | `home/carousel/home-carousel-NN.png` | 8 |
| `gallery_1-8.png` | `about/about-us/about-us-NN.png` | 8 |
| `programs/X_Y_N.png` | `curriculum/<code>-<slug>/shot-NN.png` | 63 |
| `team/*` | `leadership/<group>/<person>/` | 85 |

Skipped on purpose: `Logo.png` (a 675x500 copy is already at
`public/media/logo.png`), `404.png` (the not-found page is typographic),
`discord.png` and `cursor.png` (this site draws both from its own assets),
`team/nt_leader.png` (a generic stand-in portrait), and `team/src_4.jpg`
(a duplicate of `src_4.png`).

**Course photos map 1:1 by code and the mapping is written out in full**, not
derived from titles. `2.1` and `2.2` were renamed by the brief from "Intro to
FLL" / "Intro to FTC", so a title-derived rule would have missed them. `4.4`
Intro to Astronomy is brief-invented and has no photos anywhere; its card shows
three dashed boxes naming the files it wants.

### Leadership media folders are named after the person

The scaffolding used `member-01`, `member-02`, … Those folders were deleted.
With a real roster, numbered folders are a trap: the first time someone joins
or leaves mid-group, every folder below them refers to a different person and
each photo silently belongs to the wrong face. Nothing errors.

`slug` in `src/data/leadership.ts` is the single source of both the folder name
and the image paths, so the two cannot drift.

`shots` on each member is a real count of the carousel files that exist —
several people have four rather than five, and the advisors' chair has a
portrait only. Add a photo, bump the number.

**`public/media/leadership/unlisted/` is referenced by nothing.** It holds five
real photo sets with nowhere to go: Varshith Vijjapu and Colin Thompson have
complete sets but appear nowhere on the live team page; Kush Kharia has a
portrait only; J.P. Pierce and Jocelyn Slape are advisors, which render as
name-only cards. Copied so the port lost no files. See that folder's README.

### Real photographs did not get invented captions

Every caption that shipped in Phase 4 was placeholder prose describing a
hypothetical photo — "students building during a maker space workshop". Pinning
those onto real photographs would state as fact something nobody recorded. So
the home carousel, the About carousel, and all 85 team photos ship **without
captions**; `Carousel` omits the caption block entirely when there is nothing
to show. Captions are tracked in `LAUNCH_READINESS.md`.

### Counts are configuration, not constants in component code

- `CAROUSEL_COUNT` in `src/app/page.tsx` and `ABOUT_CAROUSEL_COUNT` in
  `src/app/about/page.tsx` — drop in `home-carousel-09.png`, raise the number,
  done. Nothing else changes.
- `DEFAULT_COURSE_SHOTS` in `src/data/courses.ts` (3, which is what every
  course on the live site actually had) with an optional per-course `shots`
  override, read through `courseShots()`. `SHOTS_PER_CARD = 5` is gone from
  `CourseCard.tsx`; a component no longer decides how many photos exist.

A count higher than the files present is not an error — the extra frames render
as dashed boxes naming the missing file, which is how a gap stays visible.

### Links corrected

- **`MYMAP.embedUrl`: `/maps/d/u/2/` -> `/maps/d/u/0/`.** The `/u/N/` segment
  is a Google ACCOUNT SLOT, not part of the map id. At `/u/2/` the Impact map
  resolves only for a viewer whose third signed-in Google account can see it
  and renders a permission error for everyone else. This was live in Phases
  1-4 and would have shipped.
- **`DOCS.constitutionEmbed`** now uses the live site's PUBLISHED URL
  (`/d/e/2PACX-…/pub?embedded=true`). The old `/preview` URL renders a sign-in
  wall unless the document happens to be shared link-public. Note the published
  id is a different string from the document id in `DOCS.constitution`; that is
  expected, not a typo.
- **`DONORBOX.campaignSlug = 'donate-to-project-nextech'`** plus `embedParams`
  carrying the live site's defaults (monthly, $100, general designation). This
  closes the LAUNCH_READINESS blocker — the site can accept donations. The
  labelled-placeholder branch stays as the degradation path if the slug is ever
  cleared.
- **`FORMS.partnership`** added and embedded on Contribute. The
  scraper-protected `ec@` address stays alongside it: the "must not regress"
  list requires that `ProtectedEmail` is never the only route to an inbox.
- **Discord invite stays `6yHhgpC`** (PNT confirmed). The live site's Join page
  uses `ecJhHVd`; both work, and v3 uses its value in three places.
- **`FORMS.enrollment2026`** is documented as the same form the live site
  embeds on /join, so nobody wires up a second copy.

### ImagePlaceholder gained a `fit` prop, and `contain` needs `.bare` with it

`fit="contain"` for logos. The default `cover` crops to fill, which is right
for a photograph and wrong for a logo: the Cyberius wordmark is 3:1 in a 1:1
partner slot and rendered as the middle third of a word. Partner cards pass
`contain`; nothing else does.

**Switching the fit was only half the fix, and the other half was invisible in
six cases out of seven.** `.frame` paints `--surface-sunken` behind the image —
right for a photograph, where it reads as a frame waiting to be filled. A
square logo covers that well completely, so it never showed. The moment one
logo was not square, `contain` letterboxed it and the well showed through as
bars above and below: a transparent white wordmark rendering as a **black box**
sitting on the card. It looked like a broken asset, and the asset was fine.

So `fit="contain"` now also selects `.bare` (`background: transparent`) instead
of `.filled`. The two are a pair — do not set one without the other. Verified:
7 frames carry `.bare`, the other 13 still carry `.filled`.

This was caught by eye, not by any check. Every automated gate passed with the
black box on the page: the file existed, served 200, decoded to 3277x1081, had
a transparent top-left pixel, and measured mean ink luminance 233. Pixel
statistics of the *asset* say nothing about the *frame* behind it.

### White-ink logos get a chip, in light mode only

The mirror image of that bug turned up the moment the page was viewed in LIGHT
mode. Two partner assets are white marks on transparency — fine forever on a
site that only had a dark theme, invisible on a light card. Measured as the
share of each logo's ink with no usable contrast against the card it sits on:

| Logo | on light | on dark |
|---|---|---|
| Cyberius | **72%** | 0% |
| Francis Parker School | **70%** | 0% |
| International Research Olympiad | 55% | 37% |
| GSDSEF / City of SD / Google / Qualcomm | <=26% | 0% |

`Partner.ink = 'light'` in `src/data/partners.ts` flags such a file, and the
About page gives it a dark chip to sit on **in light mode only**. This is a
property of the FILE, not the brand — replace the asset with a dark or
full-color variant and delete the flag.

The chip needs all three theme blocks, which is the convention `globals.css`
already sets: bare `:root` is light, and dark is the override. Both dark
selectors are required — the media query catches "system" (no `data-theme`
attribute at all) and the attribute selector catches an explicit toggle. All
three are verified in the built CSS.

**Painting a background exposed a second latent bug.** `.logo` is a flex child
of the partner card, so with no `align-self` it stretched to the full card
height. That was invisible while it had no background — the 1:1 frame inside
sat at the top regardless — and became a tall dark column the instant the chip
painted one. `align-self: flex-start` fixes it, and is correct with or without
the chip.

### Two traps that cost time while verifying this

**1. `ImagePlaceholder`'s `className` lands on an OUTER WRAPPER, not the
frame.** The tree is `div.<className>` > `div.frame` > `img`. Measuring
`img.parentElement` reads the frame and misses everything the caller styled;
the wrapper is `img.parentElement.parentElement`.

**2. `npm start` fails SILENTLY into a stale server.** Starting it in the
background while an older instance still holds the port makes the new process
exit with `EADDRINUSE` — and the old one keeps answering on that port, serving
the PREVIOUS build. Every subsequent measurement is then taken against stale
output, and it looks exactly like a CSS change that did not apply. Confirmed by
finding `align-self` present in the built CSS on disk while the served HTML did
not even reference the chunk containing it.

Always free the port before starting, and never with a blunt `taskkill /IM
node.exe` — that also kills the Playwright MCP server and drops the browser
session mid-pass:

```bash
for PID in $(netstat -ano | grep ":3100" | grep LISTENING | awk '{print $5}' | sort -u); do
  taskkill //F //PID "$PID"
done
# then start, and check the log actually came up
grep -q EADDRINUSE "$LOG" && echo "STILL IN USE"
```

### The Donorbox frame sizes itself; the fallback height is not decoration

Donorbox's documented embed is a FIXED-height iframe (their snippet says 900px)
plus `https://donorbox.org/widget.js`, which listens for a height the form posts
out and resizes the frame. Phase C shipped the iframe without the resizer, so
the panel stood at 900px around a ~745px form and the bordered box had an empty
band at the bottom. It was wrong on the other axis too: `form.donation-form`
inside the frame is `width: 100%` capped at **423px** and LEFT-ALIGNED, so a
542px column left 117px of dead space down the right, inside the border.

`src/components/contribute/DonorboxFrame.tsx` is that resizer, written against
the same postMessage protocol rather than by loading their script:

- `widget.js` guards on a global (`window.DBOX_EMBEDED`) and does its work once,
  on DOMContentLoaded. A second visit here is a client navigation with no new
  document, so it short-circuits and the fresh iframe is never wired up. The
  live site has this bug. An effect keyed to the element's lifetime cannot.
- It rewrites `iframe.src` (appending `a=b`) to force `allowpaymentrequest` on,
  reloading the payment form a second time. Ours ships `allow="payment"` in the
  markup and loads once.
- Nothing on this site loads a remote script it does not have to, and the part
  of that script we need is about twenty lines.

Protocol: stamp the frame with `data-donorbox-id`, post
`{ action: 'set-iframe-id', msg: <id> }` into it, then accept `{ from: 'dbox',
height }` messages from `https://donorbox.org` and write `height + 3` px. The
`name="donorbox"` attribute is load-bearing — the form does not answer without
it.

**Two things here look like tidying and are not:**

1. **The 900px in the CSS is the no-JS fallback**, not a starting guess, so it
   has to stay tall enough for the whole form rather than merely typical.
   Lowering it to "about right" clips the form for anyone the messages never
   reach.
2. **`scrolling="no"` is deliberately absent** even though Donorbox's snippet
   sets it. Once the height tracks the content there is nothing to scroll, and
   the one case that would produce a scrollbar is the one where the resize did
   not happen and the donor still needs to reach the Next button.

`max-width: 425px` is the form's 423px cap plus the document's 2px inset.
Undershooting is safe — the form is fluid below its cap and simply narrows,
which is what carries the mobile layout — so if Donorbox ever widens the form
this stays conservative rather than clipping.

**Verified** (Node 22, `next build` + `next start`, real browser): frame 425x744
around a 421x742 form — 4px of dead width, 2px of dead height, down from 117px
and 156px. The height is genuinely reactive, not a one-shot: 744 -> 688 when
"One-time" is picked, -> 774 when the comment box opens. After a client-side nav
to /about and back (`performance.getEntriesByType('navigation').length === 1`,
so no reload) it still measures 744px, which is the case `widget.js` gets wrong.
No inner scrollbar; identical in light and dark; fluid to 342px at a 390px
viewport.

### Deliberately still placeholder

- **Project Groups** — all 20 groups, their codes, leads, members, and
  coordinates are invented, and no real data for them exists in either source
  repo. 20 dashed `region.png` boxes.
- **About History (5), Impact (6), Volunteer (9)** — 20 article figures. PNT
  chose to leave these showing their file paths rather than fill them with
  generic gallery photos that the captions would then misdescribe.
- **`shared/og`** — the 1200x630 social preview image.
- **Dashboard `PROFILE`** — tied to the stubbed `isLoggedIn` flag, so it stays
  fictional until real auth lands in Phase 7.

### Verified at the Phase C gate

Node 22, `next build` + `next start`. `tsc` clean · `eslint` clean · 13/13
routes prerendered · 0 unresolved media queries.

- **Every image reference resolves or is a known placeholder.** 93 unique
  `/media/` paths in the served HTML: 52 serve 200, and all 41 that 404 are the
  deliberate placeholders above (history 5, impact 6, volunteer 9, project
  groups 20, og 1). Widening the audit to client-only surfaces — every file in
  the leadership tree, every course shot path — gives 244 paths checked with
  **no unexpected 404 and no accidental orphan**; the only unreferenced files
  on disk are the 14 in `unlisted/`, which is the point of that folder.
- **Roster**: all 20 real names present, 0 occurrences of "Placeholder Name",
  13 portrait paths (12 members + the advisors chair).
- **Partners**: 7 cards, 0 occurrences of "Placeholder Partner".
- **Partner logos are safe in both themes** — decoded each PNG's pixels
  directly: all 7 have a transparent top-left (alpha 0, so no white box on the
  dark surface) and mean ink luminance 86-233 against a `--surface-raised` of
  ~30, so none disappears in dark mode.
- **Links**: Donorbox slug and params present and the placeholder branch gone;
  partnership form embedded; Constitution serving the published URL; MyMap at
  `/u/0/` with no `/u/2/` anywhere.

**Browser pass** (Playwright, 1440px, dark theme — it reconnected after the
checks above):

- **Leadership**: 13 portraits, **0 broken**, 0 placeholder boxes, all 12 real
  card names. Matthew Hsu's popup renders the real portrait carousel (5 slides,
  0 broken), both real bio paragraphs, and all 9 detail rows including the new
  Extracurriculars and Interests. No caption block, as intended.
- **About**: 15 images, 0 broken. 7 partner cards, all `object-fit: contain`.
  The 5 History figures show their file paths, which is the agreed placeholder
  behavior.
- **Curriculum**: real photos, 3 shots per card, no `shot-04/05` requested
  anywhere; 4.4 Astronomy shows exactly 3 dashed boxes naming its missing files.
- **Contribute**: Donorbox live with Monthly and USD 100 preselected and the
  designation applied; the real Partnership Request Form renders beside it; the
  protected `ec@` address is still present. All console errors on that page
  originate inside the third-party iframes.
- **Policies**: the published Constitution renders in full, no sign-in wall.
- **Impact**: the My Maps embed loads real pins across four continents in a
  browser signed into no Google account — which is the proof that `/u/2/` was
  broken and `/u/0/` is not.
- **Dashboard**: signed in, the fictional profile shows its own dashed box and
  no longer borrows a real volunteer's portrait. 3 chart surfaces render.
- **Article rail with real photos**: About section 1's `minHeight` re-measured
  from 331px to 258px once the real 4:3 image replaced the fixed-ratio dashed
  box, still with zero overlaps. The ResizeObserver handles the post-paint
  geometry change, which had never been exercised with real images before.
- **The black-box bug above was found here and nowhere else**, and the
  white-ink-on-light bug was found in the same pass. Both fixed and re-verified
  in the browser in all three theme states.

Lazy loading is worth knowing about when measuring in a browser:
`ImagePlaceholder` sets `loading="lazy"`, so a below-the-fold image reports
`complete: false` and `naturalWidth: 0` — indistinguishable from broken unless
you scroll it into view first. Partner logos sit at the bottom of a long page.
