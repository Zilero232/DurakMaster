# Local development

Getting the API and the app running on your machine and a phone. Part of the
[documentation index](../README.md).

## Once

```bash
mise install                                  # bun 1.3.1 and node 22, pinned in mise.toml
bun install                                   # every workspace; also runs prisma generate
cp .env.example .env                          # fill in BETTER_AUTH_SECRET (openssl rand -base64 32)
bun dev:infra                                 # Postgres 5433 in Docker (docker-compose.dev.yml)
bun --filter @durak-master/server db:migrate  # apply the migrations to the dev database
```

`.env` lives at the repo root: the server starts from there (`bun --cwd ../.. --env-file .env`)
and `prisma.config.ts` reads it too. Postgres listens on **5433**, not 5432, so it does not clash
with a locally installed one.

To start the database over: `bun --filter @durak-master/server db:reset` drops it and re-applies
every migration.

## Every day — two terminals

```bash
bun dev:server     # the API on :4000, bun --hot
bun dev:mobile     # Metro on :8081 — the QR code and the a/r/j keys live here
```

Run them separately. `bun dev` starts both through `bun --filter --parallel`, which gives Expo no
terminal: no QR code and no keyboard shortcuts ([pitfalls](../architecture/pitfalls.md)). Both
scripts free their port first (`fkill`), so a crashed previous run does not block them.

`bun --hot` reloads code but does not re-read `--env-file` — after changing `.env`, stop and
start `dev:server` again.

## On a phone — a development build, not Expo Go

The app does not run in Expo Go: it ships native modules Expo Go lacks (`react-native-google-mobile-ads`
first of all). Build it once onto the device:

```bash
bun android        # expo run:android — needs a phone with USB debugging, or a running emulator
bun ios            # expo run:ios — macOS only
```

That compiles the native project, installs a debug build and points it at Metro. The build
includes `expo-dev-client`, so after that first install the phone needs no cable: open the app,
scan the QR code from `bun dev:mobile` (same Wi-Fi as the computer), and it loads the bundle from
Metro. Rebuild only when native code changes — a new native dependency, an Expo config plugin,
`app.json` plugin settings; JavaScript changes arrive over Metro.

In a debug build the API address is derived from the host that serves the bundle
(`shared/config/env.ts`: Metro's `hostUri` + port 4000), so the phone talks to the API on the same
machine without configuration. Set `EXPO_PUBLIC_API_URL` to pin it elsewhere.

## Expo CLI tips

- **`j`** in the `dev:mobile` terminal opens React Native DevTools (console, network, React tree)
  for the connected app.
- **`EXPO_EDITOR`** — set it (e.g. `EXPO_EDITOR=code`) so "open in editor" from an error overlay or
  DevTools lands in your editor.
- **`REACT_NATIVE_PACKAGER_HOSTNAME`** — when Metro advertises the wrong LAN address (a VPN, a
  virtual adapter, WSL), the phone cannot reach the bundle or the API. Set it to the IP the phone
  can reach before `bun dev:mobile`; the API address follows, because it is derived from the same
  host.

## Bots

In development, `table:add-bot` fills an empty seat with a bot (`TableFlowService.addBot`); the
server refuses it with `BOTS_DISABLED` in production.
