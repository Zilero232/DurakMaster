---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/comments.md; keep them in sync. -->

# Code — comments

No explanatory comments: no `//` notes, no JSDoc describing what or why. Name things instead — a
named constant for a condition, a named function for a block. Two exceptions: `/** ... */` on a
field of an exported `type`, and a tool directive with its reason on the same line
(`// eslint-disable-next-line <rule> -- <reason>`). Config files keep their explanatory comments.
