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
| 1 | Foundation — tokens, Preflight replacement, breakpoints, fonts, constants/context/data in TS, `public/`, root layout, 13 routes, `/discord` | Complete |
| 2 | Primitives → `.tsx` + CSS Modules (Card, Button, Tag, Icon, SectionHeader, PageHeader, Wordmark, ImagePlaceholder, BigNumber, CountUp, Reveal, Carousel, ProtectedEmail) | Complete |
| 3 | Layout chrome (Navbar, Footer, NewsBar, ContactPopup, ThemeToggle) + `Article.tsx` | Complete |
| 4 | Feature components + all 13 pages | Not started |
| C | Real content pass — the 177 images and the real roster from `../ProjectNexTech.org-new/` | Not started |

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
