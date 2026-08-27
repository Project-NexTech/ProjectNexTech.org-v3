# TEMPORARY: the GitHub Pages demo

**This whole document describes scaffolding that is meant to be deleted.**

The frontend is finished ahead of the backend, so PNT is parking a demo on
GitHub Pages until the API repo exists. Pages serves static files only, so the
demo is a static export — which `CLAUDE.md` and `NEXTJS_MIGRATION.md` §1.1
otherwise forbid, for good reasons that all still apply.

- **Live at:** <https://beta.projectnextech.org>
- **Deploys:** on every push to `main`, and on demand from the Actions tab
- **Revert:** [the checklist at the bottom](#reverting-the-checklist) — six
  steps, about five minutes

---

## The one design decision worth knowing

**The export is gated behind an environment variable, not switched on.**

`next.config.ts` reads `PNT_STATIC_EXPORT`, and only the Pages workflow sets
it. Every build anyone runs by hand — `npm run dev`, `npm run build`, and the
eventual VPS build — is byte-for-byte what it was before this demo existed.

The alternative was to set `output: 'export'` in the config directly. That
would have been fewer lines and considerably worse:

- `CLAUDE.md` says `output: "export"` must never be set. Setting it would have
  made that rule quietly false while still reading as true — the exact failure
  mode that produced the Phase 1 `THEME_STORAGE_KEY` bug and the Phase 3
  client-reference bug.
- A static export silently drops Server Components' server half, Route
  Handlers, sessions, and `redirects()`. Phase 5-7 work would land against a
  config that discards it **without erroring**, and the first symptom would be
  a login that does nothing.
- Reverting would mean remembering which lines were demo lines. Now it is one
  flag: with `PNT_STATIC_EXPORT` unset there is no demo.

**Verified**, not assumed: with the flag unset, `next build` produces no `out/`
directory, keeps the `/discord` 308 in `routes-manifest.json`, and resolves
`og:url` to `https://projectnextech.org`. With it set, all three change.

---

## Everything this demo added or changed

Six files. Four are new and demo-only; two are edits to existing files, and
both edits are inert unless the flag is set.

| File | New? | What |
|---|---|---|
| `.github/workflows/gh-pages-demo.yml` | new | The deploy workflow |
| `scripts/gh-pages/postbuild.mjs` | new | Writes `CNAME`, `/discord`, `.nojekyll` into `out/` |
| `GITHUB_PAGES_DEMO.md` | new | This file |
| `next.config.ts` | **edited** | `STATIC_DEMO` flag + `STATIC_DEMO_CONFIG` block |
| `src/app/layout.tsx` | **edited** | `metadataBase` reads `NEXT_PUBLIC_SITE_HOST` |
| `CLAUDE.md` | **edited** | A pointer to this file |

`public/` is untouched. That is deliberate — see "Why the CNAME is generated"
below.

### `next.config.ts`

Adds `STATIC_DEMO` and a `STATIC_DEMO_CONFIG` block that replaces
`SERVER_CONFIG` when the flag is set:

| Setting | Why |
|---|---|
| `output: 'export'` | What Pages needs. The thing the rule forbids. |
| `trailingSlash: true` | Emits `out/about/index.html` instead of `out/about.html`. Pages resolves directory indexes reliably; its extensionless-to-`.html` fallback is less predictable, and `/about/` would 404 without this. |
| `images: { unoptimized: true }` | Changes nothing today — nothing imports `next/image` (Phases 2-4 chose plain `<img>`). It is here so that reaching for `next/image` during the demo period does not fail the export with a confusing loader error. |
| **no `basePath`** | The demo is at the root of its own host. See "If the demo ever moves" below. |

The `redirects()` block only exists in `SERVER_CONFIG`, so the export drops it.

### `src/app/layout.tsx` — the only `src/` change

```ts
const SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST || ORG.domain
metadataBase: new URL(`https://${SITE_HOST}`)
```

Without this, every canonical link and OG URL on the demo would name
`projectnextech.org`, so a link shared from the demo would preview as, and
resolve to, the real site. Unset, it falls back to `ORG.domain` — today's
behavior exactly.

### `scripts/gh-pages/postbuild.mjs`

Writes three files into `out/` after the export:

- **`out/CNAME`** — binds the deployment to `beta.projectnextech.org`.
- **`out/discord/index.html`** — a meta-refresh stand-in for the `/discord`
  308, which cannot run without a server.
- **`out/.nojekyll`** — insurance. The Actions deploy path never runs Jekyll,
  so this is inert today; it matters only if Pages is ever switched to the
  older branch-based mode, where Jekyll drops `_next/` and the site comes up
  completely unstyled.

It also warns if `out/404.html` is missing, since that would silently hand
unknown paths to GitHub's error page instead of the site's.

#### Why the CNAME is generated rather than committed

A `public/CNAME` would be simpler and would also ship to the VPS, where it
means nothing. A `public/discord/index.html` would be worse: it would sit in
the tree shadowing the real 308 in `next.config.ts`, and which one wins is not
obvious from reading either file.

Generating both into `out/` — which is gitignored and rebuilt every run — keeps
`public/` clean and means the revert cannot miss them. **A placeholder that
outlives its reason is how a temporary demo becomes permanent by accident.**

---

## What is degraded on the demo, versus the VPS

Nothing here is a bug to fix. These are what "static" costs, and they are the
argument for the VPS.

| | On the demo | On the VPS |
|---|---|---|
| `/discord` | Meta-refresh: paints, then hops. A crawler sees `200`, not a permanent move. | Real `308` before any paint |
| URLs | Trailing slashes (`/about/`) | No trailing slash |
| Server Components | Run at **build** time only | Run per request |
| Route Handlers, sessions, auth | Impossible | Phases 5-7 |
| `next/image` | Would be unoptimized | Optimized |
| Data | Baked in at build; refreshing needs a redeploy | Live from the API |

**Unchanged and worth noting:** fonts are still self-hosted (16 `.woff2` in the
export, zero references to `googleapis`/`gstatic`), `/dashboard` still carries
`noindex, nofollow`, and `public/robots.txt` still disallows everything — which
is correct for a demo full of placeholder copy and already names this host.

`DiscordWidget`, the Leaflet maps, the Donorbox and Google embeds, and the
Programs CSV all fetch from the browser, so all of them work unchanged.

---

## What changed from the old repo's workflow

Adapted from `../ProjectNexTech.org-new/.github/workflows/nextjs.yml`, with
four deliberate differences:

1. **Node 22, not 20.** `next build` dies on the Node 23 line with `Invariant:
   Expected workStore to be initialized` while prerendering Next's internal
   `/_global-error` route. 22 is the LTS every phase gate in `CLAUDE.md` was
   verified on. (20 would also work; 22 is what is actually tested here.)
2. **`static_site_generator: next` removed from `configure-pages`.** That
   option rewrites the Next config to inject a `basePath` for a project page.
   This demo serves from the root of its own host, so an injected basePath
   would prefix every asset with `/<repo>` and 404 the entire site. It also
   targets `next.config.js` specifically, and this repo's config is TypeScript.
3. **`PNT_STATIC_EXPORT=1` and `NEXT_PUBLIC_SITE_HOST`** on the build step.
4. **A post-build step** running `scripts/gh-pages/postbuild.mjs`.

The package-manager detection block was also dropped — this repo has a
`package-lock.json` and no reason to guess.

---

## One-time setup PNT has to do

The workflow cannot do either of these.

1. **DNS**, at the registrar for `projectnextech.org`:

   ```
   CNAME   beta   project-nextech.github.io.
   ```

2. **Repo settings** → Pages → Source: **GitHub Actions**. Then, once the first
   deploy is green, set the custom domain to `beta.projectnextech.org` and tick
   **Enforce HTTPS** (the certificate takes a few minutes to issue).

**If the repo is private,** Pages needs a paid GitHub plan. On a free plan the
workflow succeeds and the deploy step fails.

> **Aside, not blocking:** `../ProjectNexTech.org-new/CNAME` contains
> `http://projectnextech.org`. A CNAME file must hold a bare hostname — no
> scheme — so that value is malformed and worth checking on the live site
> separately. The file this repo generates is a bare hostname.

---

## If the demo ever moves to a project page

If it is served at `project-nextech.github.io/ProjectNexTech.org-v3/` instead
of its own host, **both** of these must be set in `STATIC_DEMO_CONFIG`, or
every asset 404s:

```ts
basePath: '/ProjectNexTech.org-v3',
assetPrefix: '/ProjectNexTech.org-v3',
```

and `DEMO_HOST` / the `out/CNAME` write in `postbuild.mjs` must go.

---

## Reverting: the checklist

Do this when the API is ready and the site moves to the VPS.

1. **Delete** `.github/workflows/gh-pages-demo.yml`
2. **Delete** `scripts/gh-pages/` (the whole directory)
3. **`next.config.ts`** — delete `STATIC_DEMO` and `STATIC_DEMO_CONFIG`, and
   collapse `SERVER_CONFIG` back inline so the file reads:

   ```ts
   const nextConfig: NextConfig = {
     devIndicators: false,
     reactStrictMode: true,
     async redirects() { /* the /discord 308, unchanged */ },
   }
   ```

   Keep the "must never be set" note at the top.
4. **`src/app/layout.tsx`** — inline `ORG.domain` again:

   ```ts
   metadataBase: new URL(`https://${ORG.domain}`),
   ```

   and delete the `SITE_HOST` const and its comment.
5. **`CLAUDE.md`** — delete the "Temporary: GitHub Pages demo" section.
6. **Delete this file.**

Then, outside the repo: turn Pages off in repo settings and remove the `beta`
DNS record.

### Confirming the revert worked

```bash
grep -rn "PNT_STATIC_EXPORT\|NEXT_PUBLIC_SITE_HOST\|gh-pages" . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next
# must return nothing

npx tsc --noEmit && npx eslint src
node ./node_modules/next/dist/bin/next build   # Node 22

test -d out && echo "FAIL: still exporting" || echo "ok: server build"
```

`routes-manifest.json` should still carry the `/discord` 308, and `og:url`
should read `https://projectnextech.org`.

---

## Verified at the time this was set up

Node 22, static export built and served from `out/` on a plain static server:

- **13/13 routes** exported as directory indexes, plus `404.html`, `CNAME`,
  `.nojekyll`, and `/discord/index.html`
- `/`, `/about/`, `/leadership/`, `/curriculum/`, `/programs/`, `/dashboard/`,
  `/contribute/`, `/discord/` all **200**; an unknown path **404s**
- **CSS Modules resolve** — sticky header, dark `rgb(13, 14, 16)` body, Inter
  applied; **zero unresolved `@custom-media`** in the exported CSS
- **19 font faces loaded**, all self-hosted; zero `googleapis`/`gstatic`
  references
- **Client-side navigation works** — Home → Leadership stayed at
  `performance.getEntriesByType('navigation').length === 1` (no reload), 13
  portraits, **0 broken images**
- Interactive islands render (Curriculum: 41 tab controls, 60 course cards)
- `og:url` = `https://beta.projectnextech.org/`; `/dashboard/` = `noindex,
  nofollow`; `/discord/` refreshes to `discord.gg/6yHhgpC`
- **Media audit:** 94 referenced paths, 54 present, 40 missing — **all 40 are
  the documented Phase C placeholders** (history 5, impact 6, volunteer 9,
  project-groups 20). Zero unexpected.
- **With the flag unset:** no `out/`, `/discord` 308 intact, `og:url` back to
  `https://projectnextech.org`. `tsc` and `eslint` clean both ways.
