# Ready game foundation

[runner.html](runner.html) is a working, standalone game extracted from [the baseline checkpoint](../checkpoints/01-baseline.html). Use it as the starting material for the local model on the workshop laptops. The first request copies a prepared game; later requests generate small rule changes. Be explicit about that distinction when teaching.

The styles and artwork are embedded resources, so there are no images to download or companion files to load. Open the HTML directly to play. No model, server, packages, or build step is needed.

## Extracted resources

| Marker in the HTML | Supplied resource | When to read or edit |
| --- | --- | --- |
| `RESOURCE: STYLES` | Responsive layout, colors, buttons, status and overlay styles | A requested appearance change |
| `RESOURCE: PAGE` | Score, status, canvas, instructions, restart | A new control or label, such as Moon mode or speed |
| `EDIT: CONFIG` | Speed, jump strength, gravity, obstacle gaps, hitbox switch | The manual experiment or requested tuning |
| `EDIT: RULES` | State, input, jump, landing, spawning, collision, score, restart | The selected rule change |
| `RESOURCE: DRAWINGS` | Dinosaur, cactus, sky, ground, high-jump camera, hitboxes | A requested drawing change |
| `RESOURCE: LOOP` | One animation loop, seconds capped at 0.05 | A timing bug; keep restart separate |

## Workshop use

1. Launch the coding agent from the repository root with [AGENTS.md](../AGENTS.md) loaded.
2. Type the existing [first request](../prompts/01-build-runner.md). Following the short steps in `AGENTS.md`, the agent copies the foundation to `index.html` if no working game exists.
3. Open that working copy. Play, change `CONFIG.jumpSpeed` from 650 to 780 manually, then request one optional feature.
4. The agent follows the matching step in `AGENTS.md` and edits the existing game. Keep the foundation and supplied checkpoints unchanged.

To prepare the working copy yourself on the workshop laptop, from the repository root use:

```sh
cp -n foundation/runner.html index.html
open index.html
```

`cp -n` leaves an existing working file intact. Back up previous work under a distinct name before deliberately starting a new rehearsal. Copying requires neither reading the entire HTML into model context nor generating it again.

## Rehearsal and maintenance

The preparation reduces the code the model must generate; actual latency, tool reliability, and memory use still need [M1 rehearsal](../docs/m1-rehearsal.md). Record the foundation and `AGENTS.md` revisions with each result. The automated game checks simulate input and animation; they do not prove browser rendering or M1 inference performance.

Repository maintainers can reproduce the extraction from the original baseline:

```sh
node scripts/extract-foundation.mjs --check
node --test scripts/check-checkpoints.test.mjs
```

To refresh after deliberately changing the reference baseline, run `node scripts/extract-foundation.mjs` without `--check`. It overwrites only `foundation/runner.html`; save any foundation experiments elsewhere first. The original checkpoint generator remains separate. None of these commands is part of a child's game request.
