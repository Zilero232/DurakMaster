# Releasing to RuStore

Everything needed to publish DurakMaster on RuStore, in the order it is needed.

| Document | What it holds |
|---|---|
| [listing.md](./listing.md) | Store listing copy, screenshots, graphic assets |
| [privacy.md](./privacy.md) | Data collection answers for the console |
| [privacy-policy.md](./privacy-policy.md) | The policy text to publish at a public URL |
| [release-checklist.md](./release-checklist.md) | The pass to run before every submission |

The signing keys, API credentials and the CI step live in
[DEPLOY.md](../../DEPLOY.md#releasing-to-rustore).

---

## The short version

```bash
# once per machine
bun install
bunx eas login

# build an installable APK to test on a real device
cd apps/mobile && eas build --platform android --profile preview

# build the App Bundle RuStore accepts
cd apps/mobile && eas build --platform android --profile production
```

CI does the same through the **release** workflow, which takes a profile and an
optional `rustore` flag that uploads the finished build.

## Build profiles

`apps/mobile/eas.json` defines three:

- **development** — a dev client pointed at `localhost:4000`, for running Metro against a device.
- **preview** — an installable APK against staging. Use this for manual testing; an App Bundle
  cannot be sideloaded.
- **production** — an App Bundle (`.aab`) against the production API. This is what RuStore gets.

`appVersionSource: remote` means EAS owns `versionCode`, and `autoIncrement` raises it on every
production build. Do not bump it by hand — RuStore rejects a version that does not exceed the
published one.

The user-facing `version` in `app.json` is separate and belongs to you: raise it when the release
is worth naming.

## Environment

Each profile pins `EXPO_PUBLIC_API_URL`. It is baked into the bundle at build time, so a
production build cannot be pointed elsewhere afterwards — rebuild instead.

`EXPO_PUBLIC_YANDEX_REWARDED_UNIT_ID` is empty until the ad unit exists in the Yandex partner
interface; without it the rewarded-ad button hides itself.

The server needs its own environment; see `.env.example` for the full list.
