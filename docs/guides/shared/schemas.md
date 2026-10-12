# Shared schemas

Part of the [style guide](../README.md).

## 14. Shared schemas — `@durak-master/schemas`

Zod schemas and types shared between client and server go into `packages/schemas`, one folder per
domain:

```text
packages/schemas/src/
  api/         ← ApiErrorCode and the error body
  auth/        ← credentialsSchema
  game/        ← core/ (cards, actions, state, table settings, boosts) and games/durak/ (state, actions, view)
  lobby/       ← lobbyTableSchema, LobbyTable
  profile/     ← MyProfile, PublicProfile, setNameInputSchema, setAvatarInputSchema
  realtime/    ← clientMessageSchema, serverMessageSchema, phrases, taunts
  social/      ← friends, achievements, leaderboard
  index.ts
```

```ts
// ✓ OK
import type { TableSettings } from '@durak-master/schemas';

import { tableSettingsSchema } from '@durak-master/schemas';

// ✗ NOT OK — duplicating the contract on the client
type TableSettings = { bet: number; maxPlayers: number };
```

`@/shared/api` exports only runtime (the HTTP, socket and better-auth clients, the `QueryClient`), not domain types.

Every WebSocket message in both directions is a member of `clientMessageSchema` /
`serverMessageSchema`: the server parses what it receives, the client parses what it receives, and
a new message type is added to the schema first.

**FormValues vs Request types.** One zod schema gives two types — `.default()` / `.transform()` make `z.input` and `z.output` incompatible:

- `z.input<typeof schema>` — the shape of the data **before** validation, for the form's `defaultValues`.
- `z.output<typeof schema>` — the shape **after** validation (defaults applied, transforms run), for submit / sending to the server.

This is the "validation stage" axis, not "HTTP request/response". The entity type from a response is a separate one (`LobbyTable`), not the `z.output` of an input schema.

A form schema may **extend** the domain schema with a field that is absent from the snapshot (the table password: the server accepts it separately and never puts it into the table state) — see `features/lobby/create-table/model/create-table-form.ts`.

`packages/schemas` imports nothing but `zod`; `packages/game-core` imports nothing but
`@durak-master/schemas` (root [`CLAUDE.md`](../../../CLAUDE.md), invariant 1).
