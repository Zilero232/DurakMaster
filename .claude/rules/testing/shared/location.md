---
paths:
  - '**/_tests/**/*.{ts,tsx}'
  - '**/vitest.config.*'
---

<!-- Auto-loaded when editing tests or their configs. -->
<!-- The full reasoning is docs/guides/shared/testing.md; keep them in sync. -->

# Tests — where they live

In a `_tests/` folder beside the code under test, with any shared fixture in the same folder
(`durak/_tests/fixture.ts`). The root `vitest.config.ts` lists one project per workspace.
