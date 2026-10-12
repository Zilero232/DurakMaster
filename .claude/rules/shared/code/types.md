---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/types.md; keep them in sync. -->

# Code — types

`type`, never `interface`; `unknown`, never `any`; no `!` without a reason. `import type` for types
(off on the server). Props in `Name.types.ts`. Props and their destructuring share one order: data →
identifiers/`style` → `on<Event>` handlers. JSX attributes and union members are sorted by the
linter. A shared domain type comes from `@durak-master/schemas`, never redeclared.
