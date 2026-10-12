---
paths:
  - 'packages/game-core/**/*.ts'
---

<!-- Compressed editing rules for the game rules package, loaded automatically on edit. -->
<!-- The full reasoning is docs/games/ and the root CLAUDE.md; keep them in sync. -->

# game-core — the rules package

- Imports nothing but `@durak-master/schemas`: no NestJS, Prisma, React, `ws`, no `node:crypto`.
- Pure functions `(state, action) => state`. Randomness arrives as a `randomInt` parameter.
- `toPlayerView` decides what a phone sees: its own hand, counts for everything hidden.
- Read `docs/games/durak.md` before changing a rule — the wording is fixed there, including where
  sources disagree. Every entry in its checklist of typical mistakes has a test; a new rule arrives
  with one.
