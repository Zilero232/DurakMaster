---
paths:
  - 'apps/mobile/**'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/ops/local-dev.md and docs/architecture/pitfalls.md; keep them in sync. -->

# Client — native platform

- The app is Android + iOS only (`platforms` in `app.json`); there is no web or desktop target.
- It does not run in Expo Go — it ships native modules Expo Go lacks. A new native dependency or
  config plugin means rebuilding the development build (`bun android`), not just reloading Metro.
- Bun installs with `linker = "hoisted"` (`bunfig.toml`) so each native module exists once.
- Native SDKs are wrapped in `shared/platform/` (rewarded ads); a slice calls the adapter, never the
  SDK.
- `EXPO_PUBLIC_*` values are baked in at build time; in a debug build the API address comes from
  Metro's host (`shared/config/env.ts`).
