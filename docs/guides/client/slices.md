# Slice structure

Part of the [style guide](../README.md).

## 1. Slice structure

Every slice is a folder of segments. The minimum is `ui/` + `index.ts`:

```text
widgets/game/durak-table/
  index.ts          ← public API (barrel)
  ui/               ← React components
  model/            ← hooks, Zustand store, form schemas, state types
  lib/              ← pure utilities of the slice
  api/              ← I/O boundary: HTTP calls, query hooks, mappers (if any)
  config/           ← constants, config
```

Slices in `features/` and `widgets/` are grouped by business domain (`auth`, `game`, `lobby`,
`profile`, `settings`, `rules`, `social`) — a layer on top of canonical FSD, see
[`docs/architecture/fsd.md`](../../architecture/fsd.md) §3. Always import down to the slice level:
`@/features/lobby/create-table`, not `@/features/lobby`.
