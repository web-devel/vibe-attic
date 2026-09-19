# Vibe Attic

A 45–60 minute workshop for kids aged 9–15: use AI to build a small dinosaur runner, look under the hood, and change its behavior on purpose.

The game uses **HTML, CSS, and JavaScript**, with a canvas for drawing. The planned workshop setup is an M1 MacBook with Pi, started through Ollama, and the locally running `qwen3.5:9b` model. The lesson explains the roles of the model, runtime, harness, generated code, and browser without focusing on product names.

## Start here

- [Workshop plan and agreed context](docs/workshop-plan.md)
- [M1 rehearsal guide](docs/m1-rehearsal.md)
- [Short prompts for the kids](prompts/README.md)
- [Slides for the TV](presentation/index.html): setup steps, the prompts, and the architecture diagram. Open the file in a browser; press `F` for fullscreen and `O` for an overview.
- [Agent instructions and technical defaults](AGENTS.md)
- [Playable save points](checkpoints/README.md)
- [Ready game foundation and extracted resources](foundation/README.md)

For a first rehearsal, run `ollama launch pi` in this repository's root, select `qwen3.5:9b` from the model list, and type [the short build prompt](prompts/01-build-runner.md). The agent copies the prepared [foundation](foundation/runner.html) to `index.html` if no working game exists. Kids then make the manual jump experiment and request one small rule change. The page, styles, and canvas drawings are already supplied; the local model edits only the requested behavior. Existing working games are preserved.

Kids type their own requests; the technical details and short step guides live together in `AGENTS.md`, which Pi loads automatically. The working game remains one offline `index.html` with embedded CSS and JavaScript. Explain that the first step reuses prepared code and later steps generate edits. Full generation from scratch remains an explicit rehearsal option.

Pi's project instruction filename is **`AGENTS.md`**, not `agent.md`. After changing it, restart Pi or run `/reload`. See [Pi's project-instruction documentation](https://pi.dev/docs/latest/quickstart#give-pi-project-instructions).

## Current status

Five prepared save points are available, each as a single offline HTML file. Start with [the baseline runner](checkpoints/01-baseline.html), or choose a version from the [save-point guide](checkpoints/README.md). Double-click a file to play; no server or installation is needed.

The save points and extracted foundation have automated checks for game behavior and self-contained assets. Browser playtesting on the M1 and timing the local-model prompts remain pending. These are prepared reference games, not recorded outputs of the M1 model. A first version of the TV slides is in `presentation/`; it repeats the prompt wording, so update both together. Final student materials and rehearsal-based slide changes will follow.
