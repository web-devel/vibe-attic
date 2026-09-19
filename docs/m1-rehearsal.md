# M1 rehearsal guide

The goal is to establish whether the actual laptop can reliably build and edit the game within the workshop schedule. These are candidate prompts, not measured performance claims. Five [standalone HTML save points](../checkpoints/README.md) are available as prepared reference games. Their local automated behavior checks do not replace a browser playtest on the M1.

The default route now uses the [ready game foundation](../foundation/README.md): the first request copies supplied code, and the model generates only later rule changes. Its page, styles, drawings, and baseline mechanics are extracted from checkpoint 01. Short step guides are included directly in `AGENTS.md`; no separate guide files need loading. Do not paste the checkpoints into a conversation. Record this as foundation reuse, separately from any full-generation experiment.

Before testing inference, double-click `checkpoints/01-baseline.html` and run the baseline checks below. Try the other four save points too. Each file contains its own styles and code, so these browser checks need neither a model nor a server. Keep the supplied files unchanged and experiment on copies.

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

Pi loads project context from **`AGENTS.md`**, not `agent.md`. This repository's [AGENTS.md](../AGENTS.md) contains the web stack, single-file output rule, baseline rules, editable defaults, and basic checking instructions. Start Pi from this repo so it discovers the file. Restart Pi or run `/reload` after editing it. Do not disable context loading with `--no-context-files` or `-nc`. Global and parent-directory instructions can also contribute context; a same-directory `AGENTS.override.md` takes precedence over `AGENTS.md`. See the [official project-instruction guide](https://pi.dev/docs/latest/quickstart#give-pi-project-instructions) and [context-file documentation](https://pi.dev/docs/latest/usage#context-files), consulted on 2026-09-19.

During setup, ask the agent to name the output file, starting jump strength, and first-step source without changing files. Confirm its answer matches `AGENTS.md`: root `index.html`, jump strength 650 for a new game, and `foundation/runner.html` copied only if no working game exists. Ask how it would add a double jump: count jumps and reset the count on landing and restart, as described in step 3A. This checks the intended context before relying on the short student prompts; it is not a student activity. Start a fresh conversation afterward.

Before timing the game prompt, try this small tool check in a separate conversation:

> Create `rehearsal-smoke.txt` in the current directory containing exactly `ready`. Read it back using a file tool, then edit it to contain exactly `ready to build` and read it again. Do not modify any other files. Report the final contents.

Verify the actual file contents yourself. If the agent only describes the actions, produces malformed tool requests, or cannot use the returned results, fix that integration first. Keep this disposable file outside any saved game checkpoint. Start a fresh conversation for the game rehearsal so the smoke test is not extra context.

## Rehearsal sequence

### 1. Prepare the game and explain

Start with no existing root `index.html`. If one already exists, preserve it under a separately named backup before moving it aside; do not overwrite a previous experiment. Start a fresh agent conversation from the repository root.

Type [the short build prompt](../prompts/01-build-runner.md) as a participant would. Measure typing time separately, then start the task timer when you submit it. Do not paste the technical instructions into the conversation; they should already be loaded from `AGENTS.md`. Confirm the agent follows step 1, copies the foundation without overwriting existing work, and avoids regenerating its styles and drawings. While it runs, practice the architecture explanation from the [workshop plan](workshop-plan.md), including the role of prepared instructions and code. Observe one tool request, a file copy, and any feedback returned to the model. Keep model/harness vocabulary generic during the explanation.

Record time to the first visible response, completed copy or edit, and a genuinely playable result. Include time spent repairing the result. Record output tokens and files read if the agent exposes them; do not estimate token counts from elapsed time. Note any truncated output, repeated tool calls, model/runtime errors, and severe memory pressure separately from game bugs. A fast copy is not a full-generation benchmark.

For an optional comparison, use a separate rehearsal with no root `index.html` and explicitly ask to build from scratch without copying the foundation or checkpoints. Keep the original short student prompt unchanged and record the extra instruction. Do not switch routes midway through a timed run without recording it.

Once the file exists, double-click the root `index.html` in Finder. Alternatively, from the repository root run:

```sh
open index.html
```

No development server should be needed. The generated file should contain its own styles and ordinary script. If it requires other files, dependency installation, or a remote service, it has missed the project instructions. Check instruction loading before making the student's prompt more technical.

If the game finishes before the explanation, leave it ready. If it is still unfinished at the end of the seven-minute explanation window, record that failure to fit the schedule. Practice stopping the pending generation, backing up the current `index.html`, and copying `checkpoints/01-baseline.html` to `index.html` in the repository root. Open the working copy and continue; the supplied save point makes this recovery route available even on the first rehearsal.

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

If something fails, record the observation and try [one focused repair](../prompts/repair.md). Capture any successful repair prompt with the result. Preserve local-model outputs under distinct names instead of overwriting the supplied reference games. To make an additional checkpoint, copy the working `index.html` under a new name and test it independently. See the [save-point guide](../checkpoints/README.md).

### 3. Make the manual change

Locate `CONFIG.jumpSpeed` in the embedded script in the root `index.html`. Predict the effect, change `650` to `780` (or record the generated starting value), save, and refresh the browser. Confirm a higher jump and point to the code that applies the jump strength.

Rehearse this using the same editor and keyboard actions the kids will use. Confirm you are editing the working root `index.html` and viewing that same copy. Back it up before asking for another feature. The supplied `02-higher-jump.html` is available if this step needs a fallback.

### 4. Add one feature

Type one of the [short feature prompts](../prompts/README.md) and time it, including inspection and playtesting. Start with the same manually edited baseline when comparing alternatives; use a fresh conversation for each independent comparison, with the project instructions loaded. Confirm the model follows the matching step in `AGENTS.md`, makes a small edit to `index.html`, and preserves the manual jump-strength change. It should not copy a finished feature checkpoint over the working game. Also try a paraphrased request to check that the setup supports the child's own wording.

| Feature | Check |
| --- | --- |
| Double jump | Two separate presses produce jumps; a third is ignored; holding the key does not consume extra jumps; landing and restart reset the allowance |
| Moon mode | Choose before starting; checkbox locks during play; lower gravity gives longer airtime; restart keeps the selected mode; switching back restores normal gravity |
| Progressive speed | Multipliers at scores 0, 4, 5, 9, 10, 40, 45 are 1.0, 1.0, 1.1, 1.1, 1.2, 1.8, 1.8; restart returns to 1.0 |

For high-score boundaries, inspect or temporarily exercise the calculation rather than requiring a child to survive a long run. If you use temporary test values, remove them before saving a checkpoint. Always finish with a real browser playtest.

Treat two minutes as an initial target for completing a feature edit, leaving the rest of its lesson slot for prediction, inspection, testing, and recovery. Adjust the feature menu based on measurements.

### 5. Check offline operation and repeatability

Close Pi and verify that the working game still runs. With the local model loaded, disable networking and separately verify that a fresh feature-edit request still works. This distinguishes offline gameplay from offline generation. Restore networking when finished if needed.

Repeat preparation and the selected feature edit to expose variation; a single successful run is insufficient for choosing classroom timings. Also repeat full generation if measuring that route. Record model-loading time separately from a run with the model already loaded. Prepare the laptops in the same warmed-up state intended for the workshop.

Preserve and validate each result before adding it as a save point. Later rehearsals should also time recovery: stop the agent, back up current work, copy the chosen save point, reopen the correct game, and continue the manual activity.

## Result log

Copy this table for each experiment. Record actual observations rather than expected results.

| Field | Result |
| --- | --- |
| Date / run identifier | |
| Setup or settings changed since last run | |
| Route: foundation reuse or full generation | |
| Foundation revision and AGENTS.md step used | |
| Files read / output tokens, if available | |
| Model already loaded? Loading time if not | |
| Exact typed prompt and example filename, if used | |
| Agent-instruction copy or revision | |
| Time to type and submit the request | |
| Time to first visible response | |
| Time to completed copy or edit | |
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

- Use the supplied foundation as the default route; measure preparation and feature edits separately.
- Offer full initial generation only if the separate rehearsal reliably fits inside the architecture explanation window. Keep the child's prompt short and record which route the workshop uses.
- Offer only features that can be generated, understood, and tested within the change activity.
- Keep verified save points available even when inference performs well.
- Build the presentation and final prompt cards from the verified output and timings.
