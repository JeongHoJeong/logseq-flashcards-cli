# Logseq Flashcards from CLI

This script will randomly pick one of your Logseq #card and print it with `{{cloze ...}}`s hidden.

CAUTION: This script is now WORK IN PROGRESS.

## How to use
1. Install dependencies.
2. `git clone` this repository.
3. Set `LOGSEQ_DIR` environment variable.
4. Launch the script via `zx flashcards.mjs`.

## Dependencies
- Currently the script is only for my personal use, so there are a lot of prerequisite binaries.
  - https://github.com/google/zx
  - https://github.com/BurntSushi/ripgrep
  - https://github.com/antonmedv/fx

## Limitations
- It only supports markdown format.
