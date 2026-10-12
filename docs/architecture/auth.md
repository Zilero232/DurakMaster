# Auth — better-auth, a bearer token everywhere

Accounts are email and password through better-auth, mounted inside the NestJS API. The phone
holds the session in its secure store and presents it as a bearer token on every HTTP request and
on the WebSocket upgrade. Part of the [documentation index](../README.md).

## The server

`apps/server/src/lib/auth/auth.config.ts` builds the instance:

- `prismaAdapter` on the app's Postgres — better-auth writes the `user`, `session`, `account` and
  `verification` tables through Prisma.
- Email and password, no email verification, passwords of 8+ characters.
- Sessions last 30 days and are refreshed once a day of use.
- The `bearer()` plugin, so a session can be presented as `Authorization: Bearer <token>` instead
  of a cookie — the only form a WebSocket upgrade from React Native can carry.

`AuthController` mounts better-auth's own handler at `/api/auth/*`: it turns the Express request
into a Fetch `Request` and copies the response back. Everything else that needs a user asks the
same instance — `AuthService.resolveUserId(headers)` calls `auth.api.getSession`, and both
`AuthGuard` (HTTP) and `ConnectionService.authenticate` (the socket) go through it.

## The client

`apps/mobile/shared/api/auth/auth-client.ts` is `createAuthClient` with the `@better-auth/expo`
plugin: the scheme `durakmaster`, storage in `expo-secure-store` under the `durak-master` prefix.
`getAuthToken()` reads the stored session cookie and returns the token; the axios `httpClient`
attaches it on every request and the socket client puts it on the upgrade
([realtime](realtime.md)). `useSession` drives the signed-in / signed-out split.

Signing out (`features/auth/sign-out`) revokes the session first, then disconnects the socket,
resets the social store and clears the Query cache — so the next connection cannot reuse the old
user's state.

## Trusted origins

better-auth rejects a request whose origin it does not trust. A native app has no web origin; the
Expo plugin sends the app's scheme instead.

```ts
trustedOrigins: IS_PRODUCTION ? [APP_ORIGIN] : [APP_ORIGIN, EXPO_DEV_ORIGINS];
```

- **Production** — only `durakmaster://`, the scheme in `app.json`.
- **Development** — also `exp://**`, the origin a build served by the Expo dev server reports.

There is no CORS configuration: the web build and its origins are gone, and a native client is not
subject to CORS ([pitfalls](pitfalls.md)).

## The schema belongs to better-auth

The four models in `apps/server/prisma/models/auth.prisma` are better-auth's, not ours. They must
match what the pinned version writes, column for column, and better-auth changes that shape between
patch releases. A column it stops writing but the schema still marks `NOT NULL` breaks every
insert.

That happened once: **1.7.3 dropped `account.issuer`.** Our model still required it, so every
`POST /api/auth/sign-up/email` failed inside the adapter and answered a 500 with an empty body.
Sign-up has no test, so `bun verify` stayed green. The fix was to drop the column and its
`@@unique([issuer, accountId])` from the model and the init migration.

Hence the rule in the root [`CLAUDE.md`](../../CLAUDE.md#pinned-dependencies): `better-auth` and
`@better-auth/expo` are pinned to one exact version in both apps. After any bump, compare the auth
models with the release's `get-tables` schema, then sign up against a running API and expect `200`.
