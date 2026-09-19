# Workshop instructions

Help kids aged 9–15 build and change a dinosaur runner. Keep explanations short and use generic terms rather than product names.

For workshop materials or setup requests, work on those materials instead of building a game.

After completing and checking each step, save it in a separate local Git commit with a short, descriptive message. Stage only the files changed for that step; leave unrelated work alone. Do not push commits.

## Game rules and checks

When asked to build or change the game:

- Generate the playable game into `index.html` in the repository root, and make all later game edits there. Keep all HTML, CSS, and JavaScript in that one file.
- Use plain browser features and a 2D canvas. No libraries, packages, build tools, external assets, or network requests. The file must work when opened directly.
- Use your file tools to make changes. Do not just print the code in chat.
- Follow the child's requested rules. Add only requested features, and preserve their existing changes.
- Make small edits. Start at `EDIT: CONFIG` or `EDIT: RULES`; read the page and drawings only when needed. Do not load all checkpoints or run their generator.
- Keep code small and readable, with named functions and short comments for input, jumping, collisions, and drawing.
- Put editable values in a `CONFIG` object near the start of the script. Start with `runSpeed: 300`, `jumpSpeed: 650`, `gravity: 2000`, `minObstacleGap: 1.4`, `maxObstacleGap: 2.0`, and `showHitboxes: false`. Preserve later edits.
- Keep the dinosaur's horizontal position fixed and move cacti toward it. Use an upward velocity for jumping and gravity for landing.
- Use one animation loop with elapsed seconds capped at 0.05. Restart resets the game without starting another loop.
- Ignore repeated Space key events and prevent page scrolling. Use rectangle collisions; let `showHitboxes` display those rectangles.
- Check the changed behavior and restart. Say what you actually checked, and give one simple playtest. Never claim browser testing you did not perform.
- Briefly explain which rule changed and where to find it. Leave the foundation, prompts, checkpoint originals, `presentation/` slides, and workshop documents intact during game requests.

## Short step guides

Use only the step the child requests. Their wording and values take priority over these examples.

### 1. Start the game

If root `index.html` is missing, copy `foundation/runner.html` there with a file tool. On the workshop laptop, `cp -n foundation/runner.html index.html` avoids overwriting existing work. The foundation already supplies the page, drawings, and working game. Say you reused it. If a working game exists, edit that instead. Build from scratch only when explicitly requested. Check jumping, scoring, collision, and restart.

### 2. Higher jump

Change only `CONFIG.jumpSpeed`, usually from 650 to 780. If the child wants to edit it manually, show them where instead. `jump()` applies `-CONFIG.jumpSpeed`; gravity brings the dinosaur down. Compare height after saving and refreshing. Keep the chosen value during later edits.

### 3A. Double jump

Add `state.jumpsUsed = 0`. In `jump()`, replace the airborne guard with a two-jump limit, increment the counter, then apply the usual jump velocity. Reset the counter on landing and in `restart()`. Keep the game-over and repeated-key guards; update the jump hint. Check two presses work, a third airborne press is ignored, and landing and restart restore the allowance.

### 3B. Moon mode

Add a labeled `moon` checkbox in `.controls` and its DOM reference. Add `moonGravityFactor: 0.55` to `CONFIG`. In `update()`, use normal gravity times that factor when checked; never change `CONFIG.gravity` itself. In `updateHud()`, disable the checkbox unless the game is ready. Restart keeps its selection. Preserve the INPUT key exception so Space can toggle the checkbox. Check longer airtime, control locking, restart, and switching back to normal gravity.

### 3C. Increasing speed

Add CONFIG values `speedStepPoints: 5`, `speedStep: 0.1`, and `maxSpeedMultiplier: 1.8`. A `speedMultiplier()` helper returns `Math.min(1 + Math.floor(state.score / CONFIG.speedStepPoints) * CONFIG.speedStep, CONFIG.maxSpeedMultiplier)`. Use `CONFIG.runSpeed * speedMultiplier()` for all cactus movement; never multiply the saved base speed. Add a speed output in `.toolbar` and refresh it in `updateHud()`. Check scores 0, 5, 10, 40, 45 give 1.0, 1.1, 1.2, 1.8, 1.8; restart returns to 1.0.

### 4. Repair

Use what the child did, saw, and expected. Read the relevant function and fix that problem without replacing the game. Reuse existing feature state or controls instead of duplicating them. Repeat the reported action and check restart. If the facilitator requests recovery, follow `checkpoints/README.md`: stop pending edits, back up the working file, then copy the selected checkpoint.
