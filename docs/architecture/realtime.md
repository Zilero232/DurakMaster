# Realtime — one socket, tables in memory

The table is a live, shared, secret-holding thing; the profile is not. So the game runs over one
WebSocket to a server that keeps every table in its own memory, and everything request-shaped —
profile, friends, achievements, the leaderboard — goes over plain HTTP. Part of the
[documentation index](../README.md).

## What goes over the socket

The socket carries only realtime traffic: the lobby list (`lobby:*`), seating and readiness
(`table:*`), moves (`game:action` → `game:state` / `game:rejected`), table chatter, friend invites
and a few server pushes (`connected`, `profile:updated`, `game:finished`,
`achievements:unlocked`). Every message in both directions is a member of `clientMessageSchema` /
`serverMessageSchema` in `@durak-master/schemas`.

CRUD moved off the socket onto HTTP + TanStack Query: `ProfileController` and `SocialController`
behind `AuthGuard`, called through `httpClient` from each slice's `api/`. A push that carries a
fresh profile writes into the Query cache (`session-store.profile-cache.ts`), so the cache is the
one copy of server data on the client — the Zustand session store keeps only the connection status
and the live table.

## The gateway

`RealtimeGateway` in `apps/server/src/modules/realtime`, on `@nestjs/platform-ws` at `/ws`. Its
limits live in `realtime.config.ts`:

- **Auth on upgrade.** The handshake headers go to better-auth's `getSession`; the app sends
  `Authorization: Bearer <session token>` and the `bearer()` plugin resolves it
  ([auth](auth.md)). No session → an `UNAUTHORIZED` error and close code `4401`.
- **One socket per user.** A new connection replaces the old one, which is closed with `4409`
  — the old socket's disconnect is ignored, so it does not forfeit the player's game.
- **Messages before auth are buffered**, up to 16, and replayed once the user is known.
- **Limits.** 16 KB per message (`maxPayload`), 25 messages per 5 s per user
  (`RateLimiterMemory`), a ping every 30 s that terminates a socket which missed the last pong.
- **Seating is one-at-a-time per user.** `table:create`, `table:join` and `table:ready` run
  through `TableFlowService.oneAtATime`, so a repeated message cannot debit a stake twice.

The gateway parses and routes; the work is in `TableFlowService`, `GameFlowService`,
`BroadcastService` and `ConnectionService`.

## Tables live in node memory

`RoomsService` holds every `GameRoom` in a `Map`, plus `userId → roomId`. A room owns its members,
seats, ready flags, timers and the `GameSession` that wraps `game-core`. Postgres gets only what
outlives a table: the table record, finished games, balances and ratings
(`GameHistoryService`, `ProfilesService`).

That makes the server a single node by design — there is no Valkey and no cross-node directory any
more. A restart drops every table: `RoomsService.onModuleDestroy` closes each room and refunds every
held stake ([stakes](stakes.md)) before the process exits (`app.enableShutdownHooks()` in
`main.ts`).

## The server is authoritative

The client states an intent; the server decides. `game:action` carries the action and the
`expectedVersion` the client last saw. `GameRoom.applyAction` rejects with `VERSION_MISMATCH`
unless it equals the session's current `state.version`, then lets the game module validate the
move against the state; any error goes back as `game:rejected` and nothing changes. A stale tap, a
duplicated message and a replay all fail the version check.

The deck is shuffled on the server with `crypto.randomInt`, passed into `game-core` as a parameter
— the package itself has no randomness.

## `PlayerView` — what a phone may see

After every change `BroadcastService.gameState` sends each human seat its own `game:state`, built
by `room.getViewFor(userId)` → `toPlayerView` in `game-core`: the player's own hand in full, and for
everything hidden only a count — opponents' hands, the talon (`talonCount`), the discard pile
(`discardCount`). Bots get nothing. The deck order is never serialised.

Hiding cards on the client is not an option — they would still be in the traffic.

The one deliberate exception is the paid peek boosts at a `fairness: 'cheaters'` table: `peekTalon`
and `peekHand` reveal cards to the buyer only, in a `table:boost-used` reply, and only where the
table's rules allow it (`room.allowsPeeking`).

## Disconnects and the reconnect grace

- **Not playing** — a disconnect is a leave: the seat is freed and the stake refunded.
- **Playing** — the member is suspended (`isConnected: false`, the game marks them disconnected)
  and gets `RECONNECT_GRACE_MS` (45 s, `game/config/reconnect.config.ts`). Coming back inside it
  cancels the timer and `ConnectionService.restoreTable` re-sends `table:joined` and the current
  `game:state`. Missing it is a leave, which mid-game is a forfeit.
- **Everyone human gone** — the room is dropped at once.
- **Unready seats** — `READY_TIMEOUT_MS` (90 s) after the last join, humans who never pressed ready
  are unseated (`idle-removed`) and sent back to the lobby.
- **A result while offline** — `GameFlowService` keeps the `game:finished` payload (up to 500
  players) and delivers it on the next connection.

## The client socket

`apps/mobile/shared/api/socket/socket-client.ts` is a small class on React Native's own
`WebSocket` — no library. React Native's constructor takes a third argument with headers, which
browsers do not allow, and that is how the bearer token gets onto the upgrade request: the token is
read fresh from better-auth's secure store (`getAuthToken`) before every attempt.

- **Its own reconnect**: exponential back-off from 500 ms, ×1.6, capped at 8 s
  (`socket-client.config.ts`), reset on a successful open, stopped by `disconnect()` on sign-out.
- **No outgoing queue.** `send` returns `false` while the socket is not open; the UI shows the
  connection state instead of replaying stale intents after a reconnect.
- Every incoming frame is parsed with `serverMessageSchema`; anything that does not match is
  dropped.

It replaced `partysocket`, whose event shim crashed on Hermes ([pitfalls](pitfalls.md)).

`WS_URL` is derived from `API_URL` (`http` → `ws`, plus `/ws`), and in a debug build `API_URL`
itself comes from the host that serves the bundle ([local dev](../ops/local-dev.md)).
