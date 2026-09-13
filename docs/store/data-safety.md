# Data safety and content rating

The answers to fill into the Play Console. What the app actually collects is in
[privacy.md](./privacy.md) — this page turns that into Google's form, question by question.

An answer that promises less than the app does is a rejection, and the form is re-reviewed on
every release, so keep it in step with the code.

---

## Data collection

**Does your app collect or share any of the required user data types?** — Yes.

Every type below that **we** collect is processed on our own server and never shared. The
advertising identifier is the exception: it is collected and shared by the ad SDK, not by us.

### Personal info

| Type | Collected | Required | Purpose | Ephemeral |
|---|---|---|---|---|
| Email address | Yes | Required | Account management, sign-in | No |
| Name | Yes | Optional | App functionality — the name other players see | No |
| User IDs | Yes | Required | Account management | No |

### Photos and videos

| Type | Collected | Required | Purpose | Ephemeral |
|---|---|---|---|---|
| Photos | Yes | Optional | App functionality — the avatar the player picks | No |

A preset avatar is generated locally and involves no upload; only a photo the player chooses
themselves is stored.

### App activity

| Type | Collected | Required | Purpose | Ephemeral |
|---|---|---|---|---|
| In-app actions | Yes | Required | App functionality — game history, rating, credits | No |

### Device or other IDs

| Type | Collected | Required | Purpose | Shared |
|---|---|---|---|---|
| Device or other IDs | Yes | Optional | Advertising — the rewarded ad | Yes |

Google AdMob collects an advertising identifier and uses it for advertising. It ships in the
bundle whether or not `EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID` is filled, and Play reviews the bundle
rather than the runtime flag, so declare it whenever the build carries the SDK.

### Not collected

Location, financial info, health and fitness, messages, contacts, calendar, audio, files,
web browsing history, app info and performance.

There is no analytics SDK.

## Security practices

| Question | Answer |
|---|---|
| Is all user data encrypted in transit? | Yes — HTTPS and WSS, cleartext is blocked |
| Can users request that their data be deleted? | Yes |
| Has your app been independently reviewed against a security standard? | No |
| Do you follow the Families Policy? | Not applicable — the app is not aimed at children |

## Account deletion

Play requires a way to request deletion that works **without installing the app**. Today there is
one route, and it must stay alive: a request to **zilero@dev.ru** from the account's email
address.

The Play Console asks for a URL. Point it at the deletion section of the published privacy
policy, which carries that address.

There is no in-app deletion flow yet. Play accepts the email route on its own, but an in-app one
is the better answer — when it ships, add it here and to the privacy policy.

Deleting an account removes the profile, avatar, game history, rating and credits. Finished game
records keep an anonymous identifier so other players' histories stay consistent.

## Content rating

Google's rating comes from the IARC questionnaire. Answer it as:

| Question | Answer |
|---|---|
| Category | Game |
| Violence, blood, scary content | None |
| Sexuality, nudity | None |
| Profanity, crude humour | None |
| Controlled substances | None |
| Gambling — real money | No |
| Gambling — simulated, with a purchase path | No |
| In-game currency that can be purchased | No |
| Loot boxes or randomised paid items | No |
| Users can interact with each other | Yes — quick phrases and emoji at the table |
| Users can share their location | No |
| The app shares user-provided personal info with third parties | No |
| Digital purchases | No |

The expected outcome is **PEGI 12 / ESRB Everyone 10+**, driven by the card-game theme and player
interaction, not by gambling.

### Why this is not gambling

Credits are earned in game. They cannot be bought, sold, or transferred between players — an
invariant in `CLAUDE.md`, enforced on the server. There is no cash-out and no purchase path, so
the app is a card game, not a gambling app.

If a credit purchase is ever added, this section and the rating both change.

## Ads

The app shows **rewarded ads only**, through Google AdMob, and only when the player opens
one themselves. Declare:

| Question | Answer |
|---|---|
| Does your app contain ads? | Yes |
| Ad format | Rewarded |
| Ads targeted at children | No |
| Does the ad SDK collect data? | Yes — as declared by Google AdMob |

When `EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID` is empty the button hides itself and the build ships
without ads. The declaration must match the build actually uploaded.

## Target audience

| Question | Answer |
|---|---|
| Target age groups | 13–15, 16–17, 18+ |
| Appeals to children | No |
| Store listing aimed at children | No |

Selecting any group under 13 puts the app under the Families Policy, which the sign-in flow and
the ad SDK do not satisfy. Do not select one.
