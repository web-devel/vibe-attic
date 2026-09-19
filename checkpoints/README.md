# Workshop save points

Each checkpoint is **one standalone HTML file** with embedded CSS, JavaScript, and canvas drawings. Double-click it in Finder to play. No model, installation, server, internet connection, or companion files are needed.

## Choose a save point

| File | What it contains |
| --- | --- |
| [01-baseline.html](01-baseline.html) | The original runner: jump, dodge cacti, score, restart |
| [02-higher-jump.html](02-higher-jump.html) | The same game with jump strength changed from 650 to 780 |
| [03a-double-jump.html](03a-double-jump.html) | Higher jump plus one extra jump in midair |
| [03b-moon-mode.html](03b-moon-mode.html) | Higher jump plus a Moon mode checkbox with lower gravity |
| [03c-progressive-speed.html](03c-progressive-speed.html) | Higher jump plus a 10% speed increase every five points, capped at 180% |

The three feature versions are alternatives branching from the higher-jump version. Their features are not combined.

Press **Space** or tap the field to start and jump. Click **Restart** after a collision. Holding Space does not automatically jump. In Moon mode, choose the checkbox before starting; restart keeps the selection. The camera follows very high jumps so the dinosaur remains visible.

## Recover during the workshop

1. Stop any pending coding-agent request so it cannot overwrite the restored game.
2. Back up the participant's current `index.html` under a new name, if it exists.
3. Copy the chosen checkpoint to the repository root and name the copy `index.html`.
4. Open that working `index.html` in the browser. Confirm its save-point label so you know which version you are viewing.
5. Continue experimenting on the copy. Keep the supplied checkpoint unchanged.

The copy includes all its code and uses the same format as a freshly generated game. The [agent instructions](../AGENTS.md) tell the coding assistant to edit this root `index.html`, so the short feature prompts still work.

For the manual jump experiment, find `CONFIG` near the start of the embedded script, change `jumpSpeed`, save, and refresh. Set `showHitboxes` to `true` to see the collision rectangles. For immediate play without continued editing, simply open the checkpoint in place.

## Preparation and verification

These are prepared reference implementations created with the repository's coding assistant. They are not recorded outputs or performance measurements from the M1 local model. Each file includes a short HTML comment with its suggested prompt and the change represented by that stage.

Thirty automated checks pass using Node's built-in test runner. They execute the actual embedded game scripts with a simulated DOM, canvas, and animation clock. Coverage includes jumping and landing, held-key handling, successful cactus clearance, collision, scoring once per cactus, frozen game-over state, repeated restart, frame-time limits, all three optional features, and high-jump camera behavior. Static checks confirm that the files reference no external assets or network APIs.

These checks do not verify actual browser rendering or browser event delivery. The available preview browser blocked local-file URLs, so browser playtesting was not completed here. Open each file in the intended M1 browser and follow the [rehearsal checklist](../docs/m1-rehearsal.md) before the workshop. In particular, check keyboard focus, checkbox operation, layout, and real jump timing.

## Maintaining the reference files

The HTML files are the deliverables; the following Node scripts are only for repository maintenance. They are not needed to play or distribute any save point.

- [build-checkpoints.mjs](../scripts/build-checkpoints.mjs) regenerates all five reference files. It overwrites them, so preserve any experiments under different names first.
- [check-checkpoints.test.mjs](../scripts/check-checkpoints.test.mjs) checks the delivered HTML files.

From the repository root:

```sh
node scripts/build-checkpoints.mjs
node --test scripts/check-checkpoints.test.mjs
```

For a new save point made during M1 rehearsal, copy the working `index.html` under a distinct filename. Record the actual typed prompt, instruction revision, manual edits, repairs, and observed checks in an HTML comment. Then open that file independently to verify it before relying on it.
