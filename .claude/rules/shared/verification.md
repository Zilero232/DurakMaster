---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/checklist.md; keep them in sync. -->

# Verification

Before claiming anything works: `bun fix`, then `bun verify` (typecheck, Vitest, ESLint, Steiger,
Prettier) — exactly what CI runs. Neither catches a better-auth bump (sign up by hand), native-only
breakage (run the development build on a device) or a screen that breaks on another phone size.
