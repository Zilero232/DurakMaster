---
paths:
  - '**/_tests/**/*.{ts,tsx}'
  - '**/vitest.config.*'
---

<!-- Auto-loaded when editing tests or their configs. -->
<!-- The full reasoning is docs/guides/shared/testing.md; keep them in sync. -->

# Tests — running them

`bun run test` (Vitest over every workspace), never bare `bun test` — that is Bun's own runner and
fails on `vi.stubGlobal is not a function`. `bun verify` includes the tests.
