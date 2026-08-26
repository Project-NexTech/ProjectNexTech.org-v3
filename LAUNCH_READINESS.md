# Launch readiness — projectnextech.org

Everything that stands between the current build and a fully functional site on
**projectnextech.org**.

The site is **structurally complete**: all 13 routes are real pages, the design
system is finished, and light and dark modes both work. What remains is real
content, a small amount of backend, and deployment.

> **Read this first.** The build described here — Vite + React Router +
> Tailwind, statically exported to GitHub Pages — is now a **prototype**. PNT
> has decided the production site is **Next.js 16 with CSS Modules, backed by
> Postgres, self-hosted on a VPS**. That work is planned in
> `NEXTJS_MIGRATION.md`, which supersedes the deployment and backend items
> below (each is marked where it applies).
>
> **Everything else in this document still stands**, unchanged: the
> photography, the placeholder rosters, the partner tiers, the invented course
> content, and the legal review of Terms are all content problems that the
> rebuild neither creates nor solves. They remain the long pole to launch.

**How to read this:** each item is tagged.

| Tag | Meaning |
|---|---|
| 🔴 **Blocker** | The site should not go live to the public with this outstanding |
| 🟡 **Content** | Placeholder that needs replacing, but is not dangerous |
| 🔵 **Backend** | Needs a server, a service, or credentials — cannot be done in this repo alone |
| ⚪ **Polish** | Improves the site; safe to defer |

---

## Sitewide / infrastructure

### 🔴 Deployment and routing

> **⚠️ SUPERSEDED — this whole item is obsolete.**
>
> PNT has decided the production site will **not** be a static export on GitHub
> Pages. It moves to **Next.js 16 self-hosted on a VPS**, either via Coolify
> (Docker) or a manual Node + reverse-proxy setup. The build also moves from
> Vite/Tailwind to Next/CSS Modules, and program and hours data move from
> Google Sheets to Postgres.
>
> **See `NEXTJS_MIGRATION.md` — §1.1 and Appendix A** — which replaces
> everything below and covers the real deployment work: reverse proxy, TLS,
> `output: "standalone"`, DNS cutover, backups, and the deploy trigger.
>
> The rest of *this* document (content, photography, rosters, legal review) is
> unaffected by that decision and still applies as written.

The historical GitHub Pages plan, retained only for context:

The model uses `BrowserRouter`, so URLs are real paths (`/curriculum`, not
`/#/curriculum`). GitHub Pages serves static files and knows nothing about
those paths, so loading or refreshing any URL other than `/` would 404 — hence
the `postbuild` step copying `dist/index.html` to `dist/404.html`, the `CNAME`
file, and pointing the apex domain at GitHub's IPs.

**None of that carries over.** A real Next server routes `/curriculum` natively,
so the 404 fallback, the `CNAME` file, and the Pages workflow are all deleted
rather than ported.

### 🔴 Real photography

Every image on the site is currently a dashed placeholder showing the filepath
it expects. Drop real files at those paths and they appear — no code change.

- All images live under `public/media/`, organized per page and section.
- Each folder has a `README.md` stating its **aspect ratio**, **expected
  count**, and **filename prefix**.
- **All paths now expect `.png`.**
- Captions and alt text live in component code, not filenames, so images can be
  swapped without renaming anything.

Roughly 200 image slots exist. The highest-impact ones are the Home carousel
(12), the About history section (5), and leadership portraits (19).

### 🔴 Replace the placeholder favicon

`public/favicon.ico` is a crude generated orange mark. Replace with PNT's real
favicon at the same path.

### 🟡 Placeholder copy

Every page is filled with placeholder prose. By convention **every placeholder
paragraph contains the literal word "placeholder"** — searching the repo for
that word finds all of it.

### 🔵 Analytics

Cloudflare Web Analytics is planned but not installed. It is a single script
tag added to `index.html` once the site is on Cloudflare.

### ⚪ Social preview image

`public/media/shared/og/` is scaffolded but empty. Add a 1200×630 image and the
corresponding `og:image` / `twitter:card` meta tags in `index.html` so shared
links unfurl with a picture.

### ⚪ Accessibility pass

The brief scoped this to semantic HTML only, which is done. Before a wide
launch, consider: a "skip to content" link, an audit of color contrast in light
mode, and keyboard-testing the Programs map.

> **Note on the protected email component.** Email addresses render as
> `info [at] project nextech [dot] org`, unselectable and non-contiguous in the
> DOM. This was an explicit requirement and it works — but it means **screen
> readers announce the fragments out of order and nobody can copy an address**.
> The Contact popup explains the `[at]`/`[dot]` convention in plain language.
> Worth revisiting if accessibility complaints arrive.

---

## Home

### 🟡 Carousel images and captions
12 slots at `public/media/home/carousel/` (16:9). Captions are in
`src/pages/Home.jsx`.

### 🟡 Big Numbers
Live in `BIG_NUMBERS` in `src/constants/index.js`. They are **hardcoded and
will silently go stale.** Someone needs to own updating them each term, or they
need wiring to the analytics sheet.

---

## About

### 🔴 Partner tiers are guesses
`src/data/partners.js` holds 12 cards. The **first 7 are real** organizations
taken from the current live site with real links and relationships. The **last
5 are invented placeholders**.

**Every tier was inferred by me, not supplied.** Qualcomm is marked "Silver
Sponsor" purely because the live site mentions ">$4,000 in grants". All twelve
need confirming before publication — a wrong sponsorship tier is the kind of
error a partner notices.

### 🟡 History, About us, and Philosophy prose
Placeholder. The real history should be straightforward to write — the live
site already states PNT was founded 19 May 2023 in San Diego with 8 students,
and that the first class had 4 instructors and 2 participants.

---

## Impact

### 🟡 Quarterly report PDFs
All four links currently point at the **same** stand-in file
(`public/documents/impact-reports/placeholder-report.pdf`). Replace with the
real PDFs and update `IMPACT_REPORTS` in constants.

### 🟡 Article prose
Placeholder across all four sections. The "Building volunteers and leaders"
carousel expects **long captions (30+ words)** — these are meant to be direct
quotes from named volunteers, so they need collecting.

### ✅ Google MyMap
Already embedded and working with real program pins.

---

## Programs

This is the most backend-dependent page on the site.

### 🔴 Venue coordinates are approximations
`src/data/venueCoordinates.js` contains hand-written latitude/longitude for all
49 venues. **They are accurate to the neighborhood, not the building.**

For a "find a program near you" feature this is the most consequential
outstanding item on the site — a family could be sent to the wrong block.

**Fix:** run a one-time geocoding pass over the `address` field of each entry
in `LOCATIONS` (Google Geocoding API or Nominatim), and commit the results back
to `venueCoordinates.js`. **Do not geocode at runtime** — it adds a network
dependency and a rate limit to every page load.

### 🔵 Real program database
The page currently reads `public/data/programs.csv`, a generated 300-row
stand-in (see `scripts/generate-programs-csv.mjs`).

The UI does not care where the data comes from — it needs an array of objects
with these fields:

`date, course, minGrade, maxGrade, session, startTime, endTime, location,
address, region, signupLink, uid`

**Decided: option 3.** Program data moves to Postgres on the VPS, queried by a
Next Route Handler. See `NEXTJS_MIGRATION.md` §4 for the schema, the Sheets
importer, and the cutover.

The two lighter-weight options below are recorded only as fallbacks if the
migration stalls and something must ship sooner:

1. **Publish the existing Program Bookings sheet as CSV** and change the fetch
   URL in `src/pages/Programs.jsx`. Almost no code change; data stays in
   Sheets where PNT already manages it.
2. **Google Sheets API** with a read-only key — better structure, needs a key
   restricted by domain.

Under either fallback, the venue list must stay in sync with
`venueCoordinates.js`, or new venues go missing from the map. **The Postgres
route removes that hazard entirely** — one `venues` table with a `CHECK`
constraint makes an uncoordinated venue impossible.

### 🟡 Signup links
Currently dummy URLs. Should point at whatever real registration flow PNT uses.

---

## Curriculum

### 🔴 Courses 2.1 and 2.2 have mismatched descriptions
These were renamed to **Intro to Basic Robotics** and **Intro to Advanced
Robotics**, but their descriptions are still the old FLL/FTC text and name
F.I.R.S.T. explicitly. They read as inconsistent and need rewriting.

### 🟡 Two courses are entirely invented
**[4.3] Intro to Electromagnetism** and **[4.4] Intro to Astronomy** do not
exist on the live site. Their descriptions, grade ranges, and materials were
made up. Confirm or remove them.

### 🟡 Grade ranges were adjusted
The site enforces that the ideal range sits **strictly inside** the OK range,
so all four bounds are distinct and the card graphic can label them on one row.
Eight courses were widened to satisfy this. For **[2.4]** and **[3.3]**, the OK
bound was already at grade 12, so the *ideal* upper bound was pulled down to 11
instead — that changes course meaning, not just presentation, and should be
checked.

### 🟡 Course tags
NEW / MOST POPULAR / STUDENT FAVORITE were assigned arbitrarily to exercise the
design. Reassign to the courses they actually describe.

### 🟡 Card carousel images
5 slots per course × 22 courses = 110 images. Folder names derive from course
titles — **renaming a course means renaming its folder** under
`public/media/curriculum/`.

---

## Leadership

### 🔴 The entire roster is placeholder
`src/data/leadership.js` contains 27 fabricated people named "Placeholder Name
1" through "Placeholder Name 27". Names were kept obviously fake **on purpose**,
so nothing could be mistaken for a real volunteer.

Each entry needs: name, role(s), portrait, up to 5 carousel photos with
captions, a 3-paragraph bio, join date, grade, school, region, and an optional
LinkedIn URL.

This page is hand-maintained by design — there is no database to wire up.

### 🟡 Secondary roles are invented
Some members carry extra roles ("Curriculum Reviewer", "Founding Member") purely
to exercise the multi-role popup layout.

---

## Project Groups

### 🔴 All 20 groups are placeholder
`src/data/projectGroups.js`. Each needs: group name, 4–5 character code,
region image, carousel photos, description, lead(s), member list, affiliation,
region, and an optional link.

### 🟡 Group map positions are city-level and invented
Groups are scattered around six city centers with deterministic offsets so
their markers do not stack. Real coordinates should replace them alongside the
real rosters.

---

## Volunteer

### 🟡 Volunteer info video is a placeholder
`MEDIA_LINKS.volunteerInfoVideo` points at an unrelated YouTube video. Replace
with PNT's real volunteer video. It autoplays **muted**, which browsers require.

### ✅ Discord widget
Working against live data (verified at 495 members / 57 online). It needs
"Enable Server Widget" to stay on in Server Settings → Widget. **If that is
ever switched off the endpoint returns 403** — a static fallback already
handles that, so the section degrades rather than breaking.

### ✅ Slideshow
The real Google Slides deck is embedded and sized so the slide area fills the
frame exactly.

---

## Contribute

### 🔵 Donorbox is not connected
`DONORBOX.campaignSlug` in `src/constants/index.js` is `null`, so the page
renders a labelled placeholder instead of the donation form.

**Fix:** Donorbox dashboard → Campaign → Embed, copy the campaign slug, set the
constant. The real iframe appears immediately; no other change needed.

Until this is done **the site cannot accept donations**, which makes it a
launch blocker in practice even though nothing is broken.

### 🟡 Partnership and donation copy
Placeholder bullets. The tier descriptions should match whatever PNT actually
offers partners.

---

## Terms

### 🔴 The entire page is placeholder legal text with no legal standing
`src/pages/Terms.jsx` has realistic structure and length across 7 sections, but
it was written to fill a layout, not to protect the organization.

**The limitation of liability section in particular must be written or reviewed
by a lawyer before launch.** This matters more than usual because PNT runs
in-person programs with minors at third-party venues.

Also needs: real effective date, real authors, and a decision on whether a
privacy policy is required (likely yes, once Google sign-in collects personal
data).

---

## Policies

### ✅ Working
The real Constitution is embedded from Google Docs and stays in sync
automatically.

### ⚪ The embed renders on a white background
Google Docs embeds cannot be themed, so the document sits as a white panel
inside the dark site. The alternative — restating the Constitution as HTML —
would drift out of sync with the real document. Current recommendation: accept
the contrast.

Requires the doc to remain shared as "anyone with the link can view". **If
sharing is ever restricted the embed shows a sign-in prompt instead.**

---

## Dashboard and Log In

### 🔵 Google sign-in is not real
The whole flow is one boolean. First click of "Log In" or "Dashboard" opens
google.com in a new tab and flips it; a reload signs you back out. No Google
Cloud project, no OAuth client, no tokens.

Making it real requires all of:

1. **A Google Cloud project** with an OAuth 2.0 client ID, with
   `projectnextech.org` as an authorized origin.
2. ~~**A backend to verify tokens.**~~ **Resolved by the VPS decision** — the
   site now runs a real Node server, so sessions, token verification, and
   httpOnly cookies are all available in-process. This was the hard blocker and
   it is gone.
3. **A volunteer record store** keyed by Google account, so a signed-in member
   maps to their hours. → the `members` table in `NEXTJS_MIGRATION.md` §4.2.
4. **Restricting access** — deciding who may sign in, and what an unrecognized
   account sees. Still an open question for PNT.

This is the single largest remaining piece of work on the site.

### 🔵 All dashboard figures are placeholder
`src/data/dashboard.js`. Hours, breakdowns, badges, request history, and the
profile are all invented. Once auth and a backend exist these come from PNT's
hours records.

The category names **are** real (departments 1/A/B/C/D/L, the classification
list), so the data shapes should survive being wired up.

### 🟡 Inert controls
The date range inputs and the **Recalculate** button work as inputs but do not
filter anything — there is nothing to query yet. This was deliberate and
matches the brief, but it will confuse a real volunteer, so either wire them up
or disable them with a tooltip before members use the page.

### 🟡 Badges
The milestone list is invented.

---

## Suggested order of work

Reordered for the VPS + Next 16 rebuild. Content work (1, 2, 4–7) is
independent of the rebuild and can run in parallel with it — **it should**,
since it is the long pole and needs no engineering.

1. **Terms** — legal review (long lead time, start first)
2. **Donorbox slug** — one line, unblocks donations
3. **The rebuild** — `NEXTJS_MIGRATION.md` phases 0–4: VPS provisioned, Next 16
   scaffold deployed over HTTPS, then the port off Vite/Tailwind
4. **Venue geocoding** — correctness issue on the flagship feature; do it as
   part of seeding the `venues` table rather than editing `venueCoordinates.js`
5. **Partner tiers + courses 2.1/2.2** — small, and currently wrong
6. **Real rosters** — Leadership and Project Groups (stay hand-maintained)
7. **Photography** — the largest volume of work; parallelizable
8. **Real program data** — `NEXTJS_MIGRATION.md` phases 5–6, Sheets → Postgres
9. **Google sign-in and the hours backend** — phase 7; can follow launch, since
   the rest of the site does not depend on it
10. **Backups verified by restore** — before any volunteer relies on the
    Dashboard, not after (Appendix A.4)
