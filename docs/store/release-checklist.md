# Release checklist

Run through this before every submission. Anything unticked is a reason not to ship.

## Code

- [ ] `bun run verify` is green — types, tests, ESLint, Steiger, Prettier
- [ ] Sign-up, lobby, creating a table and a full deal checked by hand on a real phone, small
      and large screen: no clipped text, no overlap
- [ ] No `console.log` left in the client (`bun run lint` catches these)
- [ ] `version` in `apps/mobile/app.json` was raised if the release deserves a name

## Before the first release

- [ ] DNS for `api.durakmaster.ru` points at the VPS and resolves
- [ ] The API is served over HTTPS; Android blocks cleartext HTTP by default
- [ ] A Play Console app entry exists with the same package, and Play App Signing is enrolled
      with the upload certificate exported from `eas credentials`
- [ ] The Play service account is invited in **Users and permissions** and can release to tracks
      — Google takes up to 24 hours to propagate a fresh grant
- [ ] `EXPO_TOKEN` and `GOOGLE_PLAY_SERVICE_ACCOUNT` are set as repository secrets
- [ ] Every schema change carries its Prisma migration — `db:push` is a test-database
      shortcut, not a production path
- [ ] The signing key is uploaded to the Console and the same keystore still exists on EAS
- [ ] `EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID` is filled in the build profile — an empty value
      ships the app with the rewarded-ad button hidden
- [ ] Server-side verification is on for every rewarded ad unit (Android, and iOS once it
      exists) with the callback `https://api.durakmaster.ru/ads/admob-callback`, and
      **Verify URL** in the AdMob console answered 200 — see
      [google-play.md](./google-play.md#server-side-verification)

## Build

- [ ] Built with the **production** profile — an App Bundle, not an APK
- [ ] `EXPO_PUBLIC_API_URL` points at the production API, not staging or localhost
- [ ] The bundle was installed on a real device and a full deal was played through
- [ ] Sign-in, sign-up and sign-out work against production

## Server

- [ ] Migrations applied: `bun --filter @durak-master/server db:deploy`
- [ ] `BETTER_AUTH_SECRET` is a production secret, not the one from `.env.example`
- [ ] `/health` answers on the production host
- [ ] `https://api.durakmaster.ru/ads/admob-callback` is reachable from outside the VPS — an
      unsigned request answers 400, not a timeout or a Caddy error page

## Play Console

- [ ] Data safety form matches [data-safety.md](./data-safety.md) — it is re-reviewed every release
- [ ] IARC content rating questionnaire completed, gambling answered as none
- [ ] Target audience is 13+ — selecting any group under 13 triggers the Families Policy
- [ ] Ads declaration matches the build: `EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID` filled means
      "contains ads", empty means it does not
- [ ] The account-deletion URL resolves and the address on it is monitored — the only deletion
      route is email, so the inbox is the mechanism
- [ ] The privacy policy URL resolves
- [ ] Store listing screenshots match the current build (see [listing.md](./listing.md))
- [ ] Release notes written for the version
- [ ] The bundle landed on the **internal** track as a draft, not straight to production

## After the rollout

- [ ] The internal track build was opened by at least one tester
- [ ] Play pre-launch report reviewed — it runs the build on real devices and catches crashes
      the emulator does not
- [ ] Crash-free rate watched for the first day before widening the rollout
- [ ] The git tag matches the released version
