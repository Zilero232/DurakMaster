---
paths:
  - '**/*.md'
---

<!-- Compressed editing rules, loaded automatically when a Markdown file is edited. -->
<!-- The full reasoning is docs/README.md; keep them in sync. -->

# Docs

Where a thing goes:

- `docs/architecture/` — a design decision, the "why", one topic per file; `pitfalls.md` for what
  has already bitten us (symptom → cause → fix).
- `docs/games/` — the game rules, the source of truth for `game-core`.
- `docs/guides/{client,server,shared}/` — the full style guide; keep the `§` numbers.
- `docs/ops/` — local development, deploy. `docs/store/` — the Google Play paperwork.
- `.claude/rules/<area>/<topic>.md` — the compressed digest of a guide, with a `paths:`
  frontmatter. One topic per file.
- `CLAUDE.md` files — the short map and the rules that bite; they link out rather than repeat.

A new doc gets a line in `docs/README.md`. Links are relative to the file. `docs/` and `.claude/`
are in `.prettierignore`, so `bun format:check` skips them — run
`bunx prettier --write --ignore-path=<empty file> <file>` on what you touched.
