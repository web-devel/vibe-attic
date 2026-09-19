# Vibe Attic workshop instructions

This repository supports a 45–60 minute game-building workshop for kids aged 9–15. Participants type short requests describing what they want to play. These project instructions supply the implementation details; do not require the child to type them or use exact wording from the example prompts.

## Scope and interaction

- For game-building or game-editing requests, use your tools to create or change the game, rather than only returning code in chat. Work in `game/` relative to this repository root. Leave workshop documents, prompts, and checkpoints intact.
- For facilitator requests to maintain workshop materials, instructions, or diagnostic files, follow that request's scope instead. Do not generate a game merely because these instructions were loaded.
- Treat the child's explicit game choices as the requirements. Use the defaults below for unspecified details. Optional features are implemented only when requested, never all at once.
- Keep replies short, friendly, and understandable to a child. Use generic terms such as model, coding assistant, and browser. Do not focus on product names.
- Read the existing game before modifying it. Make a small targeted change, preserving unrelated behavior, art, and manually adjusted values. Do not regenerate a working game for a feature request.

## Technical foundation

- Use only `game/index.html`, `game/style.css`, and `game/game.js`. HTML contains the canvas, instructions, score, status, and controls; CSS styles the page; JavaScript implements and draws the game.
- Use native HTML, CSS, JavaScript, and a 2D canvas. Opening `game/index.html` directly from disk must work. Use relative paths and an ordinary deferred script. No modules, fetch requests, libraries, packages, build tools, external assets, network calls, or game-time model calls.
- Use an 800 × 300 logical canvas, scaled with CSS while preserving its aspect ratio. Draw a recognizable little pixel-style dinosaur and cacti using simple shapes. Keep the code small, with clearly named functions and brief comments for input, jumping, collision, and the animation loop.
- Keep one `requestAnimationFrame` loop. Move objects using elapsed seconds, capped at 0.05 seconds per frame. Restart must reset state without creating another loop.
- Use rectangle overlap for collisions. A diagnostic flag must draw the exact collision rectangles. Choose obstacle sizes and gaps that a normal jump can clear.

## Baseline runner defaults

- Keep the dinosaur's horizontal position fixed; move one type of cactus from right to left. Remove cacti when they leave the screen.
- Start ready. Space starts the run and counts as a jump. During play, Space jumps only from the ground. Ignore repeated keydown events and prevent Space from scrolling. Holding Space must not cause automatic jumps.
- A jump sets upward vertical velocity. Gravity changes that velocity over time. Clamp the dinosaur to ground level on landing.
- Touching a cactus ends the run and freezes gameplay. Award exactly one point when each cactus completely passes the dinosaur.
- Show instructions, score, status, and an HTML Restart button. Restart clears obstacles, score, timers, and movement, then returns to ready.
- Keep initial speed fixed. Do not add optional mechanics to the baseline.

Place a clearly labeled `CONFIG` object at the top of `game.js`. Use these starting values on initial creation; preserve later manual changes:

| Property | Default | Meaning |
| --- | --- | --- |
| `runSpeed` | `300` | Pixels per second |
| `jumpSpeed` | `650` | Positive jump magnitude; initial vertical velocity is `-CONFIG.jumpSpeed` |
| `gravity` | `2000` | Pixels per second squared, downward |
| `minObstacleGap` | `1.4` | Minimum seconds between spawns |
| `maxObstacleGap` | `2.0` | Maximum seconds between spawns |
| `showHitboxes` | `false` | Draw collision rectangles when true |

## Defaults for requested features

These sections describe implementation defaults, not features to add proactively. Adapt them if the participant explicitly asks for different behavior.

### Double jump

Allow two separate Space presses before landing. Each gives an upward push using the current jump strength; a third press does nothing. The start press counts as the first jump. Holding the key must not consume extra jumps. Landing and restart reset the allowance. Update the visible instructions.

### Moon mode

Add an HTML checkbox available while ready, disabled during play and after game over until restart. Normal mode uses the configured gravity; Moon mode uses 55% of it. Derive effective gravity without mutating the base value or compounding the multiplier. Keep jump strength and obstacle speed unchanged. Restart keeps the selected mode while resetting the run. Explain in the visible instructions that the mode is chosen before starting.

### Progressive speed

Use the configured starting speed multiplied by `min(1 + floor(score / 5) * 0.1, 1.8)`. Apply it to all moving cacti, show the multiplier beside the score, and reset it to 1.0 on restart. Do not mutate `CONFIG.runSpeed` or compound increases each frame. Preserve spawn timing, obstacle sizes, and jumping.

## Checking and explaining changes

- Inspect file paths and affected logic. Baseline checks cover start, jump, landing, held-key behavior, scoring once per obstacle, collision, and repeated restart. Avoid installing a test framework for this small game.
- For double jump, check the second jump, blocked third jump, held key, landing reset, and restart. For Moon mode, check both modes, switching between runs, and restart. For progressive speed, check scores 0, 4, 5, 9, 10, 40, and 45, plus restart. Remove any temporary test values.
- If something breaks, use the child's observed behavior, expected behavior, and reproduction steps to make the smallest repair. Ask a short question only if a missing observation prevents diagnosis.
- Report only checks actually performed. Do not claim to have seen or tested the browser without doing so. If browser testing is unavailable, say so briefly and give one concrete playtest.
- After a build, say how to open the game and where jump strength is controlled. After an edit, briefly connect the child's request to the changed rule and a visible result. Do not print the whole source or give a long technical report.
