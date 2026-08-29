# Releasing to Google Play

Everything needed to publish DurakMaster on Google Play, in the order it is needed.

| Document | What it holds |
|---|---|
| [listing.md](./listing.md) | Store listing copy, screenshots, graphic assets |
| [privacy.md](./privacy.md) | Data safety answers and the privacy policy source |
| [signing.md](./signing.md) | Keystore, Play App Signing, service account |
| [release-checklist.md](./release-checklist.md) | The pass to run before every submission |

---

## The short version

```bash
# once per machine
bun install
bunx eas login

# build an internal APK to test on a real device
cd apps/mobile && eas build --platform android --profile preview

# build the App Bundle Google Play accepts
cd apps/mobile && eas build --platform android --profile production

# upload it to the internal track as a draft
cd apps/mobile && eas submit --platform android --profile production --latest
```

CI does the same through the **release** workflow, which takes a profile
and an optional `submit` flag.

## Build profiles

`apps/mobile/eas.json` defines three:

- **development** — a dev client pointed at `localhost:4000`, for running Metro against a device.
- **preview** — an installable APK against staging. Use this for manual testing; an App Bundle
  cannot be sideloaded.
- **production** — an App Bundle (`.aab`) against the production API. This is the only artefact
  Google Play accepts for a public release.

`appVersionSource: remote` means EAS owns `versionCode`, and `autoIncrement` raises it on every
production build. Do not bump it by hand — a duplicate `versionCode` is rejected at upload.

The user-facing `version` in `app.json` is separate and belongs to you: raise it when the release
is worth naming.

## Environment

Each profile pins `EXPO_PUBLIC_API_URL`. It is baked into the bundle at build time, so a
production build cannot be pointed elsewhere afterwards — rebuild instead.

The server needs its own environment; see `.env.example` for the full list.
