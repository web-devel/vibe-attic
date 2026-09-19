# M1 rehearsal guide

The goal is to establish whether the actual laptop can reliably build and edit the game within the workshop schedule. These are candidate prompts, not measured performance claims. This repo currently contains no generated game or verified save points.

## Record the setup

Fill this in before the first run:

| Item | Value |
| --- | --- |
| Mac model and chip | |
| RAM | |
| macOS version | |
| Browser and version | |
| Editor used for the manual change | |
| Coding-agent version | |
| Exact model identifier and quantization | |
| Inference runtime and version | |
| Local endpoint | |
| Context size and output limit | |
| Thinking and sampling settings, if applicable | |
| Power connected; other apps open | |

The planned agent is Pi and the planned model family is Qwen 3.6. Exact model size and available memory are not settled. Do not assume all M1 configurations behave alike or that a successful chat response proves tool calling works.

## Connect and check the agent

Use the existing installation; this guide does not choose an inference runtime or prescribe a model download. Start the local runtime, load the intended model, then configure/select its local provider in Pi. Confirm the endpoint is on the laptop and that no cloud fallback is selected.

Pi documents custom local providers in `~/.pi/agent/models.json` and selection through `/model`. Use the exact model identifier exposed by the runtime. The API format, port, context limits, and any compatibility settings must match that runtime. Follow the [official custom-model documentation](https://pi.dev/docs/latest/models) rather than guessing these values. Some keyless local endpoints still require a dummy authentication value in Pi's configuration; that is configuration, not a cloud subscription requirement. Documentation consulted on 2026-09-19; check it against the installed version.

Open a terminal at the root of your local copy of this repository and launch `pi`. Select the intended local model.

### Load the prepared instructions

Pi loads project context from **`AGENTS.md`**, not `agent.md`. This repository's [AGENTS.md](../AGENTS.md) contains the web stack, file layout, game defaults, feature implementation notes, and checking instructions. Start Pi from this repo so it discovers the file. Restart Pi or run `/reload` after editing it. Do not disable context loading with `--no-context-files` or `-nc`. Global and parent-directory instructions can also contribute context; a same-directory `AGENTS.override.md` takes precedence over `AGENTS.md`. See the [official project-instruction guide](https://pi.dev/docs/latest/quickstart#give-pi-project-instructions) and [context-file documentation](https://pi.dev/docs/latest/usage#context-files), consulted on 2026-09-19.

During setup, ask the agent to name the three output files and the configured starting jump strength without changing files. Confirm its answer matches `AGENTS.md`. This checks the intended context before relying on the short student prompts; it is not a student activity. Start a fresh conversation afterward.

Before timing the game prompt, try this small tool check in a separate conversation:

> Create `rehearsal-smoke.txt` in the current directory containing exactly `ready`. Read it back using a file tool, then edit it to contain exactly `ready to build` and read it again. Do not modify any other files. Report the final contents.

Verify the actual file contents yourself. If the agent only describes the actions, produces malformed tool requests, or cannot use the returned results, fix that integration first. Keep this disposable file outside any saved game checkpoint. Start a fresh conversation for the game rehearsal so the smoke test is not extra context.

## Rehearsal sequence

### 1. Build and explain

Start with no existing `game/` directory. If one already exists, preserve it in a separately named backup before moving it aside; do not overwrite a previous experiment. Start a fresh agent conversation from the repository root.

Type [the short build prompt](../prompts/01-build-runner.md) as a participant would. Measure typing time separately, then start the generation timer when you submit it. Do not paste the technical instructions into the conversation; they should already be loaded from `AGENTS.md`. While it runs, practice the architecture explanation from the [workshop plan](workshop-plan.md), including the role of those prepared instructions. Observe one tool request, a file write, and any feedback returned to the model. Keep model/harness vocabulary generic during the explanation.

Record time to the first visible response, completed file generation, and a genuinely playable result. Include time spent repairing the result. Note any truncated output, repeated tool calls, model/runtime errors, and severe memory pressure separately from game bugs.

Once the files exist, double-click `game/index.html` in Finder. Alternatively, from the repository root run:

```sh
open game/index.html
```

No development server should be needed. The generated file should use an ordinary script and local relative references. If it requires dependency installation or a remote service, it has missed the project instructions. Check instruction loading before making the student's prompt more technical.

If the game finishes before the explanation, leave it ready. If it is still unfinished at the end of the seven-minute explanation window, record that failure to fit the schedule. Once save points exist, practice stopping the pending generation and switching to one. The first rehearsal must produce and verify a baseline before that recovery route is available.

### 2. Check the baseline

- The page opens directly from disk and displays instructions, score, game status, and restart.
- Space starts the game and jumps without scrolling the page.
- Holding Space does not repeatedly jump. A second press in the air does nothing in the baseline.
- A normal jump can clear a cactus. Landing returns the dinosaur to ground level.
- The dinosaur stays at a fixed horizontal position while cacti approach.
- Each completely passed cactus awards exactly one point.
- Touching a cactus ends the run; score and gameplay stop changing.
- Restart clears score and obstacles and returns to ready. After three restarts, movement is not faster and obstacles are not duplicated.
- Switching away briefly and returning does not cause a large simulation jump.
- `showHitboxes: true` reveals the same rectangles the collision logic uses. Return it to `false` afterward unless needed for teaching.
- The browser shows no JavaScript errors during this flow.

If something fails, record the observation and try [one focused repair](../prompts/repair.md). Capture any successful repair prompt with the baseline. Copy the verified game to the proposed `checkpoints/01-baseline/` structure described in the [save-point guide](../checkpoints/README.md).

### 3. Make the manual change

Locate `CONFIG.jumpSpeed` in `game/game.js`. Predict the effect, change `650` to `780` (or record the generated starting value), save, and refresh the browser. Confirm a higher jump and point to the line that applies `-CONFIG.jumpSpeed`.

Rehearse this using the same editor and keyboard actions the kids will use. Confirm you are editing the working `game/` copy and viewing that same copy. Save this result as `02-higher-jump` before asking for another feature.

### 4. Add one feature

Type one of the [short feature prompts](../prompts/README.md) and time it, including inspection and playtesting. Start with the same manually edited baseline when comparing alternatives; use a fresh conversation for each independent comparison, with the project instructions loaded. Confirm the model preserved the manual jump-strength change. Also try a paraphrased request to check that the setup supports the child's own wording.

| Feature | Check |
| --- | --- |
| Double jump | Two separate presses produce jumps; a third is ignored; holding the key does not consume extra jumps; landing and restart reset the allowance |
| Moon mode | Choose before starting; checkbox locks during play; lower gravity gives longer airtime; restart keeps the selected mode; switching back restores normal gravity |
| Progressive speed | Multipliers at scores 0, 4, 5, 9, 10, 40, 45 are 1.0, 1.0, 1.1, 1.1, 1.2, 1.8, 1.8; restart returns to 1.0 |

For high-score boundaries, inspect or temporarily exercise the calculation rather than requiring a child to survive a long run. If you use temporary test values, remove them before saving a checkpoint. Always finish with a real browser playtest.

Treat two minutes as an initial target for completing a feature edit, leaving the rest of its lesson slot for prediction, inspection, testing, and recovery. Adjust the feature menu based on measurements.

### 5. Check offline operation and repeatability

Close Pi and verify that the already generated game still runs. With the local model loaded, disable networking and separately verify that a fresh agent request still works. This distinguishes offline gameplay from offline generation. Restore networking when finished if needed.

Repeat a fresh build to expose variation; a single lucky generation is insufficient for choosing classroom timings. Record model-loading time separately from a run with the model already loaded. Prepare the laptops in the same warmed-up state intended for the workshop.

Preserve and validate each result before adding it as a save point. Later rehearsals should also time recovery: stop the agent, back up current work, copy the chosen save point, reopen the correct game, and continue the manual activity.

## Result log

Copy this table for each experiment. Record actual observations rather than expected results.

| Field | Result |
| --- | --- |
| Date / run identifier | |
| Setup or settings changed since last run | |
| Model already loaded? Loading time if not | |
| Exact typed prompt and example filename, if used | |
| Agent-instruction copy or revision | |
| Time to type and submit the request | |
| Time to first visible response | |
| Time to completed files | |
| Time to playable baseline, including repairs | |
| Failed checks and repair requests | |
| Manual edit and observed effect | |
| Feature selected | |
| Feature edit time / total time to working result | |
| Existing manual edit preserved? | |
| Offline generation / offline gameplay checked? | |
| Save point created and browser verified | |
| Total 45-minute rehearsal fit / recovery time | |
| Decision for next run | |

## Decisions after rehearsal

- Keep full initial generation if it reliably finishes inside the architecture explanation window.
- If it does not, simplify the game defaults or reduce instruction overhead, or prepare a small starter scaffold for the model to complete. Keep the child's prompt short. A scaffold is a proposed fallback, not currently supplied in the repo.
- Offer only features that can be generated, understood, and tested within the change activity.
- Keep verified save points available even when inference performs well.
- Build the presentation and final prompt cards from the verified output and timings.
