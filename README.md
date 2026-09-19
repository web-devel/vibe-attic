# Vibe Attic

A 45–60 minute workshop for kids aged 9–15: use AI to build a small dinosaur runner, look under the hood, and change its behavior on purpose.

The game uses **HTML, CSS, and JavaScript**, with a canvas for drawing. The planned workshop setup is an M1 MacBook with Pi and a locally running Qwen 3.6 model. The lesson explains the roles of the model, runtime, harness, generated code, and browser without focusing on product names.

## Start here

- [Workshop plan and agreed context](docs/workshop-plan.md)
- [M1 rehearsal guide](docs/m1-rehearsal.md)
- [Short prompts for the kids](prompts/README.md)
- [Agent instructions and technical defaults](AGENTS.md)
- [Save-point conventions](checkpoints/README.md)

For a first rehearsal, launch Pi in this repository's root and type [the short build prompt](prompts/01-build-runner.md). Kids type their own requests about the game; the technical details live in `AGENTS.md`, which Pi loads automatically. Those instructions direct the output to `game/index.html`, `game/style.css`, and `game/game.js`. Open the resulting HTML file in your browser, try the manual jump experiment, and type one feature request.

Pi's project instruction filename is **`AGENTS.md`**, not `agent.md`. After changing it, restart Pi or run `/reload`. See [Pi's project-instruction documentation](https://pi.dev/docs/latest/quickstart#give-pi-project-instructions).

## Current status

This repository contains the workshop context, candidate prompts, and rehearsal instructions. The prompts have not yet been tested on the M1. Generated games, verified save points, final student materials, and the presentation will be added after rehearsal.
