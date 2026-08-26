# Kozel rules — formalized for implementation

The source of truth for `packages/game-core`. The wording is chosen so that it
can be carried into code without guesswork. Wherever sources disagree, this is
stated explicitly along with the option chosen.

Primary sources: [Wikipedia — Kozel (card game)](https://ru.wikipedia.org/wiki/Козёл_(карточная_игра)),
[Pagat — Schafkopf](https://www.pagat.com/schafkopf/schafkopf.html),
[Pagat — Bura and Kozel](https://www.pagat.com/aceten/bura.html),
[Rambler — Kozel rules](https://news.rambler.ru/games/56322030-kak-igrat-v-kozla-pravila-kartochnoy-igry-strategii-i-sovety/),
[Lifehacker](https://lifehacker.ru/kak-igrat-v-kozla/), [Lenta.ru](https://lenta.ru/articles/2026/04/16/kak-igrat-v-kozla/),
[gamerules.ru](https://gamerules.ru/kartochnyi-kozyol), [liveposts.ru](https://liveposts.ru/articles/hobby-entertainment/nastolnye-igry/obshhie-printsipy-i-pravila-kartochnoj-igry-kozyol).

---

## 0. Which game this document describes

Under the name "Kozel" the Russian tradition holds **three different games**.
This document describes only the first.

1. **Trick-taking Kozel** — 4 players in 2×2 pairs, 32 cards, permanent trumps,
   120 points in the deck, threshold 61. **This is the subject of the document.**
2. **Dominoes "kozel"** — not a card game, irrelevant here.
3. **Burkozel (bura-kozel)** — 2–3 players, 36 cards, trump set by a turned-up
   card, drawing from the deck, the "bura"/"molodka" combinations, scoring up to
   12 penalty points. A relative of **Bura**, not of the game described here.
   Pagat describes Kozel precisely inside its article on Bura — that is about
   Burkozel, not about what is here.

> **Pitfall.** Pagat — usually the best source — **leads astray here**.
> At `pagat.com/aceten/bura.html#kozel` what is described is Burkozel: 4 cards
> in hand, drawing from the deck, trump set by a turned-up card, the leader
> plays one or three cards of one suit, following suit is not required. That is
> a **different game**. Trick-taking Kozel must not be implemented from it.

**Lineage.** Trick-taking Kozel is the Bavarian **Schafkopf** (the Rufspiel
contract), which came to Russia from Germany in the early 20th century.
Everything matches: 32 cards, 120 points, the threshold of 61, the card values
(A 11 / 10 10 / K 4 / Q 3 / J 2), 14 trumps (all queens + all jacks + the whole
trump suit), the suit ranking among queens and jacks. The German suits map as
follows: acorns → **clubs**, leaves → **spades**, hearts → hearts, bells →
**diamonds**. The practical conclusion follows: **whenever the Russian sources
disagree, the correct option is almost always the one matching Schafkopf.**

The game has nothing to do with **Belote**. In Belote the trump jack and nine
are raised in the ranking (J=20, 9=14 points), there is bidding and there are
marriages (K+Q = 20/40). In Kozel **none of that exists**: the trump ranking is
different, there is no bidding, there are no marriages. Do not carry Belote
mechanics over.

---

## 1. Player setup

**The canonical setup is exactly 4 players, two teams of two.** Partners sit
**opposite** each other (crosswise), so around the circle the players alternate:
`A B A B`. Turn order is clockwise.

The score is kept **per team, not per player**: the tricks of both partners go
into one shared pot.

Other setups are variants, not the main game (see §11):
- **3 players "with a blind"** (with a "dummy") — one player plays both for
  themselves and for the hand of a nonexistent partner.
- **3 players "with the queen of spades"** — two against one.
- **2 players** — mentioned by some sources, which give no details.

> **Pitfall.** Do not confuse "sit opposite" with "play consecutively". A
> partner plays **every other turn**. All the tactics depend on it: the last to
> play in a trick is either the partner (points can be dumped) or an opponent
> (they cannot).

---

## 2. Deck and deal

### Deck

**32 cards**: **all four sixes** are removed from the standard 36. The ranks
remaining in play are `7 8 9 10 J Q K A` in four suits.

The sixes are not thrown away — they serve as a physical **scoreboard** (§9).
In a digital implementation this is pure cosmetics: the score is an ordinary
number.

> **Pitfall.** "A 36-card deck, 32 are played" from the Russian sources is
> neither a contradiction nor a rule variant. It means exactly this: 32 playing
> cards plus 4 sixes as a counter.

### Deal

The deal goes **clockwise**. The dealer changes each hand around the circle.

**Each player is dealt 8 cards**, the entire deck goes into the hands. There is
**no** talon, turned-up card, or deck in the middle of the table.

> **Sources disagree.** Lifehacker, Lenta.ru and the opening paragraphs of
> Wikipedia describe a deal of **4 cards with drawing from the deck after each
> trick**. Wikipedia in its "Rules" section and liveposts describe a deal of
> **8 cards at once, with no deck**.
>
> These are **incompatible modes**, not a minor difference. With a deal of 8
> cards there are exactly 8 tricks, full information about one's own hand from
> the first move, and meaningful play from the layout. With a deal of 4 plus
> drawing, the hand is constantly replenished, and the obligation to follow suit
> becomes nearly unenforceable.
>
> **Chosen: 8 cards at once, no deck, exactly 8 tricks per hand.** Reasons:
> (a) this is the Schafkopf variant the game descends from; (b) it is consistent
> with the remaining rules — "boasted deals" (§7), "giving away the last trump"
> (§7), the redeal demand based on the hand (§2), the "spas" calculation (§9)
> all make sense only with a fixed hand of 8 cards; (c) the arithmetic works
> out: 4 players × 8 cards = 32 cards = 8 tricks × 4 cards.
>
> The "4 with drawing" variant is a separate table mode, not the default (§11).

### Redeal

A player may (but is not obliged to) demand a redeal, **showing** their hand, if
they hold:

- all four nines; **or**
- a total hand value of ≤ 12 points.

The demand is valid only if **no "boasted deal" was declared** in this hand (§7).
After a redeal, a "boasted deal" is no longer permitted in this hand.

If a redeal for these reasons is claimed **three times in a row**, the third
redeal is not performed: the dealer's team **loses one "pair"** — the opponents'
scoreboard moves down a row.

> **Sources disagree.** Wikipedia additionally lists "three queens and a hook —
> must declare a redeal" and "four queens and a hook — declares a shutout or
> demands a redeal". The wording in the source is corrupt: the term "hook" is
> never defined, and "must" contradicts "at will" in the same paragraph.
> **Chosen:** only the two unambiguous conditions above are implemented, and a
> redeal is always **at the player's discretion**.

The condition "4 cards of one suit on the first deal → redeal" appears in
Wikipedia's introductory paragraph, but contradicts the "Rules" section, where
the list of conditions is different and does not include this item.
**Chosen:** not implemented.

---

## 3. Trump

**Trump in Kozel is not determined — it is fixed by the rules.** There is no
turned-up card, no bidding, and no trump declaration in an ordinary hand.

**The permanent trump group (14 cards):**

- all four **queens**;
- all four **jacks**;
- all six remaining **club** cards: `7♣ 8♣ 9♣ 10♣ K♣ A♣`.

That is `4 + 4 + 6 = 14` trumps out of 32 cards. There are 18 non-trump cards —
six each in spades, hearts and diamonds.

> **Pitfall — the most important rule in the document.**
> **Queens and jacks do not belong to their own suits.** The queen of diamonds
> is a **trump**, not a diamond. If a diamond is led, the queen of diamonds
> **does not count as following suit**: it is a trump and it wins the trick.
> And conversely — a player whose only remaining "diamond" is the queen of
> diamonds counts as **holding no diamonds**.
>
> Formally: `suitOf(card)` for game logic is not the suit on the picture.
> ```
> effectiveSuit(card) = TRUMP if rank ∈ {Q, J} or suit = ♣
>                       otherwise card.suit
> ```
> Using `card.suit` directly in the "did they follow suit" check is a mistake,
> and it is the number one mistake in implementations of this game.

**There is no no-trump game.** The trump group is unchanged across all hands of
a game. The only exception is "boasted deals" (§7), where the boaster nominates
an additional trump suit; that is a variant, off by default.

---

## 4. Card ranking

Two independent orders: one for trumps, one for each plain suit.
**Compare only by position in the list**, never by face value or by string.

### Trumps — from highest to lowest (14 cards)

```
 1.  7♣  "shamok" / "kocherga"
 2.  Q♣       6.  J♣       10.  A♣
 3.  Q♠       7.  J♠       11. 10♣
 4.  Q♥       8.  J♥       12.  K♣
 5.  Q♦       9.  J♦       13.  9♣
                           14.  8♣
```

The full list on one line, in descending order of strength:

`7♣ > Q♣ > Q♠ > Q♥ > Q♦ > J♣ > J♠ > J♥ > J♦ > A♣ > 10♣ > K♣ > 9♣ > 8♣`

The suit order within the queens and within the jacks: **clubs > spades >
hearts > diamonds**. The same order as in Schafkopf (acorns > leaves > hearts >
bells).

**The lowest trump is `8♣`** (the seven of clubs has moved to the top as the
shamok).
**The highest trump is `7♣`.**

> **Pitfall.** Within the low clubs the **ordinary** ace-ten order applies:
> `A♣ > 10♣ > K♣ > 9♣ > 8♣`. The ten is above the king, the ace above the ten.
> Do not sort clubs by ascending face value.

> **Sources disagree — the highest card.**
> - **Wikipedia (the "Card strength" section), Rambler, Lifehacker, gamerules:**
>   the highest card is **7♣ (the "shamok")**, then the queens, then the jacks.
> - **Wikipedia (the "Cheating in the game" section):** "the pervonka is the
>   queen of clubs, **the strongest trump**". This is a direct **internal
>   contradiction** within the article.
> - **Schafkopf (Pagat):** the highest card is the Ober of acorns, that is
>   **Q♣**; there is no shamok at all, and the seven of the trump suit is the
>   **lowest** trump.
> - **gamerules.ru/pravila-igry-v-kozla-v-karty:** "the strongest card is the
>   jack of clubs". The page contradicts itself and every other source, and is
>   not taken into account.
>
> **Chosen: the highest card is `7♣` (the shamok), then the queens, then the
> jacks.** Reason: four independent Russian sources agree with each other and
> state the shamok explicitly; the "pervonka" in Wikipedia is a note about
> cardsharps' signals, not a rules section. The shamok is a Russian addition on
> top of Schafkopf, and discarding it would mean describing Schafkopf rather
> than Kozel.
>
> This is a **table setting** (`shamokIsHighest`, on by default).
> When it is off, `7♣` drops to the very bottom of the trumps, below `8♣`, and
> the highest card becomes `Q♣` — pure Schafkopf.

### Plain suits — spades, hearts, diamonds (6 cards each)

There are **no** queens or jacks in the plain suits — they have been taken into
the trumps.

```
A > 10 > K > 9 > 8 > 7
```

Identical for all three plain suits. This is the **ace-ten** order: the ten
sits between the ace and the king.

> **Pitfall.** `10 > K` is not a typo. It is so across the whole ace-ten family
> (Schafkopf, Skat, Belote, Thousand). Placing the ten between the nine and the
> jack, as in Durak, is a mistake that breaks both the ranking and the valuation
> of tricks: the ten is worth 10 points and has to be strong.

**Any trump beats any plain card.** The plain suits do not interact with each
other at all.

---

## 5. Card point values

| Card | Points | Copies in the deck | Total |
|---|---|---|---|
| Ace | 11 | 4 | 44 |
| Ten | 10 | 4 | 40 |
| King | 4 | 4 | 16 |
| Queen | 3 | 4 | 12 |
| Jack | 2 | 4 | 8 |
| 9, 8, 7 | 0 | 12 | 0 |

**There are exactly 120 points in the deck.** This is an invariant: the sum of
both teams' pots at the end of a hand is **always** 120. Check it with an
assert — a discrepancy means a bug in awarding tricks.

> **Pitfall.** Value and strength are **different, unrelated scales**. `7♣` is
> the highest card in the game and is worth **0 points**. `A♦` is a weak trump
> (ninth out of fourteen) and is worth **11 points**. A single variable for both
> meanings is a guaranteed bug.

> **Pitfall.** Points are counted by the **cards** in the tricks, not by the
> number of tricks. A team can take 6 tricks out of 8 and lose the hand.

---

## 6. Playing and the trick

A hand is exactly **8 tricks** of 4 cards. The hand shrinks by one card per
trick.

### Who leads first

- **The first hand of a game:** the player holding the **lowest trump, `8♣`**,
  leads.
- **Subsequent hands:** a player of the **team that won the previous hand**
  leads. Which of the two it is, the team decides **after looking at the cards**.

> **Sources disagree.** Lifehacker: the first lead belongs to the player to the
> left of the dealer; gamerules: to the dealer; Rambler: to the dealer.
> Wikipedia gives the `8♣` rule plus "the winning team leads next".
> **Chosen: Wikipedia's rule** — it is the only one determined by state (the
> holder of `8♣` is computed unambiguously) and it explains why the whole deck
> is dealt out in the first place. The "left of the dealer" rule is a table
> variant (§11).

> **Pitfall.** "The team decides who leads" is a **separate game action**
> between the deal and the first trick, not something automatic. The state needs
> a `chooseLeader` phase with two permitted actors.

### Restriction on the first lead of a hand

**Leading a trump in the first trick is not allowed** if the hand holds at least
one plain card. The lead is opened with a **plain** card.

If a player holds **only trumps**, the restriction is lifted — they lead a
trump.

The restriction applies **only to the first trick of a hand**. From the second
trick onward, leading a trump is unrestricted.

> **Sources disagree.** Lifehacker phrases it differently: "the team that led
> first in the previous hand may not open a new hand with a trump". Wikipedia
> lifts the ban for the "boaster". Lenta.ru: "in the first round the player must
> play a plain card, not a trump" — with no qualifications.
> **Chosen:** a ban on leading a trump in the **first trick of a hand** for any
> leader, with the exception "only trumps in hand" and the exception for the
> boaster (§7).

### The obligation to follow

The other players play **clockwise**, one card each.

Let `led = effectiveSuit(the first card of the trick)` (§3 — TRUMP or a plain suit).

1. **If a player holds a card with `effectiveSuit == led`, they must play it.**
   The obligation is **by suit only**.
2. **Beating is not required.** Holding cards of the required suit that are
   weaker than what is already on the table, the player plays any of them —
   "underplaying" is allowed.
3. **If there are no cards of the required suit, the player plays any card.**
   They are **free** to trump ("strike", "press down") or to discard a plain
   card ("throw away", "topple over"). **Trumping is not required.**

Formally, the set of legal cards:

```
hasLed = hand.any(c => effectiveSuit(c) == led)
legal  = hasLed ? hand.where(c => effectiveSuit(c) == led) : the whole hand
```

> **Pitfall.** The three obligations are easily confused. In Kozel there is
> **exactly one** obligation — to follow suit. There is no obligation to beat.
> There is no obligation to trump when out of the suit. Do not drag in the rules
> of Preference or Whist.

> **Pitfall.** A trump lead requires a response with **any trump**, not with a
> card of the same painted suit. Leading `Q♦` is a lead **into trump**: the
> response must be a jack, a queen or a club, not a diamond. This follows
> directly from §3 and is the second most frequent bug after `effectiveSuit`
> itself.

### Who takes the trick

- If the trick contains **at least one trump** — the **strongest trump** by the
  list in §4 takes it.
- If there are no trumps — the **strongest card of the led suit** takes it.
  Cards of other plain suits do not take part in the comparison, even if
  nominally higher.

The points of all four cards go into the **pot of the taker's team**.
**The next lead is made by whoever took the trick.**

> **Pitfall.** A discard of a foreign suit can **never** win a trick, however
> high it may be. An ace of spades thrown onto a hearts lead has zero chance and
> is a gift of 11 points. Compare only the cards that passed the "trump" or
> "led suit" filter.

### Partial ban on discarding an ace

**Off by default** (`aceDiscardRestriction`). The rule is rare, and Wikipedia
itself flags it as dubious ("no such rules really exist").

The wording: if some plain suit has **not yet been led** during this hand, then
the ace of that suit may not be **discarded** (played when out of the led suit).
The player must choose another card.

It applies only to case 3 above — to discards. If the ace is played in suit, or
if the lead was made in its suit, the restriction does not apply.

---

## 7. Declarations and claims

### There is no bidding

**There is no auction, no contract assignment, and no trump declaration in an
ordinary hand.** The trump group is fixed (§3), and the hand is played
immediately after the deal. Pairs are permanent for the whole game and are not
played for.

### There are no marriages

**The "king + queen of one suit" combination is not declared in Kozel and gives
no points.** Not a single source mentions it.

> **Pitfall.** Marriages are a mechanic of **Thousand** (K+Q: ♠40 ♣60 ♦80 ♥100)
> and of **Belote** (K+Q = 20, trump 40). Searching for "kozel marriage"
> consistently returns articles about Thousand. Do not carry it over. In Kozel
> the queens are not tied to their suit at all (§3), so a "marriage" cannot even
> form here in principle.
>
> The only points in a hand are the **value of the cards in the tricks**. There
> are no other sources of points.

### Royal kozel

If a player turns out to hold **all four aces**, they declare "royal kozel": the
hand stops immediately and the declarer is credited with the win.

> **Sources disagree.** Wikipedia gives the wording "if during play any player
> **draws** 4 aces… the win goes to **that player**". The word "draws" refers to
> "boasted deals" (where cards are picked up one at a time), and "the win to the
> player" contradicts team scoring — which team is credited and with how many
> "pairs", the source does not say. gamerules confirms the rule exists but also
> gives no details.
> **Chosen:** the rule is implemented as a **table setting** (`royalKozel`,
> **off** by default). As long as the sources give no price for the declaration,
> it cannot be put into the core rules.

### Giving away the last trump

Applies **only in hands without a "boasted deal"** and **only before the first
lead**.

A player holding **one or two trumps** may declare "I give away my last trump".
The partner may agree or refuse. On agreement the partners exchange one or two
cards **blind**; the receiving side must give a **non-trump**, and only if their
hand is all trumps do they give a trump.

The exchange is public as a fact (everyone knows it happened), but its contents
are not.

A table setting (`lastTrumpExchange`), off by default: the rule requires trust
in the opponent, which in a digital implementation is provided by the server,
but it noticeably complicates the state.

### "Boasted deals"

A major rule variant: instead of the ordinary deal of 8 cards, the leader may
declare a special way of dealing — **trousers, double trousers, mirror, star,
merry, sad, small coffins, big coffins, barrel**. In most of them the boaster
**nominates a trump suit** in addition to the permanent trumps and gains the
right to **lead a trump**.

The mechanics of these deals are described incompletely and mutually
contradictorily in the sources (the order of picking up cards, what exactly may
be set aside for oneself, who plays second). Formalizing them from the available
sources is **impossible without guesswork**.

**Chosen:** "boasted deals" are **not implemented**. The deal is always the
ordinary one — 8 cards. With the ordinary deal, all the rules above are
self-sufficient.

---

## 8. Scoring a hand

At the end of the 8 tricks the teams' pots are counted. `potA + potB == 120` is
the invariant.

Threshold values:

- **61** — the threshold for winning the hand.
- **31** — "**spas**": by reaching it, the losing team escapes a double defeat.
- **90** — the threshold for a double win.

The term "**yaitsa**" (eggs) — a score of exactly 60:60.
The term "**lyusya**" (in some sources "**pogon**") — all 8 tricks taken by one
team.

---

## 9. Result of a hand: "pairs" and the scoreboard

The game score is kept not in points but in "**pairs**". Physically — with the
sixes: each team has two sixes, each with six rows; a won "pair" moves the
scoreboard down a row. **The goal is to collect 6 "pairs".** In code this is
simply a `0..6` counter per team.

**The winning team's scoreboard moves. The loser's scoreboard does not change.**
This is a counter of wins, not of penalties.

| Condition | Result |
|---|---|
| 60 : 60 ("eggs") | Nobody moves. The hand is marked with the `hadEggs` flag |
| Winner 61–89, loser ≥ 31 ("spas") | Winner **+1 pair** |
| Winner 90–120, loser ≤ 30 but took **at least one trick** | Winner **+2 pairs** |
| Winner 120 points **and all 8 tricks**, loser **no tricks at all** ("lyusya" / "pogon") | The **loser's scoreboard is reset** to 0. The winner is awarded **no pairs** |
| A third redeal in a row (§2) | The **dealer's** team is recorded as losing: the opponent gets **+1 pair** |
| Caught in a violation during "opening with two pairs" | The guilty side loses **2 pairs** to the opponent |

> **Pitfall — "lyusya" gives no pairs.** The maximum result of a hand **resets
> the opponent**, but does **not** move one's own scoreboard. Awarding 2 pairs
> for a lyusya on top of that is a mistake: the sources do not say so, and it
> would make a lyusya an instant win.

> **Pitfall — the 90 boundary requires two conditions.** "+2 pairs" means
> `points ≥ 90` **AND** `the loser has at least one trick`. Exactly 120 points
> with zero tricks for the opponent is already a lyusya, a different branch.
> Check lyusya first, then "+2", then "+1".

> **Pitfall — "spas" is counted in points, not in tricks.** 31 points is a
> threshold of card value. A team can take three tricks and still fall short of
> spas.

**"Opening with two pairs"** is a mechanism for checking for a violation
(applicable only to "boasted deals" and the trump exchange). The suspecting team
demands that the cards be shown. Guilty → their team gives up 2 pairs. Not
guilty → **the suspectors give up 2 pairs**. In the base implementation, without
"boasted deals" and without the exchange (§7), the mechanism is unnecessary: the
server is authoritative and cheating is impossible by construction.

> **Sources disagree — "pairs" versus "penalty points".**
> Lifehacker, Lenta.ru and Rambler describe the score **mirrored**: the losing
> team is recorded **2 penalty points**, and the game runs **to 12 penalty
> points**. Wikipedia and liveposts: the winner is recorded **1 pair**, and the
> game runs to **6 pairs**.
>
> The scales are **equivalent up to a factor of 2**: 6 pairs = 12 points,
> 1 pair = 2 points, 2 pairs = 4 points. It is the same system described from
> opposite ends — "a scoreboard step" versus "half a step".
>
> **Chosen: "pairs", 1 or 2 per hand, game to 6.** Reason: only this scale
> explains the reset on a lyusya and the "two pairs" penalty, and only it is
> consistent with the physical sixes-scoreboard. For the UI it is acceptable to
> show doubled numbers — that is pure presentation.

### The letters of the word "KOZEL"

> **Sources disagree — important.** Not a single source found on **trick-taking
> Kozel** describes scoring by the letters of the word "KOZEL". The score is
> kept in "pairs" on the sixes-scoreboard (6 steps) or in penalty points (12).
>
> Letter scoring is a real folk tradition, but it belongs to **other** games
> under the same name (primarily dominoes-kozel) and to the general device of
> "recording a letter against the loser" found in a great many street games.
>
> **Chosen:** the letters are a **purely visual layer over the pairs counter**,
> not a separate mechanic. The word "KOZEL" has five letters while there are six
> pairs, so there is no direct mapping. If the letters are wanted in the UI,
> count the scoreboard steps and label them with letters, without changing the
> rules. **Do not invent a "a letter for something" mechanic that is not in the
> sources.**

---

## 10. End of the game

The game ends when one team's scoreboard reaches **6 pairs**. That team is the
winner; the losers are the "**kozly**" (goats).

Honorary titles (pure cosmetics, no effect on the rules):

| Condition | Title |
|---|---|
| An ordinary loss | "kozel" |
| The score 60:60 occurred at least once in the game | "kozel **with eggs**" |
| The winner stood at 5 pairs and took the final hand for 2 pairs (the opponent did not reach spas) | "kozel **with tails**" |
| Both conditions at once | "kozel with eggs and tails" |

For "with tails", **both** conditions are required: the winner's scoreboard was
exactly at 5 and the final hand was won for 2 pairs. The `hadEggs` flag is
sticky for the whole game: it is set on the first 60:60 score and is never
cleared.

> **Pitfall.** Because of the lyusya (the reset, §9) the game is **not
> monotonic**: a team's scoreboard can drop from 5 to 0. Do not treat "pairs" as
> non-decreasing and do not cache "who has less to go".

> **Pitfall.** The game ends **strictly on reaching 6**. There are no
> intermediate conditions for an early win — except "royal kozel" (§7), if it is
> enabled.

---

## 11. Rule variants

Confirmed by sources, for table settings:

| Setting | Values | Default | Source |
|---|---|---|---|
| `shamokIsHighest` | `7♣` highest card / `7♣` lowest trump (pure Schafkopf) | on | Wikipedia, Rambler, Lifehacker |
| `dealMode` | 8 cards at once / 4 cards with drawing | 8 at once | disagreement, §2 |
| `firstLeadRule` | holder of `8♣` / left of the dealer / the dealer | holder of `8♣` | disagreement, §6 |
| `aceDiscardRestriction` | on / off | off | Wikipedia, flagged as dubious |
| `royalKozel` | on / off | off | Wikipedia, gamerules |
| `lastTrumpExchange` | on / off | off | Wikipedia |
| `boastedDeals` ("boasted deals") | — | not implemented | §7 |
| `targetPairs` | 6 | 6 | Wikipedia |

Player setups (§1):

- **4 players 2×2** — the main and the only fully described mode.
- **3 "with a blind"** — one player plays both for themselves and for the
  "dummy" hand, whose cards nobody sees. The sources do not specify the play
  order out of the dummy's hand.
- **3 "with the queen of spades"** — two against one, without "boasted deals".
  The soloist is determined by `Q♠` and nominates the trump. Each player keeps
  their own score. The rule "nominates the trump" fits poorly with the permanent
  trump group (§3) — it probably means an additional trump suit, as in "boasted
  deals".
- **2 players** — mentioned by gamerules and liveposts, which do not describe
  the mechanics.

**Chosen:** only the **4 players 2×2** setup is implemented. The other setups
are described in the sources too fragmentarily to be formalized without
guesswork.

Other variants encountered in the sources but **not implemented** because of
incomplete descriptions:

- **A 24-card deal of 6 each** (gamerules) — which 12 cards are removed and what
  becomes of the 14 trumps is not stated.
- **Playing with "half a deck", 16 cards in the first hand** (gamerules) — the
  description is internally contradictory.
- **A queen and `7♣` in different teams end the hand, the team with the queen
  gets +4 points** (Lifehacker) — a single source; it does not say which queen
  is meant or what counts as "ending".

---

## 12. Checklist of typical bugs

- [ ] `effectiveSuit`: queens, jacks and **all clubs** are trumps, not their own suits
- [ ] The queen of diamonds does **not** count as a response to a diamond lead
- [ ] A player holding only the queen of diamonds counts as **holding no** diamonds
- [ ] A lead with a queen/jack is a lead **into trump**, the response must be a trump
- [ ] Exactly **14** trumps: 4 queens + 4 jacks + 6 clubs
- [ ] The highest trump is `7♣`, the lowest `8♣` (not `7♣` at the bottom)
- [ ] The suit order among queens and jacks: ♣ > ♠ > ♥ > ♦
- [ ] Within the low clubs: `A > 10 > K > 9 > 8`
- [ ] In the plain suits: `A > 10 > K > 9 > 8 > 7` — **the ten is above the king**
- [ ] Strength and value are different scales (`7♣` is strongest and is worth 0)
- [ ] The **only** obligation is to follow suit; beating and trumping are not required
- [ ] A discard of a foreign suit never wins a trick
- [ ] The sum of the pots at the end of a hand is exactly **120** (check with an assert)
- [ ] The trick is taken by the strongest trump; in their absence, by the highest card of the led suit
- [ ] The next lead is made by **whoever took the trick**
- [ ] The first lead of the first hand belongs to the holder of `8♣`
- [ ] In subsequent hands the leader is **chosen** by the winning team after looking at the cards
- [ ] Leading a trump is forbidden only in the **first** trick of a hand and only when a plain card is held
- [ ] The **winner's** scoreboard moves; the loser's scoreboard is not touched
- [ ] "Lyusya" **resets the opponent and gives the winner no pairs**
- [ ] Order of checking the result: lyusya → +2 pairs → +1 pair → eggs
- [ ] "+2 pairs" requires both `≥ 90 points` and the opponent having a trick
- [ ] "Spas" (31) is counted in **points**, not in the number of tricks
- [ ] A 60:60 score does not move the scoreboard but sets the sticky `hadEggs` flag
- [ ] The scoreboard is **not monotonic** — a lyusya rolls the opponent back to 0
- [ ] The game runs to **6 pairs** (equivalent to 12 penalty points on the other scale)
- [ ] There are no marriages — do not drag the mechanic in from Thousand and Belote
- [ ] Trump is not determined by a turned-up card — it is fixed by the rules
- [ ] Do not implement trick-taking Kozel from Pagat's description of Burkozel
