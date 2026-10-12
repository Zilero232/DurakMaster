# Documentation index

Everything under `docs/`, grouped by concern. Agent-facing editing digests live separately in [.claude/rules/](../.claude/rules/) (loaded by path) and in the `CLAUDE.md` files: [root](../CLAUDE.md), [apps/mobile](../apps/mobile/CLAUDE.md), [apps/server](../apps/server/CLAUDE.md). The public overview is the [README](../README.md); how to work in the repo is [CONTRIBUTING.md](../CONTRIBUTING.md), reporting a vulnerability [SECURITY.md](../SECURITY.md).

## Architecture

Design decisions — the "why" behind the code, and what has already gone wrong.

- [architecture/fsd.md](architecture/fsd.md) — Feature-Sliced Design as used by `apps/mobile`: layers, slices, segments, `ui-kit` and its contexts, Expo Router routes. Read before structural changes.
- [architecture/realtime.md](architecture/realtime.md) — the WebSocket gateway, tables in node memory, `PlayerView`, `expectedVersion`, the reconnect grace, the client socket on React Native's `WebSocket`; CRUD over HTTP.
- [architecture/stakes.md](architecture/stakes.md) — credits held and returned once, `hasStakeHeld` as the authority, refunds only through `stake-released`, no transfers between players.
- [architecture/auth.md](architecture/auth.md) — better-auth in the API, the bearer token for HTTP and the socket, trusted Expo origins, the auth schema belongs to better-auth.
- [architecture/ads.md](architecture/ads.md) — rewarded ads granted only by AdMob's signed server-side callback.
- [architecture/pitfalls.md](architecture/pitfalls.md) — things that have already bitten us: symptom, cause, fix.

## Game rules

The source of truth for `packages/game-core`. Read before any change to the rules.

- [games/README.md](games/README.md) — what every game shares, how to add one.
- [games/durak.md](games/durak.md) — Durak: throw-in and transfer, jokers, where sources disagree, the checklist of typical mistakes.
- [games/architecture.md](games/architecture.md) — how several games live in one `game-core` and one server.

## Guides

The style guide, split by stack. Index and tooling: [guides/README.md](guides/README.md).

- `guides/client/` — slices, `ui/` and `ui-kit`, `model/hooks`, styles and the theme, component size and body order, React, segments, forms, conditional render, animations, i18n.
- `guides/server/` — [NestJS modules](guides/server/nestjs.md), [Prisma and money writes](guides/server/data.md).
- `guides/shared/` — naming, imports and barrels, types, functions, blank lines, readability, comments, shared schemas, tests, forbidden list, pre-commit checklist, commit messages.

## Ops

- [ops/local-dev.md](ops/local-dev.md) — mise, the dev database, the API and Metro in two terminals, a development build on a phone, Expo CLI tips.
- [ops/deploy.md](ops/deploy.md) — the VPS behind Caddy, CI secrets, the production `.env`, migrations, the Google Play release workflow, the AdMob callback.

## Store

- [store/](store/README.md) — the Google Play release: signing and tracks, listing copy, privacy policy, Data safety answers, the pre-submission checklist.
