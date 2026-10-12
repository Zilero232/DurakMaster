---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/blank-lines.md; keep them in sync. -->

# Code — blank lines

No linter enforces them. A blank line before `return` (unless first), `throw`, `if`, `try`, loops
and `switch`, after every `if` block, and between logical steps. Consecutive `const`s of one group
(store selectors, unpacked props) stay together. In JSX, separate sibling blocks with a blank line.
