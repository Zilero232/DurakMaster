# DurakMaster

Online Durak: throw-in and transfer variants, 2–6 players, 24/36/52-card decks.
Android, iOS and web — from a single codebase.

## Stack

| Layer               | Technology                                                                    |
| ------------------- | ----------------------------------------------------------------------------- |
| Client              | Expo SDK 57, React Native 0.86, Expo Router, TanStack Query, Zustand, i18next |
| Table               | Native views + Reanimated (no canvas)                                         |
| Realtime            | `partysocket` ↔ `ws` + `@nestjs/platform-ws`                                  |
| API                 | NestJS 11 on Bun, Prisma 7, PostgreSQL, better-auth, nestjs-zod               |
| Game rules          | `packages/game-core` — pure functions, no dependencies                        |
| Table state         | In node memory, snapshotted to Postgres at turn boundaries                    |
| Directory / pub-sub | Valkey                                                                        |

**Why one client for every platform.** The web build goes through
`react-native-web` from the same code: a separate web frontend would mean two
sets of screens that drift apart with every edit. There are no desktop builds.

**Why the table is not on a canvas.** Cards are two or three dozen simple views,
animated by Reanimated on the UI thread. A canvas would require its own layout
system, its own fonts and manual hit handling.

**Why cards are drawn in code.** They used to be 36 SVG files, with deck themes
as CSS filters on top of them. React Native has no filters, so a card is
assembled from views and a theme is a set of colors. Deck assets are no longer
needed, and a card stays sharp at any screen density.

**The design system is a separate `ui-kit/` layer.** Every layer imports it, it
imports none of them: the deck theme and press feedback arrive through contexts
that the app fills in.

## Quick start

```bash
bun install                                  # dependencies
cp .env.example .env # fill in BETTER_AUTH_SECRET
bun dev:infra                                # Postgres + Valkey + Mailpit
bun --filter @durak-master/server db:migrate # DB schema
bun dev                                      # server + Metro
```

Then press `i` for iOS, `a` for Android, `w` for the browser in the Metro terminal.

Development mail: http://localhost:8025 (Mailpit).

In a debug build the server address is detected automatically from the host that
Metro serves the bundle from. To set it manually — `EXPO_PUBLIC_API_URL` in
`apps/mobile/.env`.

## Commands

```bash
bun dev            # server + client
bun android        # Android
bun ios            # iOS
bun web            # browser
bun typecheck      # types across all packages
bun lint:fix       # ESLint
bun format         # Prettier
bun verify         # types + lint + format
bun prebuild       # native projects (android/, ios/)
```

Table sounds — a ready-made Kenney set (CC0) in `apps/mobile/assets/sounds`.

## Structure

```text
apps/
├── mobile/     Expo client: app/ — Expo Router routes, ui-kit/ — design system, FSD layers at the root
└── server/     NestJS API + game rooms
packages/
├── schemas/    Zod schemas, shared between client and server
├── game-core/  Durak rules — pure, testable without the network
└── platform/   native abstraction: purchases, push, storage
docs/
├── games/          game rules — source of truth
├── fsd.md          client architecture
├── style.md        code style
└── play-store/     store release
```

## Documentation

- [Game rules](docs/games/) — read before editing `game-core`
- [FSD](docs/fsd.md) — client architecture
- [Code style](docs/style.md)
- [CLAUDE.md](CLAUDE.md) — project invariants

## License

Proprietary project.
