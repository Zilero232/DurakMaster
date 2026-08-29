# CLAUDE.md

Guidance for Claude Code when working in this repo. Keep it short, link out for details.

## What this is

DurakMaster — online Durak (Android + iOS + web). Bun workspaces monorepo.

- **Client**: Expo SDK 57 / React Native 0.86 / Expo Router (`apps/mobile/`).
  One codebase for every platform: native on phones, browser via `react-native-web`.
  There are no desktop builds.
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
├── game-core/       # Durak rules: pure functions (state, action) => state
└── platform/        # Native abstraction: purchases, push, storage
docs/
├── fsd.md           # Client architecture — read before structural edits
├── style.md         # Code style, import order, naming
├── games/           # Game rules — source of truth for game-core (durak)
└── play-store/      # Store release: listing, privacy, signing
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

## Commands

```bash
bun install                # dependencies for all workspaces
bun dev:infra              # Postgres + Valkey in Docker
bun dev:server             # API — one terminal
bun dev:mobile             # Expo — another terminal, this is where the QR code is
bun verify                 # typecheck + tests + ESLint + Steiger + Prettier
bun fix                    # ESLint --fix + Prettier --write
bun test:e2e               # Playwright against a running client and API
bun test:e2e:shots         # walk every screen and save shots to e2e/.shots/
bun android                # Android (needs a running emulator or device)
bun ios                    # iOS
bun web                    # browser
```

Releasing to Google Play — [docs/play-store/](./docs/play-store/README.md).

The two dev servers run in separate terminals on purpose: `bun --filter
--parallel` prefixes every output line with the package name, which mangles the
ANSI art Expo draws its QR code with.

## How to work

**No explanatory comments in code.** Not `//` notes, not JSDoc describing what the code
does or why — name things so it reads without them. Only two exceptions: `/** ... */` on
a field of an exported `type` (editor autocomplete), and tool directives
(`eslint-disable`, `@ts-expect-error`) with their reason. See `docs/style.md` §20.

Game rules are a source of frequent and expensive bugs. Before changing `game-core`,
read `docs/games/`: the wording is fixed there, including the places where sources
disagree, and the typical implementation mistakes.
