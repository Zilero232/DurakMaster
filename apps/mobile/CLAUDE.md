# CLAUDE.md — apps/mobile

Guidance for the Expo client. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply.

**Expo SDK 57 / React Native 0.86 / Expo Router**, Hermes, the new architecture. Phones only,
portrait only: Android now, iOS later. No web build (`platforms: ["android", "ios"]` in
`app.json`), no tablet or desktop layouts — do not add `Platform.OS === 'web'` branches,
breakpoints or `react-native-web`.

Architecture is **Feature-Sliced Design** with two local tweaks: `pages` → `views`, and the design
system lives at the root as `ui-kit`. Full rules: [docs/architecture/fsd.md](../../docs/architecture/fsd.md);
code style: [docs/guides/](../../docs/guides/README.md).

## Layer map

```text
app/          # Expo Router routes — one-line re-exports only: _layout, index, +not-found
views/        # whole screens: home, root-layout (the composition root), error, not-found
widgets/      # by domain: game/ lobby/ profile/ rules/ social/
features/     # by domain: auth/ game/ lobby/ profile/ settings/ social/
entities/     # game-table, session, settings, social
shared/       # api/ (auth, http, query, socket) config/ i18n/ lib/ model/ platform/
ui-kit/       # primitives/ components/ hooks/ icons/ theme/
```

Imports go downward only: `app → views → widgets → features → entities → shared`. `ui-kit` sits
beneath everything: every layer imports `@/ui-kit`, and it imports no `@/` path. Alias `@/*` →
`apps/mobile/*`.

## Commands

```bash
bun dev:mobile     # from the root: Metro, the QR code, a/r/j keys — keep it in its own terminal
bun android        # build and install the development build on a phone or emulator
bun ios            # the same for iOS (macOS)
bun --filter @durak-master/mobile typecheck
bun run test       # from the root — Vitest, never bare `bun test`
bun lint:fsd       # Steiger over apps/mobile
```

## Conventions that bite

- **Public API**: import the slice (`@/features/lobby/create-table`), never the domain group or past
  the barrel. `ui-kit` has one barrel — `@/ui-kit`.
- **`app/` holds route files only.** Anything else there becomes a route.
- **`ui-kit` gets app data through contexts** (`FeedbackProvider`, `CardThemeProvider`), filled in
  `views/root-layout`'s `AppProviders` — never an import.
- **Server data is in the TanStack Query cache.** CRUD goes over `httpClient` from a slice's
  `api/`; the socket carries only lobby, table and game traffic. The Zustand session store keeps the
  connection and the live table, never a copy of the profile.
- **Text only inside `<Text>`**, `&&` only with a boolean, one `transform` array per element — all
  three crash or silently break on device.
- **Tokens only** — no literal colors, sizes or durations; layout constants in
  `ui-kit/theme/layout.ts`, re-exported through the barrels. Sizing is fluid, never breakpoints.
- **Keyboard**: `react-native-keyboard-controller` (`KeyboardAwareScrollView`, its
  `KeyboardAvoidingView`) — React Native's own keyboard avoidance does nothing on Android
  edge-to-edge. No `Platform.OS` branches for it.
- **i18n**: every string through `t('area.key')`, both `locales/ru/` and `locales/en/` in the same
  commit.

## Gotchas

- **Expo Go cannot run this app** — it ships native modules Expo Go lacks
  (`react-native-google-mobile-ads`). Use the development build from `bun android`, and rebuild it
  after adding a native dependency or config plugin.
- **`bun dev` gives Expo no TTY** — no QR code. Run `bun dev:server` and `bun dev:mobile` in two
  terminals.
- **The API address** comes from Metro's host in a debug build (`shared/config/env.ts`); on the
  wrong LAN IP set `REACT_NATIVE_PACKAGER_HOSTNAME`. Release builds need `EXPO_PUBLIC_API_URL`, which
  each EAS profile sets.
- **The socket client is our own** (`shared/api/socket`), on React Native's `WebSocket` with a
  bearer header — `partysocket` crashed on Hermes.
- **i18next is initialised with `initAsync: false`** — the async default suspends the first render.
- **`bunfig.toml` uses the hoisted linker** so each native module is installed once.

More in [docs/architecture/pitfalls.md](../../docs/architecture/pitfalls.md) and
[docs/ops/local-dev.md](../../docs/ops/local-dev.md).

## Where to read more

| Topic                                                   | Doc                                                                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Layers, slices, `ui-kit` contexts, Expo Router          | [docs/architecture/fsd.md](../../docs/architecture/fsd.md)                                |
| The socket, `PlayerView`, reconnects, HTTP vs WebSocket | [docs/architecture/realtime.md](../../docs/architecture/realtime.md)                      |
| Sessions, the bearer token, sign-out                    | [docs/architecture/auth.md](../../docs/architecture/auth.md)                              |
| Rewarded ads                                            | [docs/architecture/ads.md](../../docs/architecture/ads.md)                                |
| Slice layout, styles, React, forms, i18n, animations    | [docs/guides/client/](../../docs/guides/README.md#client-appsmobile)                      |
| Builds, store release                                   | [docs/ops/deploy.md](../../docs/ops/deploy.md), [docs/store/](../../docs/store/README.md) |

## Verification

`bun verify` from the root. It does not run the app: anything native — a new module, a config
plugin, a Hermes-only API — is only proven on a device. Check every screen you touched on a small
phone and a large one.
