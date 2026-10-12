---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/imports-and-barrels.md; keep them in sync. -->

# Code — imports and barrels

`perfectionist/sort-imports`, a blank line between groups: external types → external values
(packages, `node:`, `@durak-master/*`) → `@/` types → `@/` values → relative types → relative
values → side-effect imports. `bun lint:fix` sorts; do not strip the blank lines.

Import through barrels. A barrel uses explicit named re-exports — `export *` is forbidden
(`export type *` of a hook's types is the one shorthand).
