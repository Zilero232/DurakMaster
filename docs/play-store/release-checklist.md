# Release checklist

Run through this before every submission. Anything unticked is a reason not to ship.

## Code

- [ ] `bun run verify` is green — types, tests, ESLint, Steiger, Prettier
- [ ] `bun run test:e2e` passes against a locally running API and client
- [ ] `bun run test:e2e:shots` was reviewed: no clipped text, no overlap, both viewports
- [ ] No `console.log` left in the client (`bun run lint` catches these)
- [ ] `version` in `apps/mobile/app.json` was raised if the release deserves a name

## Before the first release

- [ ] DNS for `durakmaster.ru`, `www` and `api` points at the VPS, and both resolve
- [ ] The API is served over HTTPS; Android blocks cleartext HTTP by default
- [ ] A Play Console app entry exists with package `com.durakmaster.app`
- [ ] `EXPO_TOKEN` and `PLAY_SERVICE_ACCOUNT` are set as repository secrets
- [ ] An initial Prisma migration is committed — `apps/server/prisma/migrations/` is empty, and
      `db:push` is a test-database shortcut, not a production path

## Build

- [ ] Built with the **production** profile — an App Bundle, not an APK
- [ ] `EXPO_PUBLIC_API_URL` points at the production API, not staging or localhost
- [ ] The bundle was installed on a real device and a full deal was played through
- [ ] Sign-in, sign-up and sign-out work against production

## Server

- [ ] Migrations applied: `bun --filter @durak-master/server db:deploy`
- [ ] `BETTER_AUTH_SECRET` is a production secret, not the one from `.env.example`
- [ ] `CORS_ORIGINS` lists the production client origin
- [ ] `/health` answers on the production host

## Play Console

- [ ] Data safety form matches [privacy.md](./privacy.md)
- [ ] Content rating questionnaire completed
- [ ] Target audience set — the game is **not** aimed at children
- [ ] Ads declaration answered
- [ ] Store listing screenshots match the current build (see [listing.md](./listing.md))
- [ ] Release notes written for the version

## After the rollout

- [ ] The internal track build was opened by at least one tester
- [ ] Crash-free rate watched for the first day before widening the rollout
- [ ] The git tag matches the released version
