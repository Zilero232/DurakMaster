# Releasing to Google Play

How a build reaches the Play track. The listing copy, what the app collects and the
pre-submission pass live in [listing.md](./listing.md), [privacy.md](./privacy.md) and
[release-checklist.md](./release-checklist.md).

---

## The short version

```bash
# once per machine
bunx eas login

# build the App Bundle Play accepts
cd apps/mobile && eas build --platform android --profile production

# upload it to the internal track as a draft
cd apps/mobile && eas submit --platform android --profile production --latest
```

CI does both through the **release** workflow: pick the `production` profile and tick `play`.

## App signing

Play App Signing holds the real signing key; what you upload is signed with an **upload key**.
EAS generates and keeps that upload key — `eas credentials` shows it, and the same keystore must
keep being used for every release, or Play rejects the bundle.

On the first upload Play asks for the upload certificate. Export it from EAS:

```bash
cd apps/mobile && eas credentials --platform android
```

Choose the production build profile, then "Download certificate". Upload the resulting `.pem` in
the Play Console under **Setup → App signing**.

Never regenerate the upload key: a new one breaks every future update for installed users.

## The service account

EAS Submit uploads through the Google Play Developer API, which needs a service account:

1. Play Console → **Setup → API access** → link a Google Cloud project.
2. In Cloud Console create a service account, then create a **JSON key** for it.
3. Back in Play Console → **Users and permissions**, invite that service account's email and
   grant it **Release to testing tracks** and **Release to production** for this app only.
4. Save the JSON as `apps/mobile/google-play-key.json`. It is gitignored — it is a credential.

For CI the same JSON goes into the `GOOGLE_PLAY_SERVICE_ACCOUNT` repository secret, and the
workflow writes it back to that path before submitting.

The account needs the permission before the first upload, and Play takes up to 24 hours to
propagate a freshly granted one.

## Tracks

`eas.json` submits to the **internal** track as a **draft**. That is deliberate: a draft does not
reach testers until you promote it in the console, so a bad build costs nothing.

Promote by hand: internal → closed → open → production. The first production release cannot be
staged, so it always goes out at 100%; later ones support a staged rollout.

## What Play enforces

| Requirement | Where it is answered |
|---|---|
| Target API level 36 — required for every submission since 31 Aug 2026 | `app.json` pins `targetSdkVersion: 36` via `expo-build-properties` |
| 16 KB page sizes | The Expo SDK 57 / RN 0.86 native build satisfies it; third-party native SDKs do not automatically — see below |
| Data safety form | [data-safety.md](./data-safety.md) |
| Content rating (IARC) questionnaire | [data-safety.md](./data-safety.md#content-rating) |
| Privacy policy at a public URL | [privacy-policy.md](./privacy-policy.md) |
| Account deletion reachable from outside the app | [data-safety.md](./data-safety.md#account-deletion) |
| Target audience and children's policy | The game is rated 12+, not aimed at children |
| Ads declaration | Rewarded ads through AdMob — declare "contains ads" |
| Gambling and real-money games | Declared as none; see below |

## 16 KB page sizes

React Native has shipped 16 KB-aligned binaries since 0.77, so the Expo core needs nothing. That
says nothing about native SDKs we pull in ourselves: `react-native-google-mobile-ads` ships its
own `.so` files, and their alignment has not been verified here.

Check the bundle before the first upload:

```bash
# from the unpacked AAB
check_elf_alignment.sh path/to/lib
```

Google's script is in the NDK. A misaligned library is a rejection, and the fix is a newer SDK
version, not a build flag.

## AdMob

The App IDs in `app.json` are **Google's public test IDs**. They serve test ads and must be
replaced with the real ones before any release:

1. Create the app in the [AdMob console](https://apps.admob.com/), once per platform.
2. Copy each App ID (`ca-app-pub-XXXXXXXX~YYYYYYYY`) into the
   `react-native-google-mobile-ads` plugin block in `apps/mobile/app.json`.
3. Create a **rewarded** ad unit and put its id (`ca-app-pub-XXXXXXXX/YYYYYYYYYY`, a slash, not a
   tilde) into `EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID` in the build profile.
4. Link the AdMob app to the Play listing in the AdMob console once the app is published.

In development the unit id is unset, so the rewarded button hides itself rather than serving a
live ad.

**Consent.** AdMob requires a consent flow for users in the EEA and the UK before personalised
ads. `react-native-google-mobile-ads` ships Google's UMP SDK for this. Until that is wired, keep
the app out of those markets in the Play Console, or serve non-personalised ads only.

**App-ads.txt.** Once the listing is live, publish an `app-ads.txt` at the developer site
declaring the AdMob publisher id — without it Google restricts some demand.

## Gambling

Play treats a card game with an in-game currency as gambling only when that currency can be
bought or cashed out. Credits here are earned in game and cannot be bought, sold or transferred
between players — one of the invariants in `CLAUDE.md`.

Answer the console accordingly: no real-money gambling, no simulated gambling with a purchase
path, no loot boxes. If a credit purchase is ever added, this answer changes and the app needs
the gambling declaration.

## Version numbers

`appVersionSource: remote` means EAS owns `versionCode`, and `autoIncrement` raises it per
production build. Play rejects a bundle whose `versionCode` does not exceed the one already
published — including a bundle that was only uploaded to a draft and never released.

The user-facing `version` in `app.json` is separate: raise it when the release is worth naming.
