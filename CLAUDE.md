# CLAUDE.md

Guidance for Claude Code when working in this repo. Keep it short, link out for details.

DurakMaster — online Durak for phones (Android + iOS). Bun workspaces monorepo.

- Every doc, indexed: [docs/README.md](docs/README.md)
- Game rules, the source of truth for `game-core`: [docs/games/](docs/games/README.md)
- The socket, tables in memory, `PlayerView`: [docs/architecture/realtime.md](docs/architecture/realtime.md); stakes and refunds: [docs/architecture/stakes.md](docs/architecture/stakes.md)
- Things that have already bitten us: [docs/architecture/pitfalls.md](docs/architecture/pitfalls.md)
- Running it locally: [docs/ops/local-dev.md](docs/ops/local-dev.md); deploying and Google Play: [docs/ops/deploy.md](docs/ops/deploy.md), [docs/store/](docs/store/README.md)

## Layout

| Path                 | What                                                                                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/mobile`        | Expo SDK 57 / React Native 0.86 / Expo Router. Phones only, portrait only: no web build, no tablet or desktop layouts. FSD with `views/` and a root `ui-kit/` — [CLAUDE.md](apps/mobile/CLAUDE.md) |
| `apps/server`        | NestJS 12 on Bun + Prisma 7 + Postgres, auth via better-auth, raw WebSocket (`ws` + `@nestjs/platform-ws`), table state in node memory — [CLAUDE.md](apps/server/CLAUDE.md)                        |
| `packages/game-core` | Durak rules: pure functions `(state, action) => state` — no transport, no DB, no vendors                                                                                                           |
| `packages/schemas`   | `@durak-master/schemas`: Zod contracts shared by the client and the server, socket messages included                                                                                               |
| `infra/`             | the Caddyfile for the VPS, the icon generator                                                                                                                                                      |
| `.github/workflows`  | `verify.yml` on every PR, `deploy.yml` and `release.yml` by hand                                                                                                                                   |

## Invariants that must not be broken

These are not style preferences — breaking any one of them breaks the game or its security.

1. **`packages/game-core` imports nothing except `@durak-master/schemas`.**
   Not NestJS, not Prisma, not React, not `ws`. This is what makes the rules testable
   without a network and lets us swap hosting/transport without rewriting the game.

2. **Randomness is cryptographic only and server-side only.**
   `crypto.randomInt()`, never `Math.random()`. The client does not shuffle the deck and
   does not decide the outcome — it only states an intent.

3. **The deck order never reaches the client.**
   The server sends a `PlayerView` — the player's own hand in full, only counters for
   everyone else, and only the size of the deck. Hiding cards on the client is
   unacceptable: they are visible in the traffic.

4. **The server is authoritative.** Every action is validated against the state before
   it is applied. `expectedVersion` guards against races and replays.

5. **Coins are not transferred between players.** Transfers create a grey market and the
   risk of stores reclassifying the app as gambling.

## Pinned dependencies

Two packages are pinned to an exact version on purpose. Raising either needs a manual check, not
just a green `bun verify` — both failures are invisible to the test suite.

- **`better-auth` / `@better-auth/expo` — exact version.** Better Auth owns the shape of the
  `user`, `session`, `account` and `verification` models in `apps/server/prisma/models/auth.prisma`,
  and changes it between patch releases. A column it no longer writes but the schema still
  requires breaks every insert: 1.7.3 dropped `account.issuer`, and sign-up answered a 500 with an
  empty body until the column went too. After any bump, compare those models with the release's
  `get-tables` schema, then sign up against a running API — it must print `200`:

  ```bash
  curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:4000/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"email":"probe@durak.local","password":"probe-password-1","name":"probe"}'
  ```

- **`typescript` — 6.0.3.** Expo SDK 57 installs it, and typescript-eslint refuses to run against
  TS 7, which takes the whole lint step down.

## Commands

```bash
mise install               # bun and node from mise.toml
bun install                # dependencies for all workspaces
bun dev:infra              # Postgres in Docker
bun dev:server             # API — one terminal
bun dev:mobile             # Expo — another terminal, this is where the QR code is
bun android                # build and install the development build (Expo Go cannot run the app)
bun verify                 # typecheck + tests + ESLint + Steiger + Prettier — what CI runs
bun fix                    # ESLint --fix + Prettier --write
bun run test               # Vitest, every workspace — never bare `bun test`
```

`bun dev` runs both apps through `bun --filter --parallel`, which hands Expo no terminal: no QR code
and no `a`/`r` keys. Details and the rest of the setup: [docs/ops/local-dev.md](docs/ops/local-dev.md).

## How to work

The full style guide is [docs/guides/](docs/guides/README.md) (split into `client/`, `server/`,
`shared/`). Digests in `.claude/rules/` load automatically by path, one topic per file: `client/`,
`server/`, `shared/`, `game-core/`, `testing/`. The key rules:

- **No explanatory comments in code.** Not `//` notes, not JSDoc describing what the code does or
  why — name things so it reads without them. Only two exceptions: `/** ... */` on a field of an
  exported `type` (editor autocomplete), and tool directives (`eslint-disable`,
  `@ts-expect-error`) with their reason ([comments](docs/guides/shared/comments.md)).
- **Game rules are a source of frequent and expensive bugs.** Before changing `game-core`, read
  `docs/games/`: the wording is fixed there, including the places where sources disagree, and the
  typical implementation mistakes.
- **Money paths**: `hasStakeHeld` is the authority on a held bet, refunds go only through
  `stake-released` ([stakes](docs/architecture/stakes.md)).
- **Socket for realtime, HTTP for the rest**; server data on the client lives in the TanStack Query
  cache, not in a store ([realtime](docs/architecture/realtime.md)).
- **Verify before claiming anything works** — `bun fix`, then `bun verify`
  ([checklist](docs/guides/shared/checklist.md)).

New design decisions go in the topical file under `docs/architecture/`, and the index in
[docs/README.md](docs/README.md) gets a line for any new file.
