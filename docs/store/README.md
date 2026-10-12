# Releasing to Google Play

Everything needed to publish DurakMaster on Google Play, in the order it is needed.

| Document                                       | What it holds                                       |
| ---------------------------------------------- | --------------------------------------------------- |
| [google-play.md](./google-play.md)             | App signing, the service account, tracks, AdMob     |
| [listing.md](./listing.md)                     | Store listing copy, screenshots, graphic assets     |
| [privacy.md](./privacy.md)                     | What the app collects                               |
| [privacy-policy.md](./privacy-policy.md)       | The policy text to publish at a public URL          |
| [data-safety.md](./data-safety.md)             | The Data safety form, content rating, ads, audience |
| [release-checklist.md](./release-checklist.md) | The pass to run before every submission             |

The signing keys, API credentials and the CI step live in
[docs/ops/deploy.md](../ops/deploy.md#releasing-to-google-play).

---

## The short version

```bash
# once per machine
bun install
bunx eas login

# build an installable APK to test on a real device
cd apps/mobile && eas build --platform android --profile preview

# build the App Bundle Play accepts
cd apps/mobile && eas build --platform android --profile production
```

CI does the same through the **release** workflow, which takes a profile and a `play` flag that
submits the finished build.

## Build profiles

`apps/mobile/eas.json` defines three:

- **development** — a dev client pointed at `localhost:4000`, for running Metro against a device.
- **preview** — an installable APK against staging. Use this for manual testing; an App Bundle
  cannot be sideloaded.
- **production** — an App Bundle (`.aab`) against the production API. This is what Play gets.

`appVersionSource: remote` means EAS owns `versionCode`, and `autoIncrement` raises it on every
production build. Do not bump it by hand — Play rejects a version that does not exceed the
published one.

The user-facing `version` in `app.json` is separate and belongs to you: raise it when the release
is worth naming.

## Environment

Each profile pins `EXPO_PUBLIC_API_URL`. It is baked into the bundle at build time, so a
production build cannot be pointed elsewhere afterwards — rebuild instead.

`EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID` is empty until the ad unit exists in the AdMob
interface; without it the rewarded-ad button hides itself.

The server needs its own environment; see `.env.example` for the full list.
