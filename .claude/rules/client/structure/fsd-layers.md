---
paths:
  - 'apps/mobile/**/*.{ts,tsx}'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/architecture/fsd.md; keep them in sync. -->

# Client — FSD layers and public API

Feature-Sliced Design with two local tweaks: `pages` → `views` and a root `ui-kit`; slices in
`features/` and `widgets/` grouped by business domain. Imports go downward only:
`app → views → widgets → features → entities → shared`. `ui-kit` sits beneath them all: every
layer may import `@/ui-kit`, and it imports no `@/` path at all — what it needs from the app arrives
through a context next to its consumer (`Button/feedback-context.ts`,
`PlayingCard/card-theme-context.ts`), filled in `views/root-layout` (`AppProviders`).

`bun lint:fsd` (Steiger) catches upward and cross-slice imports; `ui-kit` purity is caught at review.

## Public API

Import the slice (`@/features/lobby/create-table`), never the domain group (`@/features/lobby`) and
never past the barrel. `ui-kit` has one root barrel — `@/ui-kit`; a missing export is a line in
`ui-kit/index.ts`, not a deep import. `shared/` segments are imported by path (`@/shared/lib/cards`).
No `export *`; `export default` only in `app/` route files.

## `app/` is routes only

Expo Router turns every file in `app/` into a route. A route file is a one-line re-export of a
`views/` slice — no styles, types, components or helpers next to it.
