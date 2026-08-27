# leadership/unlisted

Real photographs that no page currently shows. **Nothing in here is referenced
by `src/data/leadership.ts`.** It exists so that porting the site lost no
files, not because these folders are wired to anything.

| Folder | Why it is here |
|---|---|
| `varshith-vijjapu` | Full photo set on the old site; appears nowhere on its team page. |
| `colin-thompson` | Same — portrait plus four photos, no roster entry. |
| `kush-kharia` | Portrait only, no roster entry. |
| `jp-pierce` | Board of Advisors member. Advisors render as name-and-role cards, which carry no image. |
| `jocelyn-slape` | Same as above. |

To put one of these on the site, move the folder into the right group
(`executive-committee`, `department-managers`, `board-of-directors`) and add a
matching entry to `src/data/leadership.ts` whose `slug` equals the folder name.
Promoting an advisor to a full card is a design change, not just a data one —
the brief specifies name-only cards for everyone but the chair.

The old site's `teamData.ts` also lists `jp_1`…`jp_5` and `kk_1`…`kk_5`, but
those files do not exist in its repo; that page renders ten broken images.
Nothing was lost here.
