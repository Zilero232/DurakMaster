---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/functions.md and readability.md; keep them in sync. -->

# Code — functions

- Expression body for a single expression, block body for statements — `arrow-body-style` fixes it.
- Two or more parameters → one object, typed `<Name>Input` in a sibling `.types.ts`
  (`fanOverlap({ count, width, available, looseRatio })`).
- `if` / `else` always with braces (`curly: all`).
- Destructure a value read through the dot twice or more; rename when the bare name loses whose it is.
- State a condition once — no `hasX` flag next to a later `x === undefined` check.
