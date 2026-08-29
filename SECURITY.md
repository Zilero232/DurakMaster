# Security

## Reporting a vulnerability

Write to **zilero@dev.ru**. Do not open a public issue.

Include what you found, how to reproduce it, and what an attacker could do with
it. We reply within 72 hours.

## What we consider serious

The game moves in-game currency and hides information between players, so the
severe classes are:

- **Seeing another player's cards.** The server sends each player a `PlayerView`:
  their own hand in full, only counts for everyone else, and the deck size. If any
  route, socket message or API response leaks more than that, it is critical.
- **Forging a move.** Every action is validated against the server's state.
  Anything that lets a client apply a move the rules forbid, or replay one, is
  critical.
- **Manufacturing currency.** Credits and coins come from game outcomes. A path
  that mints them, or moves them between accounts, is critical.
- **Taking over an account.** Anything touching better-auth sessions, tokens or
  the WebSocket handshake.

## Design decisions that back this up

These are enforced as invariants (see [CLAUDE.md](CLAUDE.md)):

- Randomness is `crypto.randomInt()` and server-side only. The client never
  shuffles and never decides an outcome.
- The deck order never reaches the client. Hiding cards in the UI would not be a
  fix — they would still be in the traffic.
- The server is authoritative. `expectedVersion` guards every action against
  races and replays.
- Coins cannot be transferred between players. This closes a grey market and
  keeps the app out of the gambling category.

## Secrets

Never commit: `.env`, the Play service account key (`infra/play-store/`), any
keystore. All three are git-ignored — keep them that way.

`BETTER_AUTH_SECRET` in production must be freshly generated, never the value
from `.env.example`.
