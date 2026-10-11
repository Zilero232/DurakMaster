# CLAUDE.md

Guidance for Claude Code when working in this repo. Keep it short, link out for details.

## What this is

DurakMaster — online Durak for phones (Android + iOS). Bun workspaces monorepo.

- **Client**: Expo SDK 57 / React Native 0.86 / Expo Router (`apps/mobile/`).
  Phones only, portrait only: no web build, no desktop or tablet layouts. Do not add
  `Platform.OS === 'web'` branches, breakpoints or `react-native-web`.
- **API**: NestJS on Bun + Prisma 7 + Postgres, auth via better-auth (`apps/server/`)
- **Realtime**: raw WebSocket (`ws` + `@nestjs/platform-ws`), table state in node memory
- **Game rules**: pure package `packages/game-core/` — no transport, no DB, no vendors
- **Shared types**: Zod schemas in `packages/schemas/` (`@durak-master/schemas`)

## Layout

```text
apps/
├── mobile/          # Expo client: app/ — Expo Router routes, ui-kit/ — design system, FSD layers at the root (docs/fsd.md)
└── server/          # NestJS API — modules/, lib/, core/, common/
packages/
├── schemas/         # Zod schemas (@durak-master/schemas), shared between client and server
└── game-core/       # Durak rules: pure functions (state, action) => state
docs/
├── fsd.md           # Client architecture — read before structural edits
├── style.md         # Code style, import order, naming
├── games/           # Game rules — source of truth for game-core (durak)
└── store/           # Store release: listing, privacy, checklist
infra/               # Infrastructure configs
```

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

- **`better-auth` / `@better-auth/expo` — 1.7.2.** 1.7.4 answers `POST /api/auth/sign-up/email`
  with a 500 and an empty body. Sign-up has no test, so `bun verify` stays green.
  Check by hand after any bump — it must print `200`:

  ```bash
  curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:4000/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"email":"probe@durak.local","password":"probe-password-1","name":"probe"}'
  ```

- **`typescript` — 6.0.3.** Expo SDK 57 installs it, and typescript-eslint refuses to run against
  TS 7, which takes the whole lint step down.

## Commands

```bash
mise install               # bun and node from mise.toml
bun install                # dependencies for all workspaces
bun dev:infra              # Postgres + Valkey in Docker
bun dev                    # API + Expo together
bun dev:server             # API alone — one terminal
bun dev:mobile             # Expo alone — another terminal, this is where the QR code is
bun verify                 # typecheck + tests + ESLint + Steiger + Prettier
bun fix                    # ESLint --fix + Prettier --write
bun android                # Android (needs a running emulator or device)
bun ios                    # iOS
```

Releasing to Google Play — [DEPLOY.md](./DEPLOY.md), listing, privacy and the store
paperwork in [docs/store/](./docs/store/README.md).

`bun dev` runs both through `bun --filter --parallel`, which prefixes every output line with the
package name — that mangles the ANSI art Expo draws its QR code with. To scan the QR on a
device, run `dev:server` and `dev:mobile` in separate terminals.

## How to work

**No explanatory comments in code.** Not `//` notes, not JSDoc describing what the code
does or why — name things so it reads without them. Only two exceptions: `/** ... */` on
a field of an exported `type` (editor autocomplete), and tool directives
(`eslint-disable`, `@ts-expect-error`) with their reason. See `docs/style.md` §20.

Game rules are a source of frequent and expensive bugs. Before changing `game-core`,
read `docs/games/`: the wording is fixed there, including the places where sources
disagree, and the typical implementation mistakes.
