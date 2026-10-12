# Tests

Part of the [style guide](../README.md).

## Running them

```bash
bun run test           # Vitest, every workspace — part of bun verify
bun run test:watch
bun run test:coverage  # game-core and the server
```

**`bun run test`, never bare `bun test`.** Bare `bun test` is Bun's own runner: it collects the same
files and fails a few dozen of them on `vi.stubGlobal is not a function`, because it is not Vitest.
The root `vitest.config.ts` lists one project per workspace (`packages/*`, `apps/server`,
`apps/mobile`).

## Where they live

In a `_tests/` folder beside the code under test — `packages/game-core/src/durak/rules/_tests/`,
`apps/server/src/modules/realtime/services/_tests/`, `apps/mobile/shared/api/socket/_tests/`.
Shared fixtures sit in the same folder (`durak/_tests/fixture.ts`).

## What to test

Pure logic and the code that moves money or decides the game. Nothing here needs a database, a
device or a running server.

- **Game rules carry the most tests.** The checklist at the end of
  [`docs/games/durak.md`](../../games/durak.md) lists the mistakes that keep recurring; each entry
  has a test behind it, and a new rule arrives with one. `durak/_tests/rule-matrix.test.ts` runs
  every mode × deck × player count, and `src/_tests/self-play.test.ts` plays whole games.
- **Stakes and refunds** are tested against a fake wallet that asserts balances
  (`realtime/services/_tests/table-flow.service.test.ts`). Anything that seats or unseats a player
  adds its case there ([stakes](../../architecture/stakes.md)).
- **Client logic** — the session store reducer, the socket client, the pure `lib/` helpers. UI is
  checked by running the app on a small and a large phone, not by snapshot tests.

**Assert the relationship, not the business value.** Import the constant and compute against it
(`BOOST_PRICE`, `FREE_CREDITS_AMOUNT`) rather than spelling the number out, so a repricing does not
turn the suite red while the logic stays right.
