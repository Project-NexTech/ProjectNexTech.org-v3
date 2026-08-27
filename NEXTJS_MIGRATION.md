# Migrating the model to a real Next.js site

**Status:** planning document. Nothing in this repo has been migrated yet.

This document describes how to turn `pnt-site-v3-model` — a Vite + React
Router + Tailwind prototype — into the production `projectnextech.org`, built
on **Next.js 16** with **plain CSS Modules instead of Tailwind**, reading its
program and volunteer-hours data from **SQL instead of Google Sheets**, and
**self-hosted on a VPS** rather than statically exported to GitHub Pages.

It is written to be executed in order. Each part ends with a checkpoint that
can be verified before moving on, matching the phase-gate convention the model
repo uses.

Read alongside:

- `initial_prompt_v1.md` (in this repo) — the authoritative design/content
  spec. It still wins on anything visual. **This migration changes no pixel of
  the design.**
- `LAUNCH_READINESS.md` (in this repo) — the outstanding content/backend items.
  Several (venue geocoding, the real program database, Google sign-in) are
  resolved *by* this migration and are cross-referenced below.
- **`CLAUDE.md` in the model repo** (`../pnt-site-v3-model/CLAUDE.md`) — the
  load-bearing implementation details of the prototype. The "must not regress"
  list in Part E is drawn from it, but it describes the *Vite/Tailwind* build
  and is the reference implementation, not a description of this repo.
- `AGENTS.md` (in this repo) — read it, and the Next docs it points at, before
  writing code. See §2.0.

---

## 0. What exists today

### This repo (the model)

| | |
|---|---|
| Build | Vite 8, plain JS/JSX, no TypeScript |
| Routing | `react-router-dom` 7, `BrowserRouter`, 13 routes + `/discord` + 404 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, **425 `className` occurrences across 42 component/page files** |
| Tokens | Two-layer system in `src/index.css` — brand `--pnt-*` and semantic `--bg`/`--text`/`--accent`, mapped onto utilities by `@theme inline` |
| Fonts | Fontsource variable Inter / Space Grotesk / JetBrains Mono, bundled by Vite |
| Data | Static JS modules in `src/data/` plus a generated `public/data/programs.csv` (300 rows) |
| Heavy deps | Leaflet + react-leaflet (Programs, Project Groups), Recharts (Dashboard), PapaParse (CSV) |
| Deploy | GitHub Pages, `dist/index.html` copied to `404.html` for deep links |
| Bundle | ~256 kB initial; Recharts (369 kB) and Leaflet (154 kB) code-split behind `lazy()` |

Breakpoint usage, which sets the scale of the media-query work: **35 `lg:`,
23 `sm:`, 10 `md:`, 7 `xl:`**.

### The current live site (`../ProjectNexTech.org-new`)

Next.js 15 App Router, TypeScript, `output: "export"` (fully static), MUI v7 +
Emotion with `sx` props, deployed to GitHub Pages by
`.github/workflows/nextjs.yml`. Five content sections.

**What to take from it:** the App Router layout shape and the `@/*` path alias.
Not much else.

**What to leave behind:** MUI and Emotion entirely (the model's design system
replaces them), the hardcoded hex values scattered through its components,
`output: "export"`, `images.unoptimized`, and the GitHub Pages workflow. All of
those exist because of the static-export constraint, which §1.1 removes.

### The target (`../ProjectNextech.org-v3`)

A bare `create-next-app` scaffold: **Next 16.3.3, React 19.2.8, TypeScript,
CSS Modules already, no Tailwind, no `output: export`.** One commit. This is
where the work in this document happens. See §2.0 — Next 16 is not Next 15, and
the difference matters in several specific places.

---

## 1. Decisions to make before writing any code

Five decisions shape the rest of the work. **§1.1 and §1.5 are now closed** —
PNT has chosen a self-hosted VPS, and a frontend/backend split because the
database may live on a different host. The other three remain open, and all
three have a recommendation you can simply take.

### 1.1 Hosting — DECIDED: a VPS running a real Node server

**Decided by PNT: the site moves off GitHub Pages and off static export
entirely, onto a self-hosted VPS.** Either Coolify (Docker) or a hand-rolled
setup — see Appendix A for both, and §7 phase 8 for the cutover.

This was the one blocking decision, and it is closed. It unlocks everything:
Server Components querying SQL directly, Route Handlers, real sessions,
`next/image` optimization, ISR, and streaming. Nothing in Parts A–C has to be
designed around a static-export constraint.

The consequences worth naming up front, because they are now PNT's to own:

| | On GitHub Pages | On a VPS |
|---|---|---|
| Uptime | GitHub's problem | **PNT's problem** |
| TLS certificates | Automatic | Caddy/Traefik automatic, or certbot renewals to watch |
| Database backups | N/A | **PNT's problem** — see Appendix A.4 |
| Security patching | N/A | **PNT's problem** — unattended-upgrades at minimum |
| Cost | $0 | ~$6–20/mo |
| Deploy | Push to `main` | Push to `main` + a webhook, or a manual pull |

None of that is a reason to reconsider — a student org running a real volunteer
database needs a real server. But "who gets paged when the site is down" and
"who verifies the backups restore" are now questions with real answers, and
they should have names attached before launch.

**`next.config.ts` must not set `output: "export"`.** The scaffold in the
target repo correctly has neither that nor `basePath`, so there is nothing to
undo. For Docker, set `output: "standalone"` instead (Appendix A.2).

**Node 20.9+ is required** by Next 16. Check the VPS image before anything
else; several LTS distro images still ship Node 18.

### 1.2 TypeScript or plain JS

The model is plain JSX; the live site is TypeScript. TypeScript pays for itself
most in the SQL layer, where row shapes are the thing most likely to drift.

**Recommendation:** scaffold with TypeScript and `allowJs: true`, move `.jsx`
files over as `.jsx` initially, and convert file-by-file. Write `src/db/` in
TypeScript from the start. This is optional — the migration works in plain JS —
but it is cheapest to adopt now rather than later.

### 1.3 Database engine

**Postgres**, running on the same VPS as a second container (or a system
package, if not using Docker). Reasons specific to this data: real `date` /
`time` types (the Programs page compares dates constantly), `numeric(5,2)` for
hours so 2.5 never becomes 2.4999, enums for verdict and classification, and
`CHECK` constraints that can encode invariants the model currently maintains
only by convention (§4.3).

Self-hosting the database alongside the app is the right call here — the data
is small (hundreds of programs, thousands of hour requests), it removes a
network hop and an external dependency, and it keeps volunteer records on
infrastructure PNT controls. **The tradeoff is backups**, which a managed
provider would have handled. Appendix A.4 covers it; do not skip it.

SQLite is a legitimate alternative at this data volume and would remove a
container. Postgres is still the recommendation because `citext`, enums, and
`numeric` all do real work in §4.2's schema, and because migrating away from
SQLite later is more painful than starting on Postgres now.

### 1.4 Query layer

**Recommendation: Drizzle ORM.** Schema in TypeScript, generated SQL migrations
you can actually read, no runtime codegen step. Prisma is a fine alternative —
on a VPS its engine binary is a non-issue, so the usual serverless objection to
it does not apply. Raw `pg` with hand-written SQL is also defensible given how
few tables there are.

This choice now lives in the **backend** service (§1.5), not in the Next app.

### 1.5 Frontend and backend are separate services

**Decided by PNT: the database may not be hosted alongside the site.** Because
that is possible, it must be assumed from the start. The two are therefore
built, tested, and deployed as **separate services with an HTTP contract
between them** — and then verified together (Part D).

```
                    ┌─────────────────────────────────────┐
  browser ──HTTPS──▶│  FRONTEND — Next 16                 │
                    │  ProjectNextech.org-v3              │
                    │  SSR, all UI, sessions              │
                    │  NO database driver, NO SQL         │
                    └──────────────┬──────────────────────┘
                                   │ HTTPS + service token
                                   │ (server-side only)
                    ┌──────────────▼──────────────────────┐
                    │  BACKEND — API service              │
                    │  owns schema, migrations, queries   │
                    │  the ONLY holder of DATABASE_URL    │
                    └──────────────┬──────────────────────┘
                                   │ private network or TLS
                    ┌──────────────▼──────────────────────┐
                    │  POSTGRES                           │
                    └─────────────────────────────────────┘
```

**The boundary rules — these are what make the split real rather than
decorative:**

1. **The frontend never imports a database driver.** No `pg`, no Drizzle, no
   `DATABASE_URL` in its environment. If a Next file imports a DB library, the
   split has been violated — enforce it with an ESLint `no-restricted-imports`
   rule so it fails CI rather than code review.
2. **The backend never renders HTML** and knows nothing about React, CSS
   Modules, or the design system. It returns JSON.
3. **The browser never talks to the backend directly.** It calls the Next app,
   which calls the backend server-side. This keeps the backend unpublished,
   removes CORS from the picture entirely, and means the service token is never
   shipped to a client. Programs search goes browser → Next Route Handler →
   backend.
4. **Migrations belong to the backend**, run as a deliberate step — never by
   the frontend, never automatically on boot.

**What this costs**, stated plainly, because the previous single-service plan
was simpler:

- A network hop on every data read — so timeouts, retries, and a sensible
  degraded state when the backend is down become things the frontend must
  handle rather than ignore.
- A contract that can drift. This is the main new failure mode, and Part D
  exists entirely to prevent it.
- Two deploy pipelines, two sets of secrets, two things to monitor.

**What it buys:** the database can move hosts without touching the frontend;
the frontend can be rebuilt, rolled back, or replaced without risking the data;
and volunteer records sit behind a service with one job and a far smaller
attack surface than a full SSR app.

#### Backend stack

**Recommendation: Node + Fastify + Drizzle, TypeScript, one Docker image.**
Fastify is small, fast, has first-class JSON-schema validation, and stays
legible to a student volunteer in a way NestJS will not. Hono is an equally
good pick. Express is fine if the team already knows it.

**Do not build the backend as a second Next app.** It would drag a rendering
framework in to serve JSON and blur exactly the boundary this section draws.

#### Repository layout

**Recommendation: a separate repo** — `ProjectNexTech-api` alongside
`ProjectNextech.org-v3`. Separate hosting and separate deploy cadence are
already the premise, and separate repos make "built separately" structural
rather than a matter of discipline.

The cost is contract drift across two repos, which §D.1 addresses with a shared
versioned types package and contract tests. A monorepo with two independently
built packages is the alternative, trading drift risk for a coupled release
process. Either is defensible — **pick one before phase 5**, because
retrofitting the other is tedious.

#### What does *not* move to the backend

Static content stays compiled into the frontend: `courses.js` (if it stays in
code per §1.3), `leadership.js`, `projectGroups.js`, `partners.js`, and all of
`constants/index.js`. They are not database-backed, so routing them through an
API would add a network hop and a failure mode for data that changes twice a
year and benefits from code review.

---

## 2. Part A — Vite + React Router → Next.js App Router

Do this **before** touching Tailwind. Keeping Tailwind working through all of
Part A means that at every commit the site still renders correctly, and any
visual difference you see is a routing bug rather than a styling bug.

### 2.0 ⚠️ The target is Next 16, not Next 15

`ProjectNextech.org-v3` is scaffolded on **Next 16.3.3 / React 19.2.8**, and
its `AGENTS.md` carries the managed block warning that this version differs
from what any model or tutorial written before it will assume:

> This version has breaking changes — APIs, conventions, and file structure may
> all differ from your training data. Read the relevant guide in
> `node_modules/next/dist/docs/` before writing any code.

**Take that literally.** The docs are vendored into the repo at
`node_modules/next/dist/docs/`, version-matched to the installed Next. Read the
relevant page before writing code against any API below.

The differences that actually bite this migration:

| Change | Effect here |
|---|---|
| **`middleware.ts` → `proxy.ts`** | Middleware is renamed Proxy in 16. The Dashboard route guard is `proxy.ts` at the `src/` root, exporting `proxy` (§4.7). |
| **Async request APIs** | `cookies()`, `headers()`, `draftMode()`, and `params` / `searchParams` are Promises. The 15-era synchronous compatibility is *fully removed*. Every one must be `await`ed. |
| **`next/dynamic` + `ssr: false`** | **No longer allowed in a Server Component** — it errors. The `dynamic()` call must live inside a Client Component. This changes the Leaflet approach (§2.6). |
| **Turbopack is the default** | For `next dev` *and* `next build`. No `--turbopack` flag; the scaffold's scripts are already correct. A stray `webpack` config now *fails* the build. |
| **`revalidateTag(tag)`** | Requires a second `cacheLife` argument: `revalidateTag('programs', 'max')`. The one-arg form is a TypeScript error. `updateTag()` is the new read-your-writes variant for Server Actions. |
| **`next lint` removed** | The scaffold already uses `"lint": "eslint"`. |
| **Node 20.9+, TypeScript 5.1+** | Check the VPS image (§1.1). |

Also new and worth knowing before designing the data layer: **Cache
Components** (`'use cache'`) works when self-hosted, including in Docker — it
is not a Vercel-only feature. Don't reach for it in phase 6; do read
`01-getting-started/08-caching.md` before deciding how the Programs query
caches.

`npx next typegen` generates `PageProps` / `LayoutProps` / `RouteContext`
helpers — use them rather than hand-writing async param types.

### 2.1 Moving the code in

The target repo already exists as a `create-next-app` scaffold with
`src/app/{layout.tsx,page.tsx,globals.css,page.module.css}` and the default
Vercel SVGs in `public/`. **Delete the boilerplate first** — the five stock
SVGs, the demo `page.tsx` and `page.module.css`, and the scaffold's
`globals.css` (which Part B replaces wholesale). Keep `layout.tsx` as the
starting point for the root layout.

Then bring across:

```
src/app/                # routes — new, see §2.2
src/components/         # moved verbatim from the model
src/constants/          # moved verbatim
src/context/            # moved verbatim
src/data/               # moved verbatim (for now — Part C moves some of it)
public/media/           # moved verbatim — 87 folders
public/cursors/         # moved verbatim
public/documents/       # moved verbatim
public/data/            # moved verbatim (deleted again in phase 6)
```

Set `paths: { "@/*": ["./src/*"] }` in `tsconfig.json` (the scaffold has this)
and add `allowJs: true` so `.jsx` files come across without a rewrite.

`public/` transfers unchanged. Every media reference in the codebase is an
absolute `/media/...` string, so nothing breaks: the 87 media folders, the
cursor SVGs, the impact-report PDF, and `robots.txt` all keep their URLs.

**The model repo's `CNAME` file does not come across** — DNS is handled at the
VPS now (Appendix A.3), not by GitHub Pages.

### 2.2 Route mapping

| Current route | App Router file |
|---|---|
| `RootLayout` | `src/app/layout.tsx` |
| `/` | `src/app/page.jsx` |
| `/about` | `src/app/about/page.jsx` |
| `/impact` | `src/app/impact/page.jsx` |
| `/programs` | `src/app/programs/page.jsx` |
| `/curriculum` | `src/app/curriculum/page.jsx` |
| `/leadership` | `src/app/leadership/page.jsx` |
| `/project-groups` | `src/app/project-groups/page.jsx` |
| `/contribute` | `src/app/contribute/page.jsx` |
| `/volunteer` | `src/app/volunteer/page.jsx` |
| `/dashboard` | `src/app/dashboard/page.jsx` |
| `/terms` | `src/app/terms/page.jsx` |
| `/policies` | `src/app/policies/page.jsx` |
| `*` (NotFound) | `src/app/not-found.jsx` |
| `/discord` → external | `redirects()` in `next.config.ts` |

`src/App.jsx` and `src/components/ExternalRedirect.jsx` are deleted — the route
table and the vanity redirect are both configuration now.

Making `/discord` a real HTTP redirect is strictly better than the current
client-side component: no blank frame while React boots, and link previews
resolve.

Also replace every `react-router-dom` import:

| react-router-dom | Next |
|---|---|
| `<Link to>` | `<Link href>` from `next/link` |
| `<NavLink>` + `isActive` | `<Link>` + `usePathname()` comparison |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `<Outlet />` | `{children}` in `layout.tsx` |

`NavLink`'s active styling in `Navbar.jsx` is the only non-mechanical one: it
becomes an explicit `pathname === href` check inside a client component.

### 2.3 Things that go away for free

All workarounds for Vite/GitHub Pages that Next handles natively:

- **`404.html` copying** (the `postbuild` script). Delete it. This resolves the
  "GitHub Pages deep links" open question in `CLAUDE.md`.
- **`ScrollToTop`** (`src/components/layout/ScrollToTop.jsx`). The App Router
  resets scroll on navigation. Remove it and verify; if some page needs it
  back, that is a local `scroll={false}` problem, not a global one.
- **Manual `lazy()` splitting** in `App.jsx`. Route-level splitting is
  automatic. Keep an explicit `next/dynamic` only for Leaflet and Recharts
  (§2.6), where the reason is `window` access and payload size, not routing.

### 2.4 Client/server boundaries

19 of the 42 component files use `useState` / `useEffect` / `useRef` and need
`'use client'`. Put the directive on the component itself, never on the page —
pushing it up the tree turns whole pages into client bundles.

**Must be client:** `SiteProvider`, `Navbar`, `NewsBar`, `ContactPopup`,
`ThemeToggle`, `Carousel`, `CountUp`, `Reveal`, `RotatingTagline`, `Article`
(uses `useLayoutEffect` + `ResizeObserver`), `ProfileCard`, `ProfileModal`,
`SearchPanel`, `PntMap`, `DiscordWidget`, and the interactive shells of
`Programs` and `Dashboard`.

**Stay server:** `Card`, `Tag`, `Icon`, `SectionHeader`, `PageHeader`,
`Wordmark`, `ImagePlaceholder`, `BigNumber`, `ProtectedEmail`, `GradeRange`.

`Button` is the awkward one — it renders a link, an anchor, *or* an `onClick`
button. Marking the whole component client is the simple call and costs almost
nothing; splitting it into a server link variant and a client button variant is
the tidier one. Either is fine.

### 2.5 Two SSR hazards already in the code

**1. `SiteProvider.jsx:26` reads `window.matchMedia` at module scope.**

```js
const systemPrefersDarkInitially = window.matchMedia(DARK_QUERY).matches
```

This runs during prerender and will crash the build. The `storedTheme` IIFE
just above it has the same problem. Both must move inside the component (a
`useState` initializer plus a mount effect).

That change on its own introduces a flash of the wrong theme on first paint, so
also add a **blocking inline script** in `app/layout.tsx` that reads
`localStorage` and sets `data-theme` on `<html>` before first paint. This is
the standard Next theme pattern and preserves the current behavior exactly: an
explicit choice sets the attribute, `'system'` removes it so the CSS media
query takes over.

**2. `Programs.jsx` computes `const TODAY = new Date()` at module load.**

Server and client can disagree about the date, producing a hydration mismatch
on the default date-range inputs. Initialize the filters in a client effect, or
render the search panel client-only.

`Carousel.jsx`, `CountUp.jsx`, and `Reveal.jsx` already guard with
`typeof window !== 'undefined'` and are safe. Re-grep before the first build.

### 2.6 Library-specific handling

**Leaflet** touches `window` at import time, so it needs `ssr: false` — but in
Next 16 **`next/dynamic` with `ssr: false` is not allowed in a Server
Component** and will error. The `dynamic()` call has to sit inside a Client
Component, which means an extra wrapper:

```tsx
// src/components/map/MapClient.tsx
'use client'
import dynamic from 'next/dynamic'

const PntMap = dynamic(() => import('./PntMap'), { ssr: false })

export default function MapClient(props) {
  return <PntMap {...props} />
}
```

The server page imports `MapClient`, never `PntMap` directly. Both Programs and
Project Groups go through this wrapper.

Import `leaflet/dist/leaflet.css` inside the client component. **The
specificity note in `CLAUDE.md` still applies** — Leaflet's stylesheet lands
after the app's CSS, so the dark-theme overrides must keep their doubled
`.leaflet-container` selectors. Do not "simplify" them during Part B.

**Recharts** is client-only but SSR-safe; `'use client'` suffices. Load the
Dashboard charts through `next/dynamic` anyway to keep 369 kB out of the
initial payload.

**PapaParse** disappears entirely once Programs reads SQL (Part C). Keep it
until then.

**Fonts:** replace the three `@fontsource-variable/*` imports in `main.jsx`
with `next/font/local` pointing at the same `.woff2` files (copy them to
`src/fonts/`), or `next/font/google`. Assign each to a CSS variable and put the
variable classes on `<html>`:

```ts
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
```

Self-hosting is preserved (no third-party font request), preload is automatic,
and the layout shift the Fontsource import currently allows goes away. The
`--font-sans` / `--font-display` / `--font-mono` names carry over unchanged, so
nothing downstream cares.

**Images:** `next/image` optimization **works self-hosted with zero
configuration** under `next start`, so `ImagePlaceholder` and the raw `<img>`
tags should move to `next/image` — no `unoptimized: true`, unlike the current
live site. Keep the `className`-lands-on-an-outer-wrapper behavior noted in
`CLAUDE.md`; under CSS Modules the width-conflict bug it works around no longer
exists, but the wrapper is still the right structure for `fill` layout.

> On glibc-based Linux (Debian/Ubuntu — i.e. most VPS images), sharp can use
> excessive memory unless configured. If the container's RSS climbs while
> serving images, that is the known cause, not a leak. See the self-hosting
> guide's Image Optimization section.

### 2.7 Metadata

The model has one `index.html` with one title. Next gives each route its own
`metadata` export — use it. This is also where the missing social preview image
from `LAUNCH_READINESS.md` gets wired (`openGraph.images`).

### ✅ Checkpoint A

All 13 routes serve. Every page is visually identical to the Vite build in both
themes. Deep links survive a refresh. No hydration warnings. **Tailwind is
still installed and still doing all the styling.**

> **Playwright MCP:** good fit for driving this checkpoint directly — navigate
> to each of the 13 routes plus `/discord` and a deep link refresh, take a
> snapshot/screenshot per route, and check the console for hydration warnings
> via `browser_console_messages`. Cheaper than eyeballing every route by hand.

---

## 3. Part B — Tailwind → CSS Modules

This is the largest mechanical chunk: 425 `className` occurrences across 42
files. It is also the part most likely to introduce silent visual drift, so the
order below matters.

### 3.1 The token system survives untouched

This is the good news. `src/index.css` was deliberately built in two layers,
and `@theme inline` is only the *mapping* onto Tailwind utilities. Removing
Tailwind removes the mapping, not the tokens.

`src/app/globals.css` keeps, verbatim:

- the `:root` brand palette (`--pnt-*`, `--brand-discord`, tier colors)
- the semantic dark tokens on `:root`
- **both** light blocks — `@media (prefers-color-scheme: light)` scoped to
  `:root:not([data-theme='dark'])`, and `:root[data-theme='light']`. They are
  duplicated on purpose and must stay in sync, exactly as today.
- the radius scale and font-family variables (moved out of `@theme inline` into
  plain `:root` declarations)
- `.link-internal` / `.link-external` / `.cursor-internal` / `.cursor-external`
- `.protected-email` and its `::before` separators
- `.article--full` overrides
- the Leaflet overrides, **doubled selectors intact**
- the keyframes and the `prefers-reduced-motion` block

Deleted: the `@import 'tailwindcss'` line and the entire `@theme inline` block.

Components then consume `var(--accent)` directly in their module CSS instead of
`text-accent`. The rule from `CLAUDE.md` — **never reference a `--pnt-*` value
or a raw hex in a component** — is unchanged and now easier to enforce, since a
module file can be grepped for `#`.

### 3.2 ⚠️ Replace Preflight *first*

Removing Tailwind removes its Preflight reset. Preflight is doing more than it
looks like:

- `box-sizing: border-box` on everything
- zeroed `margin`/`padding` on `h1`–`h6`, `p`, `ul`, `ol`, `blockquote`, `figure`
- `list-style: none` on `ul`/`ol`
- `font: inherit` on `button`, `input`, `select`, `textarea`
- `display: block; max-width: 100%` on images and other replaced elements
- `border-style: solid; border-width: 0` so `border` utilities work
- headings set to `font-size: inherit; font-weight: inherit`

Drop it without a replacement and *every* heading, list, and button on the site
changes size and spacing at once — and you will spend the rest of Part B
chasing those changes into individual files, unable to tell them apart from
genuine conversion mistakes.

**Write the equivalent reset into `globals.css` before converting a single
component**, then confirm the still-Tailwind site looks unchanged with
Preflight explicitly disabled. Only then start converting. `modern-normalize`
plus the list/heading/button rules above is a good starting point.

### 3.3 Conventions

One `Component.module.css` beside each `Component.jsx`. Class names are local
and semantic (`.root`, `.title`, `.rail`), not utility-shaped — the point of
moving is to stop naming things after their properties.

Add a tiny `cx` helper (or `clsx`, ~200 bytes) for conditional composition;
the `[a, b && c].filter(Boolean).join(' ')` idiom used throughout the model
works fine as-is but reads better as `cx(a, b && c)`.

**Variant props keep their exact shape.** `Button`'s `VARIANTS`/`SIZES`,
`Tag`'s `TONES`/`SIZES`, and `Card`'s `interactive` are already lookup objects
of class strings — they become lookup objects of module class names, and the
component body does not change at all:

```js
import s from './Button.module.css'
const VARIANTS = { primary: s.primary, alt: s.alt, secondary: s.secondary, ghost: s.ghost }
```

**Two documented Tailwind bugs disappear.** `CLAUDE.md` records that
`ImagePlaceholder`'s `className` had to land on an outer wrapper, and that
`Tag` needed a `size` prop rather than a `className` override, both because
Tailwind resolves conflicting utilities by CSS source order. Under CSS Modules
specificity is explicit and neither hazard exists. Keep both APIs anyway —
they are better APIs — but the comments explaining *why* should be updated so
the next reader isn't looking for a bug that is gone.

### 3.4 Breakpoints

Tailwind's defaults, which the model uses throughout:

| Prefix | Min width | Uses |
|---|---|---|
| `sm:` | 640px | 23 |
| `md:` | 768px | 10 |
| `lg:` | 1024px | 35 |
| `xl:` | 1280px | 7 |

CSS custom properties **cannot** be used in media query conditions, so these
must be literal values in each module — or defined once with
`postcss-custom-media` and referenced as `@media (--lg)`. Given 75 usages
spread over 42 files, `postcss-custom-media` is worth the one dependency.

Two places have hard breakpoint dependencies that must not drift:

- `Article.jsx` hardcodes `const DESKTOP_QUERY = '(min-width: 1024px)'` in JS
  and pairs it with `lg:` classes in the markup. The JS constant and the CSS
  breakpoint must stay equal or the rail layout silently breaks.
- `Navbar.jsx`'s two-stage collapse depends on `lg` (1024) and `xl` (1280)
  exactly as specified by PNT.

### 3.5 Idiom translation

The conversions that are not one-to-one obvious:

| Tailwind | CSS |
|---|---|
| `border-accent/40` | `border-color: color-mix(in srgb, var(--accent) 40%, transparent)` |
| `bg-accent-wash` | `background: var(--accent-wash)` (already a token) |
| `space-y-3` | `> * + * { margin-block-start: 0.75rem }` |
| `divide-y` | `> * + * { border-block-start: 1px solid var(--border) }` |
| `motion-reduce:hover:translate-y-0` | the existing global `prefers-reduced-motion` block, plus a scoped `@media` where the global `transition-duration` override isn't enough |
| `aspect-[1440/839]` | `aspect-ratio: 1440 / 839` |
| `text-[11px]` | `font-size: 11px` |
| `max-w-[420px]` | `max-inline-size: 420px` |
| `transition-[opacity,transform]` | `transition-property: opacity, transform` |

Arbitrary-value classes (`[1180px]`, `[80vh]`, `[0.95em]`, `[290px]`, …) all
become ordinary declarations and get *easier* to read.

### 3.6 Tailwind class names leaking into data

`src/constants/index.js:555-559` ships Tailwind class names as data:

```js
export const PARTNER_TIERS = {
  operating: { label: 'Operating Partner', className: 'text-accent', bold: false },
  ...
}
```

Replace `className` with a semantic `tone` key (`'accent'`, `'alt'`, `'bronze'`,
`'silver'`, `'gold'`) that the About page maps to a module class. Constants
should not know how anything is styled. This is the only instance of the leak
in the repo — verify with a grep for `className` under `src/data/` and
`src/constants/` before declaring it clean.

### 3.7 Conversion order

Bottom-up, so each layer is stable before the layer above it depends on it:

1. `globals.css` — tokens, reset, cursors, protected email, Leaflet, keyframes
2. **Primitives** — `Card`, `Button`, `Tag`, `Icon`, `SectionHeader`,
   `PageHeader`, `Wordmark`, `ImagePlaceholder`, `BigNumber`, `CountUp`,
   `Reveal`, `Carousel`, `ProtectedEmail`
3. **Layout chrome** — `Navbar` (the two-stage collapse), `Footer`, `NewsBar`,
   `ContactPopup`, `RootLayout`
4. **`Article.jsx`** — on its own, because of §3.8
5. **Feature components** — `GradeRange`, `ProfileCard`, `ProfileModal`,
   `SearchPanel`, `PntMap`, `DiscordWidget`
6. **Pages** — simplest first: Policies, Terms, Contribute, Home, About,
   Impact, Curriculum, Leadership, Project Groups, Volunteer, Programs,
   Dashboard
7. **Only now:** remove `@import 'tailwindcss'`, drop `tailwindcss` and
   `@tailwindcss/vite`/`@tailwindcss/postcss` from `package.json`

Tailwind and CSS Modules coexist happily, so the site is shippable at every
step of 1–6. Do not remove Tailwind early.

### 3.8 `Article.jsx` deserves its own pass

The article grid is the most fragile layout in the codebase, and `CLAUDE.md`
lists three non-obvious properties that hold it together. All three must
survive verbatim:

1. At `lg+` the rail cell is `h-0` and its contents are absolutely positioned,
   so a tall image cannot size the grid row and gap the prose.
2. `useRailLayout` measures after paint and pushes rail items down so they
   cannot overlap, then sets a `minHeight` on the grid.
3. The grid is `content-start`. Without it, that `minHeight` is distributed
   across the auto-sized rows and gaps the prose — the exact bug it was added
   to fix.

`useRailLayout` reads `rail.parentElement.offsetTop` and depends on the grid
container being the `offsetParent`. Under CSS Modules, keep `position: relative`
on the grid container and **do not** introduce a `transform` on any ancestor —
this is also why `Reveal` is deliberately not applied inside `ArticleSection`.

Convert this file, then test at 1023px, 1024px, and 1440px with a tall figure
adjacent to a short paragraph run.

> **Playwright MCP:** `browser_resize` to each width, then `browser_snapshot`
> or a screenshot, is a quick way to catch the rail overlapping the prose
> without opening devtools by hand each time.

### 3.9 Automating the boring part

Full automation is not realistic — conditional classNames, variant lookup
objects, and arbitrary values all need judgment. Semi-automation is worth it:

Write a Node script that, per file, extracts every string literal in a
`className` position, splits on whitespace, and emits a report of the distinct
utilities used. That gives a per-file checklist to convert against and a
sitewide frequency table showing which utilities are worth a shared class.

> **⚠️ Encoding.** `CLAUDE.md` records that a bulk find-and-replace done with
> Windows PowerShell 5.1 `Get-Content`/`Set-Content` double-encoded every
> non-ASCII character and corrupted 83 files, which then had to be reversed
> byte by byte. **This migration is exactly that kind of bulk edit.** Use Node
> for every scripted rewrite, or pass `-Encoding utf8` explicitly to both read
> and write. Check `git diff --stat` for unexpectedly wide diffs after any
> scripted pass.

### ✅ Checkpoint B

No `tailwindcss` in `package.json`. No `className="…"` utility strings left
(grep for `text-`, `bg-`, `flex `, `px-`). Every page matches the pre-migration
screenshots in both themes at 640 / 768 / 1024 / 1280 / 1440px. Article rails
land correctly. Custom cursors still work on content links only.

> **Playwright MCP:** loop `browser_resize` over the five widths and
> `browser_take_screenshot` each page in both themes (toggle via
> `ThemeToggle`, or set `data-theme` with `browser_evaluate`) to build the
> before/after comparison set instead of doing it manually per page.

---

## 4. Part C — Google Sheets → SQL

### 4.1 Scope: what actually moves

PNT keeps a dozen spreadsheets. **Most of them should stay in Sheets** — they
are a working surface for humans, not a data source for the site. Only what
the *website reads* needs a database.

| Source | Move to SQL? | Why |
|---|---|---|
| Program Bookings sheet | ✅ **Yes** | Drives the Programs page. Highest value. |
| Hours Request Form responses | ✅ **Yes** | Drives the Dashboard. Per-user, needs auth. |
| Signup Sheet | ⚠️ Partially | Only if signups move in-house; otherwise the signup link is enough. |
| Locations / venues | ✅ **Yes** | Currently split between `constants/index.js` and `data/venueCoordinates.js`, which `LAUNCH_READINESS.md` flags as a sync hazard. One table fixes it. |
| Courses (`data/courses.js`) | 🟡 Optional | 22 rows, changes rarely, benefits from code review. Reasonable to keep in the repo. Move it if PNT wants non-developers editing it. |
| Leadership / Project Groups | ❌ No | The brief explicitly says these are hand-maintained. Leave in `src/data/`. |
| Project Group Tracker, Long-Term Plan, meeting notes, Curriculum Audit Log, Website Team Info | ❌ No | Internal working documents. They stay linked from the Dashboard, not ingested. |

### 4.2 Schema

Postgres. Names are `snake_case`; the app layer maps to the camelCase shapes
the components already expect, so **no component prop changes**.

```sql
CREATE TABLE regions (
  id          serial PRIMARY KEY,
  code        text NOT NULL UNIQUE,        -- 'US-1'
  label       text NOT NULL UNIQUE         -- 'San Diego (US 1)'
);

CREATE TABLE venues (
  id          serial PRIMARY KEY,
  name        text NOT NULL,
  address     text NOT NULL,
  region_id   integer REFERENCES regions(id),
  latitude    double precision,
  longitude   double precision,
  is_online   boolean NOT NULL DEFAULT false,
  UNIQUE (name, address),
  -- An online venue has no region and no coordinates; a physical one must
  -- have both, or it silently vanishes from the map.
  CONSTRAINT venue_geo CHECK (
    is_online OR (latitude IS NOT NULL AND longitude IS NOT NULL AND region_id IS NOT NULL)
  )
);

CREATE TABLE subjects (
  id          smallint PRIMARY KEY,        -- 1..5, the leading digit of a course code
  key         text NOT NULL UNIQUE,        -- 'engineering'
  label       text NOT NULL                -- 'Engineering'
);

CREATE TABLE courses (
  id                serial PRIMARY KEY,
  code              text NOT NULL UNIQUE,  -- '1.1'
  subject_id        smallint NOT NULL REFERENCES subjects(id),
  title             text NOT NULL,
  description       text NOT NULL,
  sequential        boolean NOT NULL,
  grade_ok_low      smallint NOT NULL CHECK (grade_ok_low    BETWEEN 0 AND 12),
  grade_ok_high     smallint NOT NULL CHECK (grade_ok_high   BETWEEN 0 AND 12),
  grade_ideal_low   smallint NOT NULL CHECK (grade_ideal_low  BETWEEN 0 AND 12),
  grade_ideal_high  smallint NOT NULL CHECK (grade_ideal_high BETWEEN 0 AND 12),
  -- The invariant from CLAUDE.md, now enforced by the database: the ideal
  -- range sits STRICTLY inside the OK range, so all four bounds are distinct.
  -- That is what lets GradeRange put every label on one row.
  CONSTRAINT grade_strict_subset CHECK (
    grade_ok_low <= grade_ideal_low - 1 AND grade_ok_high >= grade_ideal_high + 1
  )
);

CREATE TABLE course_materials (
  course_id   integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  material    text NOT NULL,               -- 'Screen', 'Computers', …
  optional    boolean NOT NULL DEFAULT false,
  PRIMARY KEY (course_id, material)
);

CREATE TABLE course_tags (
  course_id   integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  tag         text NOT NULL,               -- 'NEW' | 'MOST POPULAR' | 'STUDENT FAVORITE'
  PRIMARY KEY (course_id, tag)
);

CREATE TABLE programs (
  uid         uuid PRIMARY KEY,            -- the sheet's existing UID column
  course_id   integer NOT NULL REFERENCES courses(id),
  venue_id    integer NOT NULL REFERENCES venues(id),
  date        date NOT NULL,
  session     text NOT NULL,               -- 'Day 1' … 'Day 6'
  start_time  time NOT NULL,
  end_time    time NOT NULL,
  min_grade   smallint NOT NULL CHECK (min_grade BETWEEN 0 AND 12),
  max_grade   smallint NOT NULL CHECK (max_grade BETWEEN 0 AND 12),
  signup_url  text,
  published   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT program_times  CHECK (end_time > start_time),
  CONSTRAINT program_grades CHECK (min_grade <= max_grade)
);

CREATE INDEX programs_date_idx  ON programs (date);
CREATE INDEX programs_venue_idx ON programs (venue_id);
```

Notes on `programs`:

- `min_grade`/`max_grade` are denormalized from the course on purpose. The
  brief states every instance of a course carries the same range, so these
  *could* be derived — but storing them lets a one-off program advertise a
  narrower range without editing the catalog. Enforce consistency in the import
  script, not with a constraint.
- `published` gives PNT a draft state, which a spreadsheet never had.
- Keep `uid` as the primary key rather than a serial: it is the natural key the
  sheet already carries, which makes the importer idempotent for free.

The volunteer side, needed for the Dashboard:

```sql
CREATE TYPE hour_verdict AS ENUM ('approved', 'unverified', 'denied');

CREATE TABLE departments (
  id          serial PRIMARY KEY,
  code        text NOT NULL UNIQUE,        -- '1', 'A', 'B', 'C', 'D', 'L', 'OTHER'
  label       text NOT NULL                -- '1 - Curriculum'
);

CREATE TABLE members (
  id          serial PRIMARY KEY,
  google_sub  text UNIQUE,                 -- OAuth subject; null until first sign-in
  email       citext NOT NULL UNIQUE,
  full_name   text NOT NULL,
  first_name  text NOT NULL,
  joined_on   date,
  is_active   boolean NOT NULL DEFAULT true
);

CREATE TABLE member_departments (
  member_id     integer NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  department_id integer NOT NULL REFERENCES departments(id),
  PRIMARY KEY (member_id, department_id)
);

CREATE TABLE hour_requests (
  id             bigserial PRIMARY KEY,
  member_id      integer NOT NULL REFERENCES members(id),
  hours          numeric(5,2) NOT NULL CHECK (hours > 0),
  verdict        hour_verdict NOT NULL DEFAULT 'unverified',
  department_id  integer NOT NULL REFERENCES departments(id),
  worked_on      date NOT NULL,
  classification text NOT NULL,            -- 'Teaching Students', …
  description    text,
  confirmer      text,
  evidence_link  text,
  logged_at      timestamptz NOT NULL,     -- time of LOGGING, not of volunteering
  submitted_email citext NOT NULL          -- address used on the form; may differ
);

CREATE INDEX hour_requests_member_idx ON hour_requests (member_id, worked_on DESC);
```

**`HOURS_COUNTED` stays derived**, exactly as in `src/data/dashboard.js` —
approved plus unverified, excluding denied — as a SQL view or a query, never a
stored column. The model's reasoning holds: a stored total can drift from the
breakdown displayed beside it.

```sql
CREATE VIEW member_hours_summary AS
SELECT member_id,
       SUM(hours) FILTER (WHERE verdict <> 'denied') AS hours_counted,
       SUM(hours) FILTER (WHERE verdict = 'approved') AS approved,
       SUM(hours) FILTER (WHERE verdict = 'unverified') AS unverified,
       SUM(hours) FILTER (WHERE verdict = 'denied') AS denied
FROM hour_requests GROUP BY member_id;
```

### 4.3 What the schema fixes for free

- **The venue/coordinate sync hazard.** `LAUNCH_READINESS.md` flags that
  `LOCATIONS` (in constants) and `venueCoordinates.js` must be kept in sync or
  new venues go missing from the map. One `venues` table with a `CHECK` makes
  that structurally impossible.
- **Geocoding.** The one-time geocoding pass becomes an `UPDATE` against
  `venues`, and the `venue_geo` constraint refuses to accept a physical venue
  without coordinates — so the "accurate to the neighborhood, not the building"
  problem can be tracked and closed per row rather than per file.
- **The grade-range invariant** moves from a comment in `courses.js` to a
  database constraint.

### 4.4 Migrating the data out of Sheets

**Do not** read Google Sheets live at request time. It is rate-limited, needs
credentials on the server, has no schema, and makes every page load depend on
Google being up. Import once, then make the database the source of truth.

1. **Export.** File → Download → CSV, one file per sheet, committed to a
   throwaway `migration/` directory (not to the repo's `public/`).
2. **Write `scripts/import-sheets.mjs`.** Parse with PapaParse (already a
   dependency), normalize, and upsert idempotently by natural key —
   `programs.uid`, `members.email`, `venues (name, address)`. Idempotent means
   you can re-run it after fixing a mapping bug without producing duplicates.
3. **Expect these specific messes.** Every one of them is normal for a
   spreadsheet that humans have edited for two years:
   - dates serialized by the editor's locale (`10/29/2025` vs `2025-10-29` vs a
     Sheets serial number like `45959`)
   - times as fractional days (`0.5416666` = 13:00)
   - blank cells that are sometimes `''`, sometimes a single space
   - trailing whitespace and inconsistent casing in names and emails
   - the same venue spelled several ways — build an explicit alias map rather
     than fuzzy-matching, so the mapping is reviewable
   - region strings containing parentheses (`San Diego (US 1)`) that must
     resolve to a `regions.code`
   - hours entered as `2:30` instead of `2.5`
4. **Report, don't guess.** The importer should fail loudly on any row it
   cannot map and print a summary — rows read, rows inserted, rows rejected and
   why. Run it against a scratch database until the rejected count is zero and
   PNT has reviewed the alias map.
5. **Keep the seeded generator.** Repoint `scripts/generate-programs-csv.mjs`
   to seed the *development* database instead of writing a CSV. Local dev keeps
   its deterministic 300 rows and nobody develops against production data.
6. **Cut over in a transaction.** Import, verify counts against the sheet, then
   flip the fetch. Keep `public/data/programs.csv` in the repo as a fallback for
   one release, then delete it along with the PapaParse dependency.

### 4.5 Serving it: backend endpoints, frontend consumption

With the split in §1.5, this divides cleanly. **The backend owns every query.
The frontend owns every round trip to the backend.**

#### Backend endpoints

Keep the surface small and shaped by what the pages actually need, not by the
tables:

| Endpoint | Purpose |
|---|---|
| `GET /v1/programs?startDate&endDate&grade&subjects&region` | Program search, already grouped by venue |
| `GET /v1/venues` | Venue list with coordinates, for map bootstrapping |
| `GET /v1/members/me/hours?from&to` | The signed-in member's hours + breakdowns |
| `POST /v1/hours` | Hours submission (§4.6) |
| `GET /health` | Liveness — checks it can reach Postgres, not just that it booted |

**Push every filter into SQL.** The current client-side `matches()` becomes a
`WHERE` clause: grade → `min_grade <= $1 AND max_grade >= $1`; subject → a join
on `courses.subject_id`; region → `venues.region_id`, with `Online` handled as
`venues.is_online = true` (matching `ONLINE_REGION` today).

**Group by venue in the backend, not the frontend.** Several programs share a
library, and stacked markers make all but the top one unclickable. Returning
`[{ venue, coordinates, programs: [...] }]` means the map component receives
exactly what it plots, and the grouping rule lives in one place. `json_agg` per
venue does it in a single query.

**Coordinates come from the `venues` join**, so `src/data/venueCoordinates.js`
is deleted from the frontend.

#### Frontend consumption

- **Programs.** The Search button calls a thin Next Route Handler at
  `app/api/programs/route.ts`, which forwards to the backend with the service
  token and returns the JSON unchanged. Search is an explicit user action, so a
  round trip is expected, and this scales past 300 rows where shipping the
  whole table to the browser does not.
- **Dashboard.** A Server Component. It resolves the session, then calls
  `GET /v1/members/me/hours` **with the user's identity**, never with a member
  id taken from the client — see §4.7 for how identity crosses the boundary.
  The date-range inputs and the Recalculate button, currently inert by design,
  become real query parameters.
- **One API client module**, `src/lib/api.ts`, is the only place `fetch` to the
  backend appears. It attaches the service token, sets a timeout, parses
  against the shared contract types, and throws a typed error. Nothing else in
  the frontend should know the backend's URL.

#### Failure handling is now the frontend's job

A separated backend can be unreachable while the site is perfectly healthy.
Decide the behavior per page rather than letting an unhandled rejection produce
a 500:

- **Programs** — show the search panel with an inline "couldn't reach the
  program database, try again" state. The map and page chrome still render.
- **Dashboard** — an explicit error state; never a silent zero. "0 hours" and
  "we couldn't load your hours" mean very different things to a volunteer
  checking their graduation requirement.
- **Everything else** — unaffected, because static content never leaves the
  frontend (§1.5).

Set an explicit timeout (5s is generous for a local-network hop) and **do not
retry non-idempotent writes**. Next's `error.tsx` boundaries catch what gets
past this.

#### Connection pooling — in the backend, and simple

`DATABASE_URL` and the pool live only in the backend, which is one long-lived
Node process. An ordinary `pg` `Pool` of 10–20 connections in a module-level
singleton is correct; none of the serverless pooling machinery (Neon's HTTP
driver, Supabase's pgBouncer, Hyperdrive) is needed.

- **Instantiate the pool once**, exported from `src/db/index.ts` *in the
  backend repo*. Guard it on `globalThis` in dev so hot reload doesn't leak a
  pool per edit.
- **If the backend ever runs more than one instance**, revisit this with
  everything in Appendix A.5.

#### Secrets

| Variable | Lives in | Notes |
|---|---|---|
| `DATABASE_URL` | Backend only | Never in the frontend's environment, in any form |
| `API_BASE_URL` | Frontend | Internal hostname; not `NEXT_PUBLIC_` |
| `API_SERVICE_TOKEN` | Frontend + backend | Shared secret; rotate on volunteer turnover |
| `AUTH_SECRET`, Google OAuth client secret | Frontend | Sessions are the frontend's (§4.7) |

**Note the build-time/runtime split.** `NEXT_PUBLIC_`-prefixed variables are
inlined into the client bundle at `next build`, so they are baked into the
image and cannot be changed by restarting the container. Server-only variables
are read at runtime and can. Keep every secret server-side, and never reach for
`NEXT_PUBLIC_` to "fix" an undefined variable — on this architecture that
mistake publishes the backend token to every visitor.

Nothing in `src/constants/index.js` — imported by client components — may ever
hold a credential.

### 4.6 Writes: the Hours Request Form

Hours arrive today through a Google Form. Replacing it immediately is
unnecessary risk. Bridge it in two stages:

1. **Keep the Form.** Add an Apps Script `onFormSubmit` trigger that POSTs the
   response to the **backend's** `POST /v1/hours`, authenticated with a shared
   secret in a header — not to the frontend, which has no business touching
   writes it did not originate. The database stays current, volunteers notice
   nothing, and the Sheet keeps working as a backup during the transition.

   This is the one case where something other than the frontend calls the
   backend, so the backend needs a second credential for it. Give Apps Script
   its own token scoped to that single endpoint, so leaking it from a Google
   account cannot read anyone's hours.
2. **Later, replace it** with a native authenticated page that writes directly.
   Only worth doing once sign-in exists and members are actually using the
   Dashboard.

### 4.7 Authentication

Required before the Dashboard shows anything real. `LAUNCH_READINESS.md`
already scopes this; the migration supplies the missing server half.

- **Auth.js (NextAuth) with the Google provider.** A Google Cloud project with
  an OAuth 2.0 client, `projectnextech.org` as an authorized origin, and the
  Next callback URL registered.
- **Authorize against `members`.** On sign-in, look up `google_sub`, falling
  back to `email` on first sign-in and then storing the `sub`. An account with
  no matching row is not a volunteer — decide deliberately what it sees
  (recommendation: a "your account isn't linked yet" page with a contact link,
  not a 403).
- Session in an httpOnly cookie, read with `await cookies()` — async in Next 16.
- **Sessions live in the frontend; the backend trusts only the service token.**
  Auth.js and the Google OAuth secret belong to the Next app. The backend is
  never a public OAuth endpoint.
- **Identity crosses the boundary explicitly.** The frontend resolves the
  session, then calls the backend as `GET /v1/members/me/hours` with the
  member identity carried in a **short-lived signed token** (a JWT the frontend
  mints, the backend verifies against a shared key) — not as a plain
  `?memberId=` on a service-token request.

  The distinction matters: with the service token alone, *any* bug that lets a
  member id reach that call becomes a full read of every volunteer's records.
  A signed identity token means the backend can verify who the request is for
  and refuse to answer for anyone else, so the frontend cannot be tricked into
  asking the wrong question.
- **Guard in a Data Access Layer, not in `proxy.ts`.** Next 16 renames
  Middleware to Proxy, and its own docs are explicit that Proxy is for
  *optimistic* checks only and "should not be your only line of defense".
  Put the real authorization next to the data: a `src/db/dal.ts` whose every
  exported function resolves the session itself and scopes the query to that
  member. `proxy.ts` may additionally bounce signed-out visitors away from
  `/dashboard` for a faster redirect, but it is a convenience, not the control.
- `SiteProvider`'s stubbed `isLoggedIn` boolean and the `STUB_USER` constant
  are deleted at this point, along with the "opens google.com in a new tab"
  behavior. The Navbar's "Hi, Nexus" reads the real session.

### ✅ Checkpoint C

Programs returns real rows from SQL with no CSV in `public/`. A signed-in
volunteer sees their own hours and cannot see anyone else's. The importer runs
clean and idempotently. `venueCoordinates.js` and PapaParse are gone.

> **Playwright MCP:** useful here for the IDOR check specifically — sign in as
> member A (`browser_navigate` through the real Google OAuth flow or a seeded
> test session), snapshot the Dashboard, then repeat as member B, and diff the
> two to confirm neither sees the other's hours. It can also drive the
> Programs search panel end-to-end (fill filters, submit, check the result
> list) against a seeded dev backend.

---

## 5. Part D — Keeping the two services in step

Building the frontend and backend separately is the requirement. **Shipping
them without checking them together is the failure mode**, and it is a quiet
one: both repos green, both deploys clean, and the Dashboard blank because a
field was renamed. Everything in this part exists to make that impossible to
do by accident.

### D.1 The contract

**One source of truth for request and response shapes, consumed by both
sides.** Recommendation: a small package — `@pnt/api-contract` — holding Zod
schemas and the types inferred from them.

```
packages/api-contract/          (or a separate small repo, published to a
  src/programs.ts               private registry or pinned by git SHA)
  src/hours.ts
  src/index.ts
```

- **The backend validates every response against the schema before sending**,
  and every request body on the way in. Fastify's JSON-schema support does the
  request half natively.
- **The frontend parses every response through the same schema** in
  `src/lib/api.ts`. A field that changed type fails loudly at the boundary with
  a useful message, instead of surfacing as `undefined` three components deep.
- **Both pin an exact version.** A caret range reintroduces the drift the
  package exists to prevent.

Generating types from an OpenAPI spec is the alternative and is fine; the
reason to prefer Zod here is that the same definition does runtime validation,
so the contract is enforced rather than merely documented.

**Rule: the contract package is the only thing the two repos share.** Not
utilities, not constants, not components. The moment it becomes a junk drawer,
the services are coupled again.

### D.2 Local development

Both services plus a database, one command, from either repo:

```yaml
# compose.dev.yaml — lives in the frontend repo, backend mounted from a sibling
services:
  db:
    image: postgres:17-alpine
    environment: { POSTGRES_PASSWORD: dev, POSTGRES_DB: pnt }
    ports: ['5432:5432']          # exposed in dev only, for psql and GUIs
  api:
    build: ../ProjectNexTech-api
    environment:
      DATABASE_URL: postgres://postgres:dev@db:5432/pnt
      API_SERVICE_TOKEN: dev-token
    depends_on: [db]
    ports: ['4000:4000']
  web:
    build: .
    environment:
      API_BASE_URL: http://api:4000
      API_SERVICE_TOKEN: dev-token
    depends_on: [api]
    ports: ['3000:3000']
```

**Seed the dev database from the repurposed generator.**
`scripts/generate-programs-csv.mjs` becomes a backend seed script (§4.4 step 5),
so a fresh `docker compose up` gives any contributor 300 deterministic programs
and a working Programs page with no access to production data.

A frontend-only contributor — most of Part B is frontend-only — should be able
to run `npm run dev` against a **deployed staging backend** instead, without
Docker at all. Support both; the CSS work should not require anyone to run
Postgres.

### D.3 The integration check

This is the "verified to work together" requirement made concrete. Three
layers, cheapest first:

**1. Contract tests (per repo, every commit).** The backend asserts its
handlers produce data matching the contract schemas. The frontend asserts its
API client parses fixture responses generated *from those same schemas*. These
run without the other service present, which is what keeps the builds
independent — and they catch the majority of drift.

**2. Integration tests (on every PR to either repo).** Boot the compose stack
in CI, seed it, then run a small suite against the real pair:

- `GET /health` on the backend returns healthy *and* reports database
  connectivity
- Programs search with a known filter returns the expected count from the seed
- The frontend's `/api/programs` route returns the same payload end-to-end
- Dashboard for a seeded member returns that member's hours
- **Dashboard for member A never returns member B's rows** — the IDOR check
  from §4.5, as an automated test rather than a code-review habit
- Backend unreachable → the Programs page still renders with its error state

Keep this suite small and behavioral. Ten tests that run in ninety seconds get
kept; a hundred that take fifteen minutes get skipped.

> **Playwright MCP:** a reasonable way to author/prototype a couple of these
> browser-level checks interactively (Programs search against the seeded
> stack, the frontend/backend round trip) before they're written up as a
> proper automated test — not a replacement for the CI suite itself.

**3. Post-deploy smoke test (after every production deploy of either
service).** The same handful of assertions against production, plus a real page
load. Failure notifies whoever deployed.

> **Cross-repo CI.** A backend PR should be able to run its integration tests
> against the frontend's `main`, and vice versa. Simplest version: each repo's
> workflow checks out the sibling repo at `main` and builds it. When the
> contract package version differs between them, that is itself the signal to
> stop and reconcile.

### D.4 Deploy order and version skew

The two services will be deployed at different times. That is the point of
separating them, and it means **every contract change must be backwards
compatible for at least one release.**

**The rule: expand, migrate, contract.**

1. **Expand** — backend adds the new field alongside the old, and deploys.
   Nothing breaks; the frontend ignores what it does not know about.
2. **Migrate** — frontend starts using the new field, and deploys.
3. **Contract** — backend removes the old field in a *later* release, once no
   deployed frontend reads it.

Doing this in one step — rename a field on both sides, deploy both — breaks the
site for the window between the two deploys, and breaks it entirely if one
deploy fails.

**Deploy the backend first**, always. An expanded backend is compatible with
the old frontend; the reverse is not true.

`/v1/` in the path is there so a genuinely incompatible change can be made
without a flag day. Do not add `/v2/` casually — the expand/migrate/contract
cycle handles almost everything.

Version skew *within* the frontend (a client holding stale JS after a deploy)
is a separate problem, handled by `deploymentId` — Appendix A.5.

### D.5 Health and monitoring

- **`GET /health` on the backend must check Postgres**, not just return 200
  because the process is up. A backend that cannot reach its database is not
  healthy, and the distinction is the whole point when they are on separate
  hosts.
- **The frontend should expose its own `/api/health`** that reports whether it
  can reach the backend. This is what tells you which of the two is broken at
  3am, without SSH.
- **Uptime monitoring on both**, from outside both hosts. A free checker
  hitting the two health endpoints every five minutes is enough and is
  materially better than finding out from a volunteer.
- **Log the backend's request duration.** The network hop is new; if a page
  feels slow after the split, this is the first place to look.

---

## 6. Part E — What must not regress

Every item here is documented in `CLAUDE.md` as load-bearing, and every one is
easy to destroy during a mechanical rewrite. Re-verify each after Part B.

- **Article rail layout** — the three properties in §3.8. Test with a tall
  figure beside a short paragraph run, at 1023 / 1024 / 1440px.
- **Leaflet overrides** — doubled `.leaflet-container` selectors, and the
  `z-index: 0` that stops the map painting over the profile modal.
- **`ProtectedEmail`** — fragments in reversed DOM order, flipped with
  `row-reverse`, separators as pseudo-element content, `user-select: none`.
  Verify by checking `textContent` in devtools: the address must not be
  contiguous. And it must never be the only route to an inbox — the Contact
  popup stays.
- **Contact popup positioning** — renders *inside* the sticky `<header>` with
  `top-full`, closes on document `pointerdown` (not a backdrop), and the
  toggle button keeps `data-contact-toggle`.
- **Navbar two-stage collapse** — `≥xl` inline, `lg–xl` utility items folded,
  `<lg` everything folded.
- **Alternating orange/blue** — driven by list position in three places
  (`BigNumber`'s `index`, `ArticleSection`'s injected `tone`, Curriculum's
  subject index), never hand-assigned. `Highlight.isHighlight` and
  `Component.rail = true` are static markers the partitioners depend on; both
  survive a CSS change but neither survives a careless refactor.
- **Reduced motion** — the global block plus per-component guards. `Reveal` and
  `CountUp` handle it in their state initializers, not in effects, because the
  lint rules reject the obvious spelling. Don't "tidy" them.
- **Custom cursors** — content links and buttons only. Navbar, footer, and
  Contact popup keep the normal pointer.
- **Small radii only** — 1/2/4/6px. No bubbly corners.
- **"Project NexTech" is always set in Inter**, whatever the surrounding font.
- **Both light-token blocks stay in sync** (§3.1).
- **The Volunteer slideshow's `calc(56.25% + 30px)` padding** — the Slides
  control bar is a fixed pixel height, so no pure aspect ratio works.

> **Playwright MCP:** several of these are scriptable rather than eyeballed —
> `browser_evaluate` to read `document.querySelector('.protected-email')
> .textContent` and confirm the address isn't contiguous, `browser_click` the
> contact toggle and a document-level click to confirm it closes, and
> `browser_snapshot`/screenshot the Navbar at `lg`/`xl`/below-`lg` widths for
> the two-stage collapse. Reduced-motion needs `browser_navigate` with the
> emulated media feature set beforehand, which the MCP tools don't expose
> directly — that check likely stays manual or moves to a Playwright test file.

---

## 7. Suggested phasing

Mirrors this repo's existing convention: stop at each checkpoint, verify, then
continue.

| Phase | Track | Scope | Gate |
|---|---|---|---|
| 0 | Infra | Remaining decisions in §1 (§1.1 and §1.5 are closed); provision host(s), install Docker or Node 20.9+, stand up an empty Postgres | Scaffold served over HTTPS on a staging hostname |
| 1 | Frontend | Next scaffold, routes, layout, fonts, metadata — **Tailwind still on** | Checkpoint A |
| 2 | Frontend | Reset + tokens + all primitives to CSS Modules | Primitives pixel-match |
| 3 | Frontend | Layout chrome + `Article.jsx` | Rail layout verified at 3 widths |
| 4 | Frontend | All 13 pages; **remove Tailwind** | Checkpoint B |
| 5a | Backend | Contract package, schema, migrations, importer, dev seed | Importer runs clean and idempotent |
| 5b | Backend | Programs + venues endpoints, `/health`, compose stack | Contract + integration tests green (§D.3) |
| 6 | Both | Programs reads the API; delete CSV, PapaParse, `venueCoordinates.js` | Programs matches CSV results; §D.3 suite green |
| 7 | Both | Auth (frontend) + hours endpoints (backend) + Dashboard | Checkpoint C |
| 8 | Infra | DNS cutover, TLS, **backups verified by restore**, analytics, verification sweep | Live |

**The two tracks are genuinely independent through phase 5.** The frontend
track (1–4) changes nothing a visitor can see and needs no database; the
backend track (5a–5b) needs no CSS. With two people they run in parallel; with
one, do the frontend first — it is the larger body of work and the part with
the visible payoff.

**Phase 0 is worth doing properly before anything else.** Getting the stock
`create-next-app` scaffold deployed and reachable over HTTPS — no PNT code at
all — proves out Docker/Coolify, the reverse proxy, certificates, and the
deploy trigger while there is nothing to debug but infrastructure. Every later
phase then deploys the same way. **Do the same for a hello-world backend**
before phase 5a, especially if it lands on a second host: it proves the
frontend can reach it, over TLS, with a token, before any real logic depends on
that path.

**Phase 6 is the first time the two must work together**, which is why §D.3's
integration suite is a gate on it rather than a nice-to-have added later.

---

## 8. Verification sweep

Before calling it done:

- [ ] All 13 routes, plus `/discord` and a 404, in **both** themes
- [ ] Widths 375 / 640 / 768 / 1024 / 1280 / 1440px
- [ ] Deep-link refresh on every route
- [ ] `prefers-reduced-motion: reduce` — no animation anywhere
- [ ] `prefers-color-scheme` respected when the toggle is on "system"; no
      theme flash on first paint
- [ ] Article rails at 1023 / 1024 / 1440px with mixed content heights
- [ ] Leaflet chrome themed in both modes; popups clear the docked search panel
- [ ] Custom cursors on content links only
- [ ] `ProtectedEmail` address not contiguous in `textContent`
- [ ] Keyboard focus visible sitewide; tab order sane through nav and modals
- [ ] No hydration warnings; no `window is not defined` in the build log
- [ ] Bundle size compared against the model's 256 kB initial
- [ ] Lighthouse on Home, Programs, and Dashboard
- [ ] Importer re-run produces zero changes (idempotency proof)
- [ ] A second signed-in account sees only its own hours

> **Playwright MCP:** the most natural place to lean on it for this whole
> sweep — walking all 13 routes at each width/theme combination, checking
> `browser_console_messages` for hydration warnings, reading `textContent` for
> the `ProtectedEmail` check, and tabbing through focus order with
> `browser_press_key`. It's an interactive driver, though — for something that
> should run unattended on every deploy, promote the same steps into a real
> Playwright test file rather than re-running the MCP tools by hand each time.

Infrastructure, new with the VPS:

- [ ] HTTPS valid, HTTP redirects to it, certificate auto-renewal confirmed
      (not just "it works today" — force a renewal dry run)
- [ ] `www` and apex both resolve to the intended one
- [ ] Container/service restarts on reboot (`docker compose up -d` restart
      policy, or `systemctl enable`)
- [ ] Streaming works end-to-end — a `loading.tsx` actually streams rather than
      the proxy buffering it (Appendix A.3)
- [ ] Graceful shutdown: SIGTERM drains in-flight requests, drain period 10–30s
- [ ] `next/image` optimization serving from the VPS; memory stable under load
- [ ] **A database backup has been restored into a scratch database**, not
      merely taken (Appendix A.4)
- [ ] Server-only env vars absent from the client bundle — grep the built JS
      for `DATABASE_URL` and any secret value
- [ ] Firewall: only 80/443 and SSH exposed; Postgres not listening publicly

Integration, new with the frontend/backend split (§1.5, Part D):

- [ ] **Frontend contains no database driver** — grep the built output for
      `pg`, `drizzle`, and `DATABASE_URL`; all three must be absent
- [ ] Backend is not reachable from the public internet; only the frontend can
      reach it, over TLS or a private network
- [ ] `API_SERVICE_TOKEN` absent from the client bundle
- [ ] Contract package pinned to the **same exact version** in both repos
- [ ] Integration suite (§D.3) green against a freshly seeded compose stack
- [ ] **Backend stopped → Programs still renders** with its error state, and the
      rest of the site is unaffected
- [ ] **Backend stopped → Dashboard shows an error, never "0 hours"**
- [ ] Member A's session cannot retrieve member B's hours, tested against the
      running pair rather than by reading the code
- [ ] Both health endpoints report accurately, including when the database is
      down but the backend process is up
- [ ] Post-deploy smoke test runs and reports on a real deploy of each service

---

## 9. Open questions for PNT

1. ~~**Hosting**~~ — **decided**: self-hosted VPS, Coolify or manual (§1.1,
   Appendix A). The follow-on questions are operational, and they are real:
   **who owns the server**, who has SSH access when that person graduates, and
   who verifies the backups. A student org has turnover; write the answer down
   somewhere that outlives the current officers.
2. **Who edits program data** after the migration? A spreadsheet is
   self-service; a database is not. If PNT wants to keep editing in Sheets, the
   answer is a scheduled one-way sync into SQL rather than abandoning the
   database — but that decision changes phase 5.
3. **Which Google accounts may sign in** (§4.7), and what an unrecognized
   account sees.
4. **Does the Signup Sheet move in-house**, or do signup links keep pointing at
   an external flow? This decides whether `programs.signup_url` stays a plain
   column or becomes a `registrations` table.
5. **Where does the backend actually run** (§1.5) — the same VPS, a second VPS,
   or a managed Postgres with the API alongside the site? The plan works for all
   three, but the answer decides whether §A.1's separated topology is needed on
   day one or is only future-proofing.
6. **One repo or two** (§1.5). Needs answering before phase 5a, because
   retrofitting the other way is tedious.
7. Everything still open in `LAUNCH_READINESS.md` — real photography, partner
   tiers, the rosters, courses 2.1/2.2, the Donorbox slug, and the legal review
   of Terms — is unaffected by this migration and still blocks launch.

---

## Appendix A — Deploying to the VPS

Two supported paths. **Coolify is the recommendation** unless PNT specifically
wants to learn the manual stack: it gives a web UI, per-branch deploys,
automatic TLS, environment-variable management, a one-click Postgres with
scheduled backups, and log viewing — all of which someone will otherwise
hand-roll and then have to hand over to next year's officers.

The manual path is fully documented below too, because "Coolify goes away" or
"we want to understand it" are both legitimate, and the pieces are the same
either way.

### A.1 What runs, and where

Two services (§1.5), which **may or may not share a host**. Design for the
separated case; co-locating them is then just a simpler instance of it.

**Same host** — cheapest, one server to operate:

```
internet → :443 reverse proxy → :3000 next start ──┐
                                                    │ private docker network
                                  :4000 api ────────┤
                                  :5432 postgres ───┘   (neither published)
```

**Separate hosts** — the case that must work:

```
internet → :443 proxy → :3000 next start ──HTTPS──▶ :443 proxy → :4000 api
           host A                                   host B      → :5432 postgres
```

When separated, two things become mandatory rather than optional:

- **TLS between the services.** The service token crosses a network you do not
  control. Terminate TLS at host B's proxy exactly as for the public site, or
  put both hosts on a private network (a provider VPC, or WireGuard/Tailscale).
  A shared secret over plaintext HTTP across the internet is not acceptable for
  volunteer records.
- **The backend is firewalled to the frontend's address**, not open to the
  world. Postgres itself is never publicly reachable in either topology.

Next's own self-hosting guide recommends a reverse proxy in front of the Node
server rather than exposing it directly — it absorbs malformed requests,
slow-loris attacks, payload limits, and rate limiting, so the process spends
its time rendering. Coolify provides this; on the manual path it is yours to
install. **The backend needs the same treatment**, for the same reasons.

### A.2 Docker (Coolify, or plain `docker compose`)

Set `output: "standalone"` in `next.config.ts`. This traces exactly the runtime
files needed and emits a minimal `server.js`, which is what keeps the image
small instead of shipping all of `node_modules`.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',
}
```

A multi-stage Dockerfile, matching Vercel's `with-docker` example:

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* vars must be present HERE — they are inlined at build time.
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

Notes that matter:

- **`public/` must be copied explicitly.** Standalone tracing does not include
  it, and this repo's `public/` is the entire media library — 87 folders. A
  missing `COPY` here means every image on the site 404s, which looks like a
  path bug and is not one.
- `.next/static` likewise.
- Run as a non-root user.
- Do not use a custom server with standalone output — they are incompatible.

**With Coolify:** point it at the GitHub repo, choose Dockerfile build, set the
domain, add env vars in its UI, enable "deploy on push". Add Postgres as a
separate Coolify resource and connect them on an internal network so the
database is never published to the host's public interface.

**Without Coolify**, a `compose.yaml` with the app plus `postgres:17-alpine`, a
named volume for `pgdata`, `restart: unless-stopped` on both, and the database
bound to the internal network only (no `ports:` mapping for Postgres).

### A.3 Manual path (no Docker)

1. Node 20.9+ (nvm or NodeSource), plus `git`.
2. `npm ci && npm run build` on the server, or build in CI and rsync the
   `.next/standalone` output.
3. A **systemd unit** running `node server.js` (or `npm start`) with
   `Restart=always`, `EnvironmentFile=/etc/pnt/site.env` (root-owned, `0600`),
   and `WorkingDirectory` set. `systemctl enable` so it survives reboot.
4. **Caddy** is the easier reverse proxy — automatic TLS with a two-line
   config. nginx is fine if PNT already knows it, with certbot for certificates.

**If using nginx, disable response buffering or streaming breaks.** The App
Router streams; nginx buffers by default, which silently converts a streamed
page into a slow all-at-once render. Next's guide suggests emitting the header
from the app:

```ts
// next.config.ts
async headers() {
  return [{ source: '/:path*{/}?', headers: [{ key: 'X-Accel-Buffering', value: 'no' }] }]
}
```

Caddy does not buffer by default and needs nothing.

5. DNS: an `A` record for `projectnextech.org` to the VPS IP, and a decision on
   `www` (redirect to apex, or vice versa — pick one and redirect the other).
   Lower the TTL a day before cutover so a mistake is cheap to reverse.

### A.4 Database backups

**This is now PNT's responsibility and nobody else's.** It belongs to whoever
operates the backend host (§1.5), which may not be the host running the site.

#### Why this matters more than it looks

The `programs` table can be regenerated from the source spreadsheet. **The
hours records cannot.** Once volunteers rely on the Dashboard, losing that
table means losing service hours that students need for graduation
requirements, scholarship applications, and college applications — records that
in many cases exist nowhere else once the Google Form is retired.

Treat `hour_requests` and `members` as the irreplaceable data. Everything else
is convenience.

#### What to back up

| | Method | Frequency |
|---|---|---|
| **Postgres data** | `pg_dump` logical dump | Nightly, plus before every migration |
| **`.env` / secrets** | Manual, to a password manager | On change |
| **Uploaded media** | Only if media ever moves out of the repo | Nightly if so |

Application code needs no backup — it is in git. `public/media/` is committed,
so it is covered too. **The database is the only thing that exists in exactly
one place.**

#### The nightly job

A logical dump is the right choice at this size: it is a single portable file,
restorable into a different Postgres version, and small enough that
sophistication would be wasted.

```bash
#!/usr/bin/env bash
# /usr/local/bin/pnt-backup.sh
set -euo pipefail

STAMP=$(date -u +%Y%m%dT%H%M%SZ)
DEST=/var/backups/pnt
FILE="$DEST/pnt-$STAMP.sql.gz"

mkdir -p "$DEST"

# --clean --if-exists makes the dump self-contained and re-runnable.
pg_dump "$DATABASE_URL" --clean --if-exists --no-owner \
  | gzip -9 > "$FILE"

# Fail loudly if the dump is suspiciously small (empty DB, auth failure,
# pg_dump erroring into the pipe). Tune the floor once you know real sizes.
SIZE=$(stat -c%s "$FILE")
if [ "$SIZE" -lt 10000 ]; then
  echo "backup $FILE is only $SIZE bytes — aborting" >&2
  exit 1
fi

# Off-host copy. Any S3-compatible target; rclone or restic both work.
rclone copy "$FILE" "pnt-backups:pnt-db/" --immutable

# Local retention: 14 days. Remote retention is set by lifecycle policy.
find "$DEST" -name 'pnt-*.sql.gz' -mtime +14 -delete

echo "backup ok: $FILE ($SIZE bytes)"
```

In Docker, `pg_dump` runs inside the database container:

```bash
docker compose exec -T db pg_dump -U postgres pnt --clean --if-exists \
  | gzip -9 > "$FILE"
```

Schedule with cron (`0 3 * * *`) or a systemd timer. **Systemd timers are
preferable** — they log to the journal, survive missed runs with
`Persistent=true`, and report failure status, where a failing cron job is
silent by default.

#### The four rules that make it an actual backup

1. **Off-host.** A dump sitting on the same VPS is not a backup — it dies with
   the droplet, the disk, or the mistaken `rm`. Copy it somewhere with a
   different failure mode: object storage (Backblaze B2, Cloudflare R2, S3),
   or another machine.
2. **Retention with depth.** 14 daily, 8 weekly, 6 monthly. Depth matters
   because the most likely data loss is not a dead disk — it is a bad migration
   or a mistaken bulk update discovered a week later. Nightly-only retention
   means a week-old mistake has already overwritten every good copy.
3. **Monitored.** A backup job that has been failing silently for two months is
   the normal way this goes wrong. Either alert on failure (systemd
   `OnFailure=`) or use a dead-man's-switch — a free service that alerts when a
   nightly ping *stops* arriving. The dead-man's switch is stronger: it catches
   "the server is off" as well as "the job errored".
4. **Restored, not just taken.** See below.

#### Restore rehearsal — do this before launch, then twice a year

**An untested backup is a hypothesis.** Rehearse it:

```bash
# 1. Stand up a scratch database (never point this at production)
createdb pnt_restore_test

# 2. Restore the most recent off-host backup — pull it down first,
#    so the rehearsal also tests that retrieval works
rclone copy pnt-backups:pnt-db/pnt-20260826T030000Z.sql.gz /tmp/
gunzip -c /tmp/pnt-20260826T030000Z.sql.gz | psql pnt_restore_test

# 3. Verify it is real data, not an empty schema
psql pnt_restore_test -c "SELECT count(*) FROM hour_requests;"
psql pnt_restore_test -c "SELECT max(logged_at) FROM hour_requests;"
psql pnt_restore_test -c "SELECT count(*) FROM members;"

# 4. Point a local backend at it and load the Dashboard

# 5. Tear it down
dropdb pnt_restore_test
```

**Write down the date of the last successful rehearsal** somewhere the next
officers will find it. This is the single most-skipped step and the one that
determines whether the backups were real.

#### Before every migration

Migrations are the most likely cause of data loss on a site this size — more
likely than hardware failure by a wide margin.

```bash
pnt-backup.sh && npm run db:migrate
```

Make the backup a literal precondition of the migration command so it cannot be
forgotten under pressure. §A.6 covers why migrations run as a deliberate step.

#### With Coolify

Coolify has scheduled database backups built in, including S3-compatible
destinations. **Turn them on** — it removes the script, the cron entry, and the
retention logic.

It does not remove rules 3 and 4. Verify the backups are actually running,
alert if they stop, and do the restore rehearsal anyway. A managed backup you
have never restored is the same hypothesis as an unmanaged one.

#### Recovery expectations, written down

Decide and record these now, so the answer under pressure is not improvised:

- **RPO (how much data may be lost):** with nightly dumps, up to 24 hours of
  hour submissions. If that is unacceptable once the Dashboard is in real use,
  the upgrade is WAL archiving / point-in-time recovery — meaningfully more
  operational work, and worth it only if the answer to "would losing a day of
  hours be a serious problem?" is yes.
- **RTO (how long recovery takes):** provision Postgres, pull the dump, restore,
  restart the backend. Realistically well under an hour at this data size —
  *provided the rehearsal has been done at least once.*
- **Who does it**, and who has the credentials when that person has graduated.

### A.5 Only if you ever run more than one instance

Everything above assumes **one container on one VPS**, which is correct for
this site's traffic and makes several hard problems disappear: the ISR/data
cache lives on local disk and is coherent, `revalidateTag` invalidates the only
copy, and no encryption key needs sharing.

If a second instance ever appears behind a load balancer, three things break at
once and must be handled together:

- **`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`** must be set to the same value across
  instances, or Server Actions encrypted by one fail to decrypt on another
  ("Failed to find Server Action").
- **`deploymentId`** should be set for version-skew protection during rolling
  deploys, so clients don't request assets that no longer exist.
- **The cache is per-instance.** A shared `cacheHandler` (Redis) plus
  `refreshTags()` is needed, or instances serve stale content independently.

Note this now so nobody adds a second container as a "quick win" and spends a
week on mysterious action failures.

### A.6 Deploy trigger

**Two pipelines now, one per service** (§1.5), each triggered only by its own
repo. That is the point of building them separately — a CSS change must not
redeploy the API.

Simplest that works: GitHub Actions on push to `main` → SSH → `git pull`,
`npm ci`, `npm run build`, `systemctl restart <service>`. Or, with Coolify,
its own webhook, which is one checkbox.

**Deploy the backend first** whenever a change spans both — §D.4 covers why,
and the expand/migrate/contract discipline that makes independent deploys
safe.

Either way, **run `npm run lint` and `npm run build` in CI before deploying**,
not on the VPS as the first sign of a problem. The model repo's existing
workflow already does lint-then-build and is a reasonable starting point; only
the final "upload to Pages" step changes.

**Run database migrations as a deliberate step, not automatically on boot.**
With one instance the risk is small, but a migration that runs on container
start will re-run on every restart and on every rollback, which is how a bad
deploy becomes a bad database. Back up first — §A.4 makes the backup a literal
precondition of the migrate command.
