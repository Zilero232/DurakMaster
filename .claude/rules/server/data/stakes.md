---
paths:
  - 'apps/server/**/*.ts'
---

<!-- Compressed editing rules for the API, loaded automatically on edit. -->
<!-- The full reasoning is docs/architecture/stakes.md; keep them in sync. -->

# Server — stakes and balances

- A bet is debited once by `reserveStake` and returned once: in the settlement payout, or by the
  room's `stake-released` event. `RoomMember.hasStakeHeld` is the authority.
- Never call `releaseStake` next to `rooms.leave` — leaving already emits `stake-released`. Direct
  `releaseStake` is only for a debit that never reached the room.
- Balance changes are a conditional `updateMany` (`where: { credits: { gte } }`), never
  read-compare-write; multi-player settlement is one `$transaction`.
- No endpoint, message or method moves coins or credits from one player to another.
- A new seating or unseating path adds its case to `table-flow.service.test.ts`.
