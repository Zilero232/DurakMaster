# CLAUDE.md — apps/server

Guidance for the API. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply.

**NestJS 12 on Bun** + Prisma 7 + Postgres, auth via better-auth, realtime over `ws`
(`@nestjs/platform-ws`). Bun runs `src/main.ts` directly in development (`bun --hot`); the image
bundles it with `bun build`.

## Layout

```text
src/
├── main.ts          # env validation, WsAdapter, helmet, the global filter, avatar static files
├── modules/
│   ├── ads/         # AdMob SSV callback — signature check, reward grant
│   ├── game/        # RoomsService, GameRoom, GameSession over game-core, game history
│   ├── health/      # /health
│   ├── profile/     # profile, avatar, balances, stakes — ProfileController
│   ├── realtime/    # the /ws gateway and the table/game/broadcast/connection services
│   └── social/      # friends, achievements, leaderboard, table invites — SocialController
├── lib/             # auth (better-auth instance + /api/auth proxy), prisma
├── common/          # app exceptions, AllExceptionsFilter, AuthGuard, @CurrentUserId
└── config/          # env schema (Zod), AppConfigService, pino options
prisma/
├── schema.prisma    # generator + datasource
├── models/          # one .prisma per domain; auth.prisma belongs to better-auth
└── migrations/      # one squashed init, new ones on top
```

## Commands

```bash
bun dev:server                                    # from the root, :4000, its own terminal
bun --filter @durak-master/server typecheck
bun --filter @durak-master/server db:migrate      # new migration + generate
bun --filter @durak-master/server db:reset        # wipe the dev database
bun --filter @durak-master/server db:studio
bun run test                                      # from the root — never bare `bun test`
curl localhost:4000/health
```

## Conventions that bite

- **One service per domain of work** in `services/`; controllers parse, delegate, return. Nothing
  but the class in a service or controller file — constants to `config/`, pure helpers to
  `lib/<concern>/`.
- **Import another module through its barrel** (`from '../game'`).
- **No `import type` here** — the lint rule is off for `apps/server/**` because Nest reads
  constructor dependencies from decorator metadata.
- **Input is parsed with a schema from `@durak-master/schemas`**; errors are the app exceptions with
  an `ApiErrorCode`.
- **The server decides.** Every action is checked against `expectedVersion` and validated by
  `game-core`; a phone gets only its `PlayerView`; randomness is `crypto.randomInt`.
- **Stakes**: `hasStakeHeld` is the authority, refunds go only through `stake-released`, balance
  writes are conditional `updateMany`s. Never a manual `releaseStake` next to `rooms.leave`.
- **No transfers** of coins or credits between players — not an endpoint, not a message.

## Gotchas

- **A better-auth bump can break sign-up silently** — `auth.prisma` must match what the pinned
  version writes. Compare with its `get-tables` schema and run the sign-up `curl` from the root
  `CLAUDE.md`.
- **`bun --hot` does not re-read `.env`** — restart after changing it. The `.env` is at the repo
  root.
- **A restart drops every table.** Rooms live in memory; shutdown refunds held stakes.
- **Bots exist only in development** (`table:add-bot` answers `BOTS_DISABLED` in production).
- **No CORS** — the only client is the native app.

## Where to read more

| Topic                                                       | Doc                                                                  |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| Module shape, input, errors, environment                    | [docs/guides/server/nestjs.md](../../docs/guides/server/nestjs.md)   |
| Prisma, migrations, conditional balance writes              | [docs/guides/server/data.md](../../docs/guides/server/data.md)       |
| The gateway, rooms in memory, `PlayerView`, reconnect grace | [docs/architecture/realtime.md](../../docs/architecture/realtime.md) |
| Stakes and refunds                                          | [docs/architecture/stakes.md](../../docs/architecture/stakes.md)     |
| better-auth, bearer, trusted origins, the schema            | [docs/architecture/auth.md](../../docs/architecture/auth.md)         |
| AdMob server-side verification                              | [docs/architecture/ads.md](../../docs/architecture/ads.md)           |
| The game rules                                              | [docs/games/](../../docs/games/README.md)                            |
| Deploying                                                   | [docs/ops/deploy.md](../../docs/ops/deploy.md)                       |

## Verification

```bash
bun --filter @durak-master/server typecheck
bun dev:server     # env validation only fires at boot
curl localhost:4000/health
```
