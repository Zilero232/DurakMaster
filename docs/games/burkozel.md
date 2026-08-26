# Burkozel rules — formalized for implementation

The source of truth for implementing Burkozel in `packages/game-core`. The wording
is chosen so that it can be carried into code without guesswork. Wherever sources
disagree, this is stated explicitly along with the option chosen.

Primary sources: [Pagat — Bura and Kozel](https://www.pagat.com/aceten/bura.html)
(the **Kozel for points** section — that is the one describing Burkozel),
[Wikipedia — Bura (game)](https://ru.wikipedia.org/wiki/Бура_(игра)),
[gamerules.ru/burkozel](https://gamerules.ru/burkozel),
[minigames.mail.ru — Burkozel rules](https://minigames.mail.ru/info/article/pravila_burkozla),
[IgraFan — "Burkozel" rules](https://bkozel.igrafan.ru/help/bkozel.html),
[gambler.ru/Burkozel](https://www.gambler.ru/Burkozel),
[fokusotmoryaka.ru](https://www.fokusotmoryaka.ru/burkozel-kartochnaya-igra-pravila/),
[fb.ru](https://fb.ru/article/190407/kartochnaya-igra-burkozel-pravila).

---

## 0. Burkozel, Bura and Kozel — what exactly we are implementing

The three names get confused constantly, and nearly everything depends on which
one is meant. The distinction:

| | **Bura** | **Kozel for money** | **Burkozel** (our case) |
|---|---|---|---|
| Cards in hand | 3 | 4 | **4** |
| Leads | 1–3 cards of one suit | 1 or 3 cards of one suit | **1–4 cards of one suit** |
| End of deal | on declaring "31 points" | the whole deck is played out | **the whole deck is played out** |
| Outcome | the declarer takes the pot | the higher scorer takes the pot | **penalty points, game to 12** |

Burkozel is a hybrid: the trick mechanics come from Bura, the result scoring
comes from Kozel. Pagat describes it as **"Kozel for points"** (crediting
Alexander Tveladze), and it is the only source found where the rules are laid
out fully and without contradiction. **Every disputed point is resolved in its
favor.**

> **Sources disagree.** A significant share of Russian sites (gamerules.ru,
> minigames.mail.ru, fb.ru, fokusotmoryaka.ru) use "bura" and "burkozel" as
> synonyms and mix the rules of both games within a single article: they deal
> 4 cards (Kozel) but declare victory at "31 points" (Bura). Such a description
> is internally contradictory — when the whole 120-point deck is played out, the
> threshold of 31 cannot be a goal; it is used only as a penalty boundary.
> **Chosen:** we implement Burkozel per Pagat's "Kozel for points". Bura as a
> separate game is not described in this document.

> **Pitfall.** Card terminology in Russian sources is misleading: "kozyr"
> (trump) sometimes means "the trump suit" and sometimes "the card turned up
> under the deck". In code these are two distinct entities: `trumpSuit` and
> `trumpCard` (the latter is part of the deck, see §1).

---

## 1. Deck and deal

The deck is **36 cards** (6..A), four suits.

Ranks in ascending order of strength: `6 7 8 9 J Q K 10 A`.

> **Pitfall.** **The ten beats the king** — this is the ace-ten order, not the
> familiar Durak one. Rank and point value do not run in the same order as the
> usual list: `10` sits between `K` and `A`. Compare ranks strictly by position
> in the list above.

Each player is dealt **4 cards**, one at a time per round. The next card is
turned face up; its suit is trump for the whole deal. The turned-up card is
placed crosswise under the bottom of the deck and **is part of the deck**: it is
drawn last.

Number of players: **2, 3 or 4**. With four — teams of 2×2, partners sit
opposite each other (players `0`/`2` against `1`/`3`). With two and three —
every player for themselves.

> **Sources disagree.** Pagat allows up to 5 players for Kozel for money. For
> the points version — strictly 2–4. **Chosen:** 2–4.

## 2. Shokha — the six of spades

**6♠ (the "shokha") is the highest card in the deck.** It beats any card,
including the trump ace. Its point value nevertheless remains **0**.

Additionally, the shokha works as a suit joker: **when leading with several
cards, it may be attached to a set of any suit**. For example, the lead
`10♥ K♥ 6♠` is legal and unbeatable.

> **Pitfall.** The shokha is a joker **for leading only**, so that a one-suit
> set can be assembled. When responding, it is an ordinary (if highest) card:
> it can beat exactly one card of an opponent, not the whole set.

> **Sources disagree.** The shokha is mentioned by Pagat ("Kozel for points")
> and some Russian sites; gambler.ru and gamerules.ru are silent about it.
> **Chosen:** the shokha is included, but exposed as a table setting
> `shokhaEnabled` (on by default). With the setting off, 6♠ is an ordinary six
> and does not work as a joker.

## 3. First lead

The first to lead is the player **to the left of the dealer**. From then on,
each subsequent trick is led by **whoever took the previous trick**, unless
another player has seized the lead with a combination (§7).

> **Sources disagree.** gambler.ru claims the holder of the lowest trump leads
> first (a rule from Durak). No other source confirms this. **Chosen:** to the
> left of the dealer.

## 4. Leading

The leader plays **from 1 to 4 cards**, and all of them must be **of one suit**
(counting the shokha as a joker, §2). Call the number of cards in the lead `n`.

All other players, clockwise, are required to play **exactly `n` cards**.

**Following suit is not required.** A player is obliged neither to answer in
suit nor to beat with a higher card: they may play any `n` cards from hand. This
is the key difference from Durak.

> **Pitfall.** "Must respond with `n` cards" is the only hard constraint on the
> response. If the hand holds fewer than `n` cards (the deck has run out, hands
> are uneven), the player plays everything they have and cannot take the trick.

## 5. Who takes the trick

Responses are compared **not by point total and not by highest card**, but
card by card.

Formally. Let `B` be the best set currently on the table (initially, the lead).
A player plays a set `P` of `n` cards. `P` **beats** `B` if and only if there
exists a bijection between `P` and `B` in which **every** card of `P` beats the
card of `B` matched to it.

A single card `x` beats a card `y` if:
- `x` and `y` are of the same suit and the rank of `x` is higher than the rank of `y`;
- or `x` is a trump and `y` is not a trump;
- or `x` is the shokha (it beats everything at all, §2).

A trump is beaten only by a higher trump or by the shokha.

**The cards in the beating set are not required to be of one suit** — the
"one suit" restriction applies only to the lead.

Example (trumps are hearts): the lead `A♠ K♠ J♠` is beaten by the set `8♥ 6♥ Q♥`
(three trumps against three non-trumps), and this in turn is beaten by the set
`6♠ 7♥ 10♥`.

The trick is taken by the player whose set was the last to beat. **If none of
the responders beat the lead, the trick goes to the leader.**

> **Pitfall #1.** The temptation is to compare sets "highest against highest" or
> by point total. Wrong: what is needed is exactly a matching in which every
> card beats. The set `A♥ 6♦ 6♣` does not beat `K♠ Q♠ J♠`, even though it
> contains the trump ace.

> **Pitfall #2.** A single card of a high rank but **of a foreign suit and not a
> trump** is easily miscounted as beating. `Q♠` is not beaten by `K♦` if
> diamonds are not trump.

> **Pitfall #3.** The matching check is a bipartite assignment, not a greedy
> sort. With `n ≤ 4`, brute-forcing all `n!` assignments is cheap (24 variants
> at most) and more reliable than any heuristic.

**Face-down cards.** In Burkozel all **non-beating** sets are laid face down.
Only the lead and only the set that beat the current best are laid face up.
Nobody, including the taker of the trick, sees the face-down cards until the
end of the deal.

> **Invariant.** Face-down cards do not go to the client — this follows
> directly from project invariant #3 (deck order and hidden cards never leave
> the server). Sending them "hidden on the client" is unacceptable: they are
> visible in the traffic.

## 6. Drawing

After each trick, players draw **one card at a time in turn**, starting with
**whoever took the trick** and continuing clockwise, until everyone has 4 cards
or the deck is empty.

The turned-up trump card is the last card of the deck and goes to the last
player to draw.

When the deck is empty there is no drawing: play continues with whatever is in
hand until all cards have been played.

> **Pitfall.** The draw order matters when the deck holds fewer cards than
> everyone needs: it determines who ends up with an incomplete hand and who gets
> the trump. Unlike Bura, where a short remainder of the deck is simply not
> used, in Burkozel players draw down to the last card.

## 7. Combinations: leading out of turn

A player who, **after drawing**, holds one of the combinations may declare it
and lead to the next trick, even if they did not take the trick.

| Combination | Composition | Priority |
|---|---|---|
| **Moscow** | 4 cards consisting only of aces and tens, **at least one genuine ace**; 6♠ may substitute for a ten | higher |
| **Molodka** | 4 cards of one suit (any suit, not necessarily trump), or 3 cards of one suit + 6♠ | lower |

Examples of Moscow: `A A A A`, `A 10 10 10`, `A 10 10 6♠` — legal.
`10 10 10 10` and `10 10 10 6♠` are **not Moscow** (no genuine ace).

At equal priority, the lead goes to the player whose turn to play to this trick
would have come earlier.

> **Sources disagree.** Russian sites list more combinations and confuse their
> composition: "bura" = 4 trumps (immediate win of the deal), "moscow" =
> **3** aces including a trump one, "4 ends" = 4 aces or 4 tens, "golden kozel"
> = 4 aces with a penalty to the opponents. The compositions given by different
> authors are mutually contradictory, and the ranking of combinations is
> explicitly declared to "depend on the group you play with".
> **Chosen:** only Moscow and Molodka, in the compositions given by Pagat,
> without an immediate win of the deal. The remaining combinations are not
> implemented; if needed, add them as separate table settings, not into the base
> rules.

> **Pitfall.** The moment of declaration is **after drawing and before leading**
> to the next trick. A combination that comes together in the middle of a trick
> gives nothing.

## 8. End of the deal and scoring

The deal runs until all 36 cards have been played. Then each player (or team)
counts the points in the tricks they took.

Card values:

| Card | A | 10 | K | Q | J | 9 | 8 | 7 | 6 |
|---|---|---|---|---|---|---|---|---|---|
| Points | 11 | 10 | 4 | 3 | 2 | 0 | 0 | 0 | 0 |

That is 30 points per suit, **120 points in the deck**. The sum of all players'
points at the end of a deal must equal 120 — this is a checkable invariant.

> **Sources disagree.** fokusotmoryaka.ru writes "90 points in the deck in
> total". This is arithmetically wrong: `(11+10+4+3+2)×4 = 120`. Pagat and
> gambler.ru give 120. **Chosen:** 120.

## 9. Penalty points

Whoever scores **the most** points receives **0** penalty points. Penalties are
assessed to the rest, and the threshold depends on the number of players.

**Two players, or four in 2×2 teams** (threshold — half of 120):

| Condition | Penalty |
|---|---|
| Most points | 0 |
| 31 points or more | 2 |
| 0–30 points, but at least one trick taken | 4 |
| No tricks taken at all | 6 |
| A 60:60 tie | 2 to each side |

**Three players** (threshold proportionally lower):

| Condition | Penalty |
|---|---|
| Most points | 0 |
| 21 points or more | 2 |
| 0–20 points, but at least one trick taken | 4 |
| No tricks taken at all | 6 |
| A tie for first place | 2 to everyone in the tie |

> **Pitfall.** "0 points" and "took no tricks" are **different** states. It is
> possible to take three tricks made up of sixes and sevens: 0 points, but the
> penalty is 4, not 6. The count of tricks taken must be tracked, not only the
> points.

> **Sources disagree.** Russian sites quote thresholds of 31/21 interchangeably
> without tying them to the number of players, while gambler.ru names 60 as the
> threshold (and derives a scale of 2 / 4 / 6 for "under 60 / under 31 / zero
> tricks" — three different conditions instead of two, which is contradictory).
> **Chosen:** the Pagat scale, with the threshold depending on the number of
> players: 31 for two players and for 2×2, 21 for three.

## 10. End of the game — who is the "kozel"

Penalty points accumulate across deals. The player (or team) with **12 or more**
penalty points **loses and is eliminated**.

- With two players and with 2×2, the elimination of one side ends the game.
- With three: the eliminated player leaves, the two remaining ones **keep their
  scores** and continue the game until one player is left. Note: after the third
  player is eliminated, the penalty thresholds switch to the two-player ones (31).
- If in a single deal **all** remaining players reach the threshold (possible
  only on a tie for first place), the one with more penalty points is
  eliminated; if more than one still remains after that, another deal is played.

The last player left is the winner. **The "kozel" is the eliminated one**, that
is, the first to accumulate 12 penalty points.

> **Pitfall.** The threshold is `>= 12`, not `== 12`: a single deal awards up to
> 6 points, and the score easily jumps over 12.

> **Sources disagree.** The requested "letters of the word KOZEL" rule **was not
> found in any source on Burkozel**. Spelling out the five letters of "КОЗЁЛ" one by one
> belongs to a different, identically named game — the four-player "Kozel"
> (`ru.wikipedia.org/wiki/Козёл_(карточная_игра)`), which has nothing to do with
> Burkozel and is played by different rules.
> **Chosen:** the letters are not implemented; the loser is determined by 12
> penalty points. If the letters are wanted as UI decoration, they may be a
> purely visual representation of the score (five letters against 12 points does not
> divide evenly, so the mapping would have to be specified separately), but they
> are not a rule of the game.

> **Sources disagree.** The limit of 12 points is confirmed by Pagat,
> gambler.ru, minigames.mail.ru and IgraFan. IgraFan adds "or an agreed limit".
> **Chosen:** 12 by default, table setting `penaltyLimit`.

---

## 11. Rule variants

What was found in the sources and how it was decided:

| Variant | Source | Decision |
|---|---|---|
| Deal of 3 cards, leads of 1–3, win by declaring "31" | this is **Bura**, not Burkozel | not implemented in this document |
| Deal of 4 cards, lead of only 1 or 3 cards | Pagat, "Kozel for money" | not implemented; in Burkozel it is 1–4 |
| A 32-card deck (no sixes) | Pagat, for Bura | not implemented: without 6♠ the shokha breaks |
| First lead by the lowest trump | gambler.ru | not implemented, see §3 |
| Shokha (6♠) as highest card and lead joker | Pagat + some Russian sources | setting `shokhaEnabled`, **on** by default |
| "Bura" (4 trumps) — immediate win of the deal | Wikipedia, Russian sites | not implemented, see §7 |
| "4 ends" (4 aces or 4 tens) | gamerules.ru, IgraFan, fb.ru | not implemented, see §7 |
| "Golden kozel" (4 aces, 6 penalty points to each opponent) | secondhand retellings | not implemented: composition and effect unconfirmed |
| Open play (all cards face up) | Pagat describes the opposite for Bura — closed | in Burkozel closed play is mandatory, see §5 |
| 2×2 teams | Pagat, gamerules.ru, gambler.ru | implemented, §1 |
| "Cheating" / "anti-cheating" | minigames.mail.ru | vendor mechanics of a specific implementation, not a rule of the game |
| A penalty limit other than 12 | IgraFan | setting `penaltyLimit` |
| "Twenty-one" | unrelated to Burkozel (a separate game) | no |

**Could not be established reliably:**
- the order of dealing with 3 players, when 36 does not divide by 3 evenly after
  the trump is turned up — the sources are silent; it follows from the
  mechanics: 3×4 = 12 are dealt, the 13th is turned up, 23 remain in the deck,
  and all of them are played out;
- what to do if a player cannot play `n` cards at the end of a deal (hands are
  uneven because of a seized lead). There is no explicit rule. **Chosen:** the
  player plays all remaining cards, and the lead cannot be beaten with such an
  incomplete set;
- whether a combination must be declared immediately or may be held back.
  **Chosen:** declaration is voluntary, but only at the moment between drawing
  and leading.

---

## 12. Checklist of typical bugs

- [ ] The ten beats the king (ace-ten order), ranks are compared by position in the list
- [ ] Value and rank are different scales, do not derive one from the other
- [ ] The sum of all players' points for a deal equals 120 (the invariant is checked)
- [ ] The lead is one suit only; the response may be any suits
- [ ] Responding with **exactly** `n` cards is mandatory, but following suit is not
- [ ] Beating a set is a matching where "each beats its own", not a comparison of highest cards
- [ ] Brute-force all `n!` assignments, not a greedy sort
- [ ] A non-trump high card of a foreign suit does **not** beat
- [ ] If nobody beat, the trick goes to the leader, not to the last player to play
- [ ] The shokha beats everything but is worth 0 points
- [ ] The shokha is a suit joker only when leading, not when responding
- [ ] Non-beating sets are face down and do not go to the client
- [ ] Drawing starts with whoever took the trick, the trump card is drawn last
- [ ] The deck is played out to the end, drawing continues down to the last card
- [ ] "0 points" and "no tricks" are different penalties (4 and 6)
- [ ] The penalty threshold depends on the number of players: 31 (two, 2×2) and 21 (three)
- [ ] When the third player is eliminated, the thresholds switch to the two-player ones
- [ ] A tie for first place gives 2 penalty points to everyone in the tie
- [ ] Elimination at `>= 12`, not `== 12`
- [ ] A combination is declared after drawing and before leading, not mid-trick
- [ ] Moscow requires at least one genuine ace
- [ ] Moscow has priority over Molodka
