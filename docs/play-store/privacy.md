# Privacy and data safety

Google Play asks two separate things: the **Data safety form** in the console, and a **privacy
policy** hosted at a public URL. Both must agree with what the app actually does.

## What the app collects

| Data | Why | Where it goes |
|---|---|---|
| Email address | Account identity and sign-in | Postgres, on our server |
| Display name | Shown to other players at the table | Postgres |
| Avatar (preset or uploaded image) | Shown to other players | Postgres, image on our storage |
| Game history, rating, credits | Ranking and the player's own profile | Postgres |

The app does **not** collect location, contacts, device identifiers, or any advertising data.
There is no analytics SDK and no ad network.

## Data safety answers

Answer the console form as follows.

**Does your app collect or share any of the required user data types?** — Yes.

| Question | Answer |
|---|---|
| Personal info → Email address | Collected, not shared. Required. Purpose: account management |
| Personal info → Name | Collected, not shared. Optional. Purpose: app functionality |
| Photos and videos → Photos | Collected, not shared. Optional. Purpose: app functionality (avatar) |
| App activity → In-app actions | Collected, not shared. Required. Purpose: app functionality |
| Financial info | Not collected |
| Location | Not collected |
| Device or other IDs | Not collected |

**Is all of the user data encrypted in transit?** — Yes, HTTPS and WSS.

**Can users request that their data be deleted?** — Yes, through **zilero@dev.ru**. Keep the
deletion route working.

## In-app purchases and gambling

Credits and coins are earned in game and **cannot be bought, sold or transferred between
players**. This is deliberate: transfers create a grey market and risk the store reclassifying
the app as gambling (see the invariants in `CLAUDE.md`).

When answering the console: the app contains no gambling, no real-money wagering and no
purchase of virtual currency.

## Privacy policy

The policy must be reachable at a public URL before the listing can go live. Keep its wording in
step with the table above — a policy that promises less than the app collects is a rejection.

The text to publish is in [privacy-policy.md](./privacy-policy.md) — it already covers what is
collected, why, how long it is kept, who it is shared with (nobody), how to request deletion, and
the contact address.
