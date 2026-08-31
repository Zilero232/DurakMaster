# DurakMaster

Online Durak — throw-in and transfer variants, 2–6 players, 24/36/52-card decks.
Android, iOS and web from a single codebase.

## Stack

| Layer       | Technology                                                                    |
| ----------- | ----------------------------------------------------------------------------- |
| Client      | Expo SDK 57, React Native 0.86, Expo Router, TanStack Query, Zustand, i18next |
| Table       | Native views + Reanimated (no canvas)                                         |
| Realtime    | `partysocket` ↔ `ws` + `@nestjs/platform-ws`                                  |
| API         | NestJS 12 on Bun, Prisma 7, PostgreSQL, better-auth                           |
| Game rules  | `packages/game-core` — pure functions, no dependencies                        |
| Table state | In node memory, snapshotted to Postgres at turn boundaries                    |

**One client for every platform.** The web build goes through `react-native-web`
from the same source: a separate web frontend would mean two sets of screens that
drift apart with every edit.

**The table is not a canvas.** Cards are a few dozen plain views animated by
Reanimated on the UI thread. A canvas would need its own layout system, its own
fonts and manual hit testing.

**Cards are drawn in code.** They used to be 36 SVG files with deck themes as CSS
filters. React Native has no filters, so a card is assembled from views and a
theme is a set of colours — no deck assets, and a card stays sharp at any density.

**`ui-kit/` is a terminal layer.** Every layer imports it, it imports none of
them: the deck theme and press feedback arrive through contexts the app fills in.

## Quick start

```bash
bun install
cp .env.example .env                          # fill in BETTER_AUTH_SECRET
bun dev:infra                                 # Postgres in Docker
bun --filter @durak-master/server db:migrate  # database schema

bun dev:server                                # API — one terminal
bun dev:mobile                                # Expo — another, the QR code lives here
```

Then press `a` for Android or `w` for the browser in the Metro terminal.

The two dev servers run separately on purpose: `bun --filter --parallel` prefixes
every line with the package name, which mangles the ANSI art Expo draws its QR
code with.

In a debug build the API address is derived from the host serving the bundle. To
pin it, set `EXPO_PUBLIC_API_URL`.

## Commands

```bash
bun verify              # typecheck + tests + ESLint + Steiger + Prettier
bun fix                 # ESLint --fix + Prettier --write

bun test                # unit tests
bun test:e2e            # Playwright against a running client and API
bun test:e2e:shots      # walk every screen, save shots to e2e/.shots/

bun android             # Android (needs an emulator or a device)
bun ios                 # iOS
bun web                 # browser
bun prebuild            # native projects (android/, ios/)
```

`bun verify` is what CI runs — keep it green.

## Structure

```text
apps/
├── mobile/     Expo client: app/ — routes, ui-kit/ — design system, FSD layers at the root
└── server/     NestJS API + game rooms
packages/
├── schemas/    Zod schemas shared by client and server
├── game-core/  Durak rules — pure, testable without a network
└── platform/   native abstraction: purchases, push, storage
e2e/            Playwright specs and the screenshot walk
infra/          Caddy config for the production VPS
docs/
├── games/      game rules — the source of truth
├── fsd.md      client architecture
├── style.md    code style
└── store/      store release
```

## Testing

| Level | Where                              | What it covers                            |
| ----- | ---------------------------------- | ----------------------------------------- |
| Rules | `packages/game-core/**/_tests`     | Beating, throw-ins, transfers, exit order |
| Rules | `durak/_tests/rule-matrix.test.ts` | Every mode × deck × scope combination     |
| Unit  | `apps/*/src/**/_tests`             | Pot splitting, room lifecycle, socket     |
| E2E   | `e2e/*.spec.ts`                    | Sign-up, lobby, creating a table, a deal  |

Game rules are where bugs cost the most — read [docs/games/durak.md](docs/games/durak.md)
before touching `game-core`. Its checklist of typical mistakes is what the rule
tests are built from.

## Deployment

- **Web and API** — [DEPLOY.md](DEPLOY.md): images to ghcr, a VPS behind Caddy
- **Android** — [docs/store/](docs/store/README.md): EAS build, RuStore

## Documentation

- [Game rules](docs/games/) — read before editing `game-core`
- [FSD](docs/fsd.md) — client architecture
- [Code style](docs/style.md)
- [CLAUDE.md](CLAUDE.md) — project invariants
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to work in this repository
- [SECURITY.md](SECURITY.md) — reporting a vulnerability

Table sounds are a Kenney set (CC0) in `apps/mobile/assets/sounds`.

## License

Proprietary — all rights reserved. See [LICENSE](LICENSE).
