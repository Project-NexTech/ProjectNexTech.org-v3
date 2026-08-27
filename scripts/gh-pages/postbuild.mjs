/**
 * TEMPORARY — GitHub Pages demo. Delete this directory to revert.
 * Full revert checklist: GITHUB_PAGES_DEMO.md
 *
 * Runs after `next build` with PNT_STATIC_EXPORT=1 and patches the three
 * things a static export cannot express on its own. It writes ONLY into
 * `out/`, never into `public/` or `src/`, so nothing it does can leak into a
 * normal build: `out/` is gitignored and rebuilt from scratch every run.
 *
 * That is the whole point of doing it here rather than committing the files.
 * A `public/CNAME` would ship to the VPS too, and a `public/discord/index.html`
 * would sit in the tree shadowing the real 308 in next.config.ts — a
 * placeholder that outlives its reason is how the demo becomes permanent by
 * accident.
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = join(ROOT, 'out')

/** The host the demo is served from. Must match public DNS and the CNAME. */
const DEMO_HOST = 'beta.projectnextech.org'

/** Kept in step with the `/discord` redirect in next.config.ts by hand. */
const DISCORD_INVITE = 'https://discord.gg/6yHhgpC'

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/**
 * `/discord` — a meta-refresh stand-in for the 308.
 *
 * Worse than the real redirect in every way that matters: the browser paints
 * before it hops, and a crawler following it sees a 200 rather than a
 * permanent move. Both are acceptable for a demo and neither is acceptable in
 * production, which is why next.config.ts keeps the real one.
 *
 * The <link rel="canonical"> and the visible link are not decoration — they
 * are what a client with JS disabled, or a preview scraper that ignores
 * meta-refresh, actually gets.
 */
async function writeDiscordRedirect() {
  const dir = join(OUT, 'discord')
  await mkdir(dir, { recursive: true })
  await writeFile(
    join(dir, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0; url=${DISCORD_INVITE}" />
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${DISCORD_INVITE}" />
    <title>Redirecting to Discord · Project NexTech</title>
  </head>
  <body style="font-family: system-ui, sans-serif; padding: 2rem">
    <p>Redirecting to the Project NexTech Discord…</p>
    <p><a href="${DISCORD_INVITE}">${DISCORD_INVITE}</a></p>
  </body>
</html>
`,
    'utf8',
  )
  return 'out/discord/index.html'
}

/** Binds the Pages deployment to the demo host. */
async function writeCname() {
  await writeFile(join(OUT, 'CNAME'), `${DEMO_HOST}\n`, 'utf8')
  return 'out/CNAME'
}

/**
 * Insurance only. The Actions deploy path (upload-pages-artifact +
 * deploy-pages) serves the artifact directly and never runs Jekyll, so this
 * changes nothing today. It matters if the deployment is ever switched to the
 * older branch-based Pages mode, where Jekyll would drop `_next/` entirely and
 * the site would come up completely unstyled.
 */
async function writeNoJekyll() {
  await writeFile(join(OUT, '.nojekyll'), '', 'utf8')
  return 'out/.nojekyll'
}

async function main() {
  if (!(await exists(OUT))) {
    console.error(
      'postbuild: no out/ directory.\n' +
        'Run the export first:  PNT_STATIC_EXPORT=1 next build\n' +
        'Without that flag next.config.ts builds the real server config and ' +
        'never emits out/ — see GITHUB_PAGES_DEMO.md.',
    )
    process.exit(1)
  }

  /* A missing 404.html means unknown paths fall back to GitHub's own error
     page instead of the site's. Next emits it from src/app/not-found.tsx, so
     if it is absent something changed upstream and the deploy is degraded —
     worth saying out loud rather than discovering in the browser. */
  if (!(await exists(join(OUT, '404.html')))) {
    console.warn('postbuild: WARNING — out/404.html is missing; GitHub Pages will serve its own 404.')
  }

  const written = [await writeDiscordRedirect(), await writeCname(), await writeNoJekyll()]
  console.log(`postbuild: wrote ${written.join(', ')}`)
  console.log(`postbuild: demo host ${DEMO_HOST}`)
}

await main()
