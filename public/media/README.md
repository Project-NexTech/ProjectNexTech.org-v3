# Site media

Every image the site uses lives here, served from `/media/...` at runtime.

These files are in `public/`, so the path shown in an image placeholder on the
site is the literal path to drop a file into — no code change and no `import`
statement is needed. Add the file, refresh, done.

Each subfolder has its own README stating the aspect ratio, expected count, and
filename prefix for that slot.

**Not stored here:** captions, headings, and alt text. Those live in component
code so they can be translated and edited without renaming files.

74 media folders were scaffolded.
