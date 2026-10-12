---
paths:
  - 'apps/server/src/modules/realtime/**/*.ts'
  - 'apps/server/src/modules/game/**/*.ts'
---

<!-- Compressed editing rules for the API, loaded automatically on edit. -->
<!-- The full reasoning is docs/architecture/realtime.md; keep them in sync. -->

# Server — realtime and rooms

- One gateway at `/ws`. It authenticates, rate-limits, parses with `clientMessageSchema` and routes;
  logic lives in the flow services. Every outgoing message is a `ServerMessage`.
- Tables live in `RoomsService` memory; Postgres gets only what outlives a table.
- A client only states intent. `applyAction` checks `expectedVersion` against `state.version`, then
  lets `game-core` validate the move. Never apply anything the module did not accept.
- A phone gets only `room.getViewFor(userId)` — its own hand, counts for everything hidden. Never
  put another hand, the talon or the deck order into a message; the only exception is a paid peek at
  a `cheaters` table, sent to the buyer.
- Randomness is `crypto.randomInt`, passed into `game-core`.
- Seating calls go through `TableFlowService.oneAtATime`.
