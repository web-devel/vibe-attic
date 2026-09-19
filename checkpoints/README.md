# Workshop save points

No game save points have been generated or verified yet. Add them after M1 rehearsal; do not treat these proposed names as existing playable versions.

## Proposed contents

| Directory to add | Contents |
| --- | --- |
| `01-baseline/` | Verified result of the initial build prompt |
| `02-higher-jump/` | Baseline with the deliberate manual jump-strength edit |
| `03a-double-jump/` | Higher-jump version plus the double-jump feature |
| `03b-moon-mode/` | Higher-jump version plus Moon mode |
| `03c-progressive-speed/` | Higher-jump version plus progressive speed |

Each save point should contain its own `index.html`, `style.css`, and `game.js`, with relative references so the HTML can be opened directly. Add a `NOTES.md` recording any repairs or manual edits, the model/runtime configuration, and which browser checks passed. Save the exact typed request as `PROMPT.md` and a copy of the project instructions used as `AGENT-INSTRUCTIONS.md`, so future revisions preserve both parts of the generating context. The snapshot intentionally uses a different filename from `AGENTS.md` so it is a record, not another automatically loaded instruction file. For a manual-only save point, record the exact change and source save point instead.

Feature save points are separate branches from `02-higher-jump`, not cumulative upgrades. Preserve `01-baseline` for comparison and future fresh rehearsals.

## Using a save point

Stop any pending agent request before restoring files. First copy the participant's current `game/` into a separately named backup. Then copy only the three game files from the chosen save point into `game/` and refresh `game/index.html`. Continue editing the working copy; leave the verified save point intact.

For an immediate demonstration, open the save point's own `index.html`, but return to `game/index.html` before the participant starts modifying the game. Otherwise they may edit one copy while viewing another.

Check scoring, collision, controls, and repeated restart before calling a save point verified. Also confirm it opens with networking disabled. See the [rehearsal checklist](../docs/m1-rehearsal.md).
