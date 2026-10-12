---
paths:
  - '**/_tests/**/*.{ts,tsx}'
  - '**/vitest.config.*'
---

<!-- Auto-loaded when editing tests or their configs. -->
<!-- The full reasoning is docs/guides/shared/testing.md; keep them in sync. -->

# Tests — what to test

Pure logic, money and the rules. Game rules carry the most tests — each entry in the checklist of
`docs/games/durak.md` has one. Stakes are tested against a fake wallet that asserts balances.
Assert the relationship, not the business value: import `BOOST_PRICE` / `FREE_CREDITS_AMOUNT` and
compute against it. A test whose both sides come from the code under test cannot fail.
