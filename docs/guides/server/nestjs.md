# Server modules — NestJS

Part of the [style guide](../README.md).

## 19. Server — NestJS on Bun

The API is NestJS 12 on Bun: Bun runs `src/main.ts` directly in development (`bun --hot`), and
`bun build` bundles it for the image. The project invariants (server authority, cryptographic
randomness, `PlayerView`) are in the root [`CLAUDE.md`](../../../CLAUDE.md); the game rules are in
[`docs/games/`](../../games/README.md) and their implementation is `packages/game-core`, which the
server imports and never re-implements.

```text
apps/server/src/
├── main.ts          ← env validation, WsAdapter, helmet, the global filter, avatar static route
├── app.module.ts
├── modules/         ← one folder per domain: ads, game, health, profile, realtime, social
├── lib/             ← integrations wrapped as modules: auth (better-auth), prisma
├── common/          ← exceptions, the global filter, AuthGuard, @CurrentUserId
└── config/          ← env schema (Zod), AppConfigService, pino options
```

## Module convention

A module is `x.module.ts`, an optional `x.controller.ts`, `services/`, plus `lib/` and `config/`
as needed, and an `index.ts` that is the module's public API:

```text
apps/server/src/modules/game/
  game.module.ts
  services/            ← RoomsService, GameHistoryService
  lib/                 ← GameRoom, GameSession, one folder per pure helper (next-free-seat/, room-timers/ …)
  config/              ← constants, one file per concern (bot, boost, reconnect)
  index.ts
```

- **Controllers stay thin**: parse the input, delegate, return. Business logic lives in
  `services/<domain>.service.ts` — `social/services/` holds `friends`, `achievements`,
  `leaderboard`, `online-players`, `table-invites`, not one fat service.
- **Nothing but the class in a service or controller file.** Constants go to `config/`, pure
  functions to `lib/<concern>/`, exported types next to the class only when a consumer needs them.
- **Import another module through its barrel** (`from '../game'`, `from '../profile'`), never
  into its files.
- **`import type` is off on the server** (`ts/consistent-type-imports` is disabled for
  `apps/server/**`): Nest resolves constructor dependencies from decorator metadata, and a
  type-only import erases it — the app then fails with "Nest can't resolve".

## Input and errors

- There are no DTO classes. A controller takes `@Body() body: unknown` and parses it with a schema
  from `@durak-master/schemas` (`setNameInputSchema.parse(body)`), so the client and the server
  validate against one definition. A `ZodError` becomes a `400 { code: 'BAD_REQUEST' }` in
  `AllExceptionsFilter`.
- Errors are the app exceptions from `common/exceptions` (`AppBadRequestException`,
  `AppForbiddenException`, …) with an `ApiErrorCode` from `@durak-master/schemas`. The body is
  `{ code, error }`: the code is the contract, the message is free text.
- A service that can fail in an expected way returns a `neverthrow` `Result`
  (`FriendResult` in `social`); the controller turns an `Err` into an app exception.
- Authenticated HTTP routes carry `@UseGuards(AuthGuard)` and read the user with
  `@CurrentUserId()`. The guard asks better-auth for the session from the request headers — the
  `Authorization: Bearer` header the app sends.

## Realtime

One `@WebSocketGateway({ path: '/ws' })` in `modules/realtime`, on `WsAdapter`. The gateway only
authenticates, rate-limits, parses with `clientMessageSchema` and routes; the work is in services
(`TableFlowService`, `GameFlowService`, `BroadcastService`, `ConnectionService`, …). Every message
the server sends is a `ServerMessage` from `@durak-master/schemas`. The design — table state in
memory, `PlayerView`, `expectedVersion`, reconnect grace — is
[`docs/architecture/realtime.md`](../../architecture/realtime.md).

## Environment

`config/env.schema.ts` is parsed once in `main.ts` before Nest starts and **throws** on a missing or
malformed variable. Read values through `AppConfigService` (`config.isDevelopment`,
`config.publicUrl`), not `process.env`. The `.env` file sits at the repo root; `bun --hot` reloads
code but does not re-read `--env-file`, so an env change needs a full restart.
