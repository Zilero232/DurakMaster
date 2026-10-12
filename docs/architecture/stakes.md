# Stakes — held once, returned once

A seat at a table costs its bet in credits. The bet is taken when the player sits down and comes
back exactly once — inside the settlement, or as a refund. Every path that broke this rule was a
real money bug: credits vanishing on a disconnect, or credits minted by leaving a finished table
over and over. Part of the [documentation index](../README.md).

## Two currencies, neither transferable

- **Credits** — the table currency. Bets, winnings, the free bonus every 4 hours
  (`FREE_CREDITS_AMOUNT`, `FREE_CREDITS_INTERVAL_MS` in `profile/config/rewards.config.ts`).
- **Coins** — spent on boosts (`BOOST_PRICE` in `@durak-master/schemas`), earned from
  achievements.

**Coins are never transferred between players** — and neither are credits outside a table's pot.
There is no endpoint, message or service method that moves a balance from one account to another
(root [`CLAUDE.md`](../../CLAUDE.md), invariant 5): transfers create a grey market and invite the
stores to reclassify the app as gambling. A pot is not a transfer in that sense — it is settled by
the server from game outcomes, never by a player's request.

## The lifecycle

1. **Hold.** `ProfilesService.reserveStake(userId, bet)` debits the bet with a conditional
   `updateMany` (`credits >= bet`), so an empty wallet fails instead of going negative. It runs in
   `TableFlowService` on create, on join, and on ready for a rematch.
2. **Seat.** Only after the debit succeeds is the player seated, and the room marks the member
   `hasStakeHeld: true`. If the socket closed, the room vanished or the seat filled while the debit
   was in flight, the stake is released right there — it never reached the room.
3. **Settle.** When the game finishes, `GameFlowService.finish` splits the loser's bet among the
   human winners by finishing order (`splitPot` — earlier out, bigger share) and writes every
   payout in one transaction: a winner gets `bet + share`, a draw returns `bet`, the loser gets
   nothing back. Then `resetToWaiting()` clears every `hasStakeHeld`, because the payout already
   returned the stake.
4. **Rematch.** Pressing ready again with no stake held re-runs step 1. A player who cannot cover
   it is evicted with `NOT_ENOUGH_CREDITS`.

## `hasStakeHeld` is the authority

Whether a member's bet is still held is `RoomMember.hasStakeHeld` in `game/lib/game-room.ts` —
not "is the game running", not "are they in a match". Before touching anything that seats or
unseats a player, ask which side of that flag it lands on.

## Refunds have one path

A held stake is refunded only through the room's `stake-released` event:

- `GameRoom.unseat` (a leave before the deal, an idle seat removed by the ready timeout) emits it
  for a member with `hasStakeHeld`.
- `RoomsService.dropRoom` — a room abandoned by every human, or every room on shutdown
  (`onModuleDestroy`) — calls `room.close()`, which returns the members still holding a stake,
  and emits one `stake-released` per member.
- `GameFlowService` handles the event with `ProfilesService.releaseStake`.

**Never add a manual `releaseStake` next to a `rooms.leave` call.** That was the source of two
separate double-refund bugs — leaving after a match, and the ready-timeout eviction. The only direct
`releaseStake` calls are the ones in step 2, for a debit that never became `hasStakeHeld`.

A leave during a game is not a refund: it is a forfeit, settled as a loss for the player who left.

## Coins

`spendCoins` is the same conditional decrement on `coins`. A boost debits first and checks the
table second; if the game ended, the player moved, or the boost has nothing to act on, the gateway
calls `refundCoins` for that exact price and answers with an error.

## Tests

`apps/server/src/modules/realtime/services/_tests/table-flow.service.test.ts` runs the flows
against a fake wallet and asserts balances. A new way to sit down or stand up adds its case there.
