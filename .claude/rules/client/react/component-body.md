---
paths:
  - 'apps/mobile/**/*.{ts,tsx}'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/client/component-body.md and react.md; keep them in sync. -->

# Client — component body

A component renders; a hook decides. Effects, timers, subscriptions, measuring and anything that
decides _what happens_ go into a hook in the slice's `model/hooks/`; the component keeps JSX and
small ternaries over prepared values.

Body order: hooks → derived `const`s → handlers → JSX. An early return sits after the hooks.

Hook order, a blank line between groups: navigation → translation/insets → store/context → data
(queries) → state → refs/shared values → memo/callbacks → effects → derived. A data dependency wins
over the group order.
