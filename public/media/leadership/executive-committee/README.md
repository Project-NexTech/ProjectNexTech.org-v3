# leadership/executive-committee

**Aspect ratio:** portrait 1:1 (square) · carousel 4:3 (landscape)
**Expected count:** 1 portrait + as many carousel photos as that person has
**Filename prefix:** `portrait / carousel`

One folder per person, **named after the person**, not numbered. The folder
name is the `slug` field in `src/data/leadership.ts` — the two must match, and
the roster derives every image path from it.

Numbered folders were used while this page held placeholder data and were
removed in the content phase: with real people, adding or removing one member
renumbers everyone below them, and each photo then silently belongs to the
wrong face. Nothing errors when that happens, which is exactly why it is worth
avoiding.

To add a photo: drop `carousel-0N.png` into the person's folder and raise their
`shots` count in `src/data/leadership.ts` by one.
