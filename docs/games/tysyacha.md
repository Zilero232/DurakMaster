# Tysyacha rules — formalized for implementation

Source of truth for implementing the rules of Tysyacha (Thousand, 1000). The
wording is chosen so that it can be carried into code without guesswork. Wherever
sources disagree, this is stated explicitly along with the option that was chosen.

Tysyacha is a trick-taking game with bidding and a **dynamic trump**: trump is not
set by the deal but is declared during play by marriages and can change several
times within a deal. This is the main difference from Durak and the main source of
bugs.

Primary sources: [Pagat — 1000 (Tysiacha)](https://www.pagat.com/marriage/1000.html),
[Wikipedia (pl) — Tysiąc](https://pl.wikipedia.org/wiki/Tysiąc_(gra_karciana)),
[Cyclowiki — Тысяча](https://cyclowiki.org/wiki/Тысяча_(игра)),
[minigames.mail.ru](https://minigames.mail.ru/info/article/pravila_tysjacha),
[gambiter.ru](http://www.gambiter.ru/1000/item/71-pravila1000.html),
[1000cardgame.com](https://1000cardgame.com/rules/),
[thousand.igrafan.ru](https://thousand.igrafan.ru/help/thousand.html),
[cards-1000.ru](https://cards-1000.ru/pravila-igry/6-bochka-i-ryad-drugikh-dopolnenij),
[tisyacha.ru](https://tisyacha.ru/).

---

## 1. Players

**The classic game is 3 players.** All three are active in every deal. All other
variants reduce to a three-handed play.

**4 players — with a "dummy" (bolvan).** In each deal the dealer sits out ("sits on
the widow"), and three play. The deal passes clockwise, so each player skips every
fourth deal. Play is identical to the three-handed game.

> **Sources disagree.** What the sitting-out player receives:
> Pagat — a variant where they score 40 for every ace in the widow and the full
> value of a marriage if a marriage turned up in the widow; some Russian sources —
> a fixed 30 points as a "skip bonus"; most — nothing.
> **Chosen:** the sitting-out player receives nothing (`skipBonus: none`), the rest
> is a table setting.

**2 players.** Two independent variants; these are different games, not a parameter:

- **With bidding.** 10 cards each, **two** widows of 2 cards each.
  The winner of the auction takes both widows (in some versions — one, the second
  going to whoever wins the last trick). Play then proceeds as usual.
- **With drawing** (`tysiacha-draw`). 6 cards each, 12 cards in a face-down stock,
  no widow and no bidding. In the first 6 tricks there is **no obligation to follow
  suit** and no obligation to trump; after each trick both players draw a card.
  Once the stock is exhausted, the normal restrictions on play switch on.

> **Pitfall.** The two-handed draw variant changes the move-validation function
> itself in the middle of a deal. The "stock is empty" flag must be part of the
> state, not derived from the number of tricks played.

**Full breakdown by variant** (cards in hand × players + widow = 24):

| Variant | In hand | Widow | Active |
|---|---|---|---|
| 3 players (classic) | 7 | 3 | 3 |
| 4 players with a dummy | 7 | 3 | 3 |
| 2 players with bidding | 10 | 2 + 2 | 2 |
| 2 players with drawing | 6 | — (stock of 12) | 2 |

## 2. Deck and rank order

The deck is **24 cards**: `9 10 J Q K A` in four suits.

The rank order by ascending strength is **non-standard**; the ten sits between the
king and the ace:

```text
9  J  Q  K  10  A
```

That is, the ace beats the ten, the ten beats the king, the king beats the queen,
the queen beats the jack, the jack beats the nine. This is confirmed unanimously by
all sources (Pagat: "Tens are higher than kings"; Russian sources: "9, J, Q, K, 10, A").

> **Pitfall.** The order `9 J Q K 10 A` coincides with the order by card value
> (0, 2, 3, 4, 10, 11). It is tempting to compare cards by their point value — but
> the coincidence here is accidental and holds only for this deck. **Compare only
> by position in the rank list**; value is a separate table.

> **Pitfall.** The rank order differs from Durak (`... 9 10 J Q K A`).
> If the project has a shared card module, rank order must be a parameter of the
> game, not a constant of the package.

## 3. Card values

| Card | Points |
|---|---|
| Ace (A) | 11 |
| Ten (10) | 10 |
| King (K) | 4 |
| Queen (Q) | 3 |
| Jack (J) | 2 |
| Nine (9) | 0 |

**One suit is 30 points. The whole deck is 120 points.** This is the total of trick
points in a deal excluding marriages, and it is fixed: 120 points are always
distributed among the players in full.

> **Pitfall.** 120 is not "approximately" — it is an invariant. The sum of trick
> points of all players in a completed deal must equal exactly 120. A good check in
> tests and at runtime.

Marriages are added **on top of** these 120 and have no upper bound: the theoretical
maximum for a deal is 120 + 40 + 60 + 80 + 100 = 400 points.

## 4. Widow and bidding

### The deal

Cards are dealt one at a time clockwise. Three cards are set aside face down as the
**widow** (prikup).

> **Sources disagree.** Exactly when the widow cards are set aside: Russian sources
> require "do not put the first or the last three cards into the widow" (that is,
> the widow is formed from cards in the middle of the deal), Pagat — "prikup cards
> distributed during first three rounds". **Chosen:** for a cryptographically fair
> deal this makes no difference — the widow is taken from the top of the shuffled
> deck. The rule exists as a defence against unfair live dealing and is meaningless
> in code.

### Bidding

What is being bid for is the **right to take the widow**. A bid is the number of
points a player undertakes to score.

- **The player to the left of the dealer bids first** and is **required** to declare
  at least **100**.
- Then clockwise: each player either raises or passes.
- **A player who has passed does not return to the bidding.**
- Bidding ends when all but one have passed. That player is the **declarer**
  (the bidder); the others are the **defenders** (vistuyushchie).

**The bidding step is 5 points** (100, 105, 110, …).

> **Sources disagree.** The step: the Russian tradition and Pagat — 5; the Polish
> tradition (Tysiąc) — 10; tisyacha.ru mentions a step of 1.
> **Chosen:** 5, as a table setting `bidStep` with values 5/10.
> All bids must be multiples of the step.

### Bid ceiling

**Without a marriage in hand you cannot bid more than 120.**

With marriages the ceiling = `120 + the sum of the values of the marriages in hand`:

| Marriages in hand | Ceiling |
|---|---|
| none | 120 |
| spades | 160 |
| clubs | 180 |
| diamonds | 200 |
| hearts | 220 |
| several | 120 + sum of values |

The theoretical maximum is 120 + 280 = 400.

> **Pitfall.** The ceiling is computed from the marriages **in hand at the moment of
> the bid**, before the widow. A marriage that comes together out of the widow does
> not raise the ceiling retroactively — but the declarer is entitled to raise the bid
> after taking the widow (see below).

> **Sources disagree.** gambiter.ru gives a maximum of 300 with no link to marriages;
> the Polish tradition — 360 with three marriages.
> **Chosen:** the formula `120 + sum of values`, ceiling 400.

> **Pitfall.** The ceiling must be validated on the server against the real hand. The
> client cannot be the source of truth about holding a marriage — otherwise a bid of
> 400 with no cards goes through.

### Widow and discard

The declarer:

1. **Turns the widow face up** — all three cards are seen by all players.
2. Takes them into hand (making 10 cards in the three-handed layout).
3. **Gives one card to each opponent** — one to each of the two defenders, leaving
   the declarer with 8 cards, the same as everyone else.

> **Sources disagree.** Whether the cards are given to opponents face up or face down:
> Pagat — "one face-down to each opponent"; 1000cardgame.com — "gives them face up".
> **Chosen:** face down (an opponent sees only the card they received).
> Table setting `discardVisibility`.

> **Sources disagree.** Whether the widow is exposed to everyone: the Polish tradition
> knows three variants — always show / show only when the bid is above 100 / never show.
> **Chosen:** always show.

After the discard, the declarer **is entitled to raise the bid** (but not to lower it).
This is a separate action, not part of the bidding: the opponents do not respond to it.

> **Pitfall.** Raising after the widow is not a resumption of bidding. The defenders do
> not gain the right to outbid.

### Redeal

The right to demand a redeal (the deal is annulled, nothing is scored for anyone, the
same player deals):

- a player holding **four nines**;
- by agreement — four jacks, or a hand whose point total is below a threshold
  (thresholds of 10, 14, 18 are found).

> **Sources disagree.** The set of redeal conditions differs across every source.
> **Chosen:** there is one mandatory condition — four nines; the rest is off by default.
> The right is lost as soon as the player has made a bid.

## 5. Marriages

A **marriage** (maryazh) is a king and a queen **of the same suit** in one player's hand.

| Marriage | Points |
|---|---|
| Hearts ♥ | 100 |
| Diamonds ♦ | 80 |
| Clubs ♣ | 60 |
| Spades ♠ | 40 |

The order is confirmed unanimously by all sources: hearts is the highest, spades the
lowest.

### Conditions for declaring

A marriage may be declared only when all of the following hold at once:

1. The player is **leading** (playing the first card to a trick), not following.
2. **Both cards of the marriage are in hand** at the moment of the declaration.
3. The player **leads with one of those two cards** — the king or the queen of that suit.

The marriage points are recorded to the player **immediately and unconditionally** —
even if the trick in which it was declared is won by an opponent.

> **Pitfall.** A marriage counts regardless of what happens to the trick. Awarding it
> to the winner of the trick is a common and expensive mistake.

> **Pitfall.** The condition "both cards in hand" is checked **before** the played card
> is removed. Checking it after means a marriage will never pass validation.

### When it can be declared for the first time

> **Sources disagree — the biggest disagreement in this document.** Can the declarer
> declare a marriage while leading to the **first** trick?
> - Pagat: "You can only announce a king-queen pair immediately after you have
>   won a trick" — that is, no, you must first **win** a trick.
> - gambiter.ru, 1000cardgame.com, thousand.igrafan.ru: "declaring is possible
>   only on your own lead, **starting from the second**" — the same restriction in
>   different words.
> - The Polish tradition (Tysiąc): a marriage is declared by whoever leads to any
>   trick, **including the first**.
>
> **Chosen:** the Russian variant — a marriage cannot be declared in the first trick
> of a deal. Formally: declaring is allowed if the player is leading and **has already
> won at least one trick in this deal**. Table setting `marriageOnFirstTrick` (off by
> default).

> **Pitfall.** "Has already won a trick" is not the same as "it is the second trick".
> A player who won the third trick leads to the fourth and may declare; a player who
> has won nothing cannot lead at all — the lead always belongs to the winner of the
> previous trick. So under the chosen variant the condition reduces to "the trick is
> not the first", but it must be expressed as "there is a won trick", otherwise the
> two-handed draw variant breaks.

### Leading with a marriage card without declaring

A player is entitled to lead with a king or a queen **without declaring** the
marriage — then no points are recorded and the trump does not change. Declaring is an
explicit player action, not an automatic consequence of the lead.

> **Pitfall.** Not declaring is a legitimate tactic (you may not want to hand a trump
> to an opponent, or to change a favourable trump). Automatic declaring breaks the game.

### A marriage in the widow

A marriage that ends up in the widow goes to the declarer as ordinary cards: they will
be able to declare it during play if they do not discard the king or the queen. There
are no separate points for a "marriage in the widow".

> **Sources disagree.** In the 4-player variant some sources (Pagat) score the value of
> a marriage from the widow to the sitting-out player. **Chosen:** no, see section 1.

### Ace marriage

Some Russian sources introduce an "ace marriage" — 200 points for all four aces in
hand. The conditions for declaring differ (tisyacha.ru — requires holding at least one
trick).

> **Chosen:** not implemented. It is not confirmed by Pagat or the Polish sources, and
> the conditions for declaring are incompatible across sources. Table setting
> `aceMarriage` — reserved for the future, off by default.

## 6. Trump

**At the start of each deal there is no trump** — the deal begins no-trump.

Trump is set **only** by declaring a marriage: the suit of the declared marriage
immediately becomes trump.

The trump **changes** with every subsequent declared marriage — by any player,
including the defenders. The previous trump suit becomes an ordinary suit and leaves
no trace.

Within a deal the trump can change up to **four** times (one per suit): a marriage of
each suit is declared at most once, since the king and the queen physically exist in a
single copy.

> **Pitfall.** Trump is part of the deal state (`trump: Suit | null`) and changes
> during play. Treating it as a constant of the deal (as in Durak) is a structural
> error that is expensive to fix later.

> **Pitfall.** A change of trump **does not re-evaluate tricks already played**. A
> trick is played under the trump that was in effect **at the moment it was played**.
> The winner of a trick is determined as soon as it ends and is not revisited.

> **Pitfall.** The trump changes **before** the other players put cards into that same
> trick. The declarer leads with a card of the marriage — which means that trick is
> already being played under the new trump, and its suit is trump in that trick. The
> obligation to trump when lacking the led suit in that trick is computed against the
> **new** trump.

## 7. Playing and tricks

The **declarer** leads first in the deal.

After that, the **winner of the previous trick** leads.

The order within a trick is clockwise from the leader.

### Obligations of a follower

A player must play a card by the first applicable rule:

1. **Holds a card of the led suit** — must play a card of that suit.
   Additionally must **beat** it (play higher than the highest card of that suit on
   the table), if such a card is held.
2. **Lacks the led suit but holds a trump** — must play a trump.
   If there is already a trump on the table, must **beat it with a higher trump**, if
   able.
3. **Holds neither the led suit nor a trump** (or no trump has been set in the deal
   yet) — plays any card.

> **Sources disagree.** The obligation to **beat** within a suit (not just to follow
> suit, but to play higher):
> - The Polish tradition and Pagat: "Must beat trick if possible" — required.
> - minigames.mail.ru: states only the obligation to follow suit, says nothing about
>   beating.
>
> **Chosen:** the obligation to beat exists — both in the led suit and in trump.
> This is the dominant rule and it is essential to the game's depth.

> **Pitfall.** The obligation to beat is computed relative to the **highest card of
> that suit on the table**, not relative to the led card. In a three-card trick the
> third player must beat both, if able.

> **Pitfall.** The obligation to beat **does not apply across suits**. If spades were
> led and a player plays a trump (they hold no spades) — they have beaten the trick.
> The next player, who also holds no spades, must play a trump **higher** than that
> trump; but if they hold a spade, they must play the spade, even though it is
> obviously weaker than the trump.

> **Pitfall.** Rule 2 applies **only if a trump has been set in the deal**. Before the
> first marriage there is no trump, and lacking the led suit a player plays any card.

### Determining the winner of a trick

The trick is taken by:

- the **highest trump**, if the trick contains at least one trump;
- otherwise — the **highest card of the led suit**.

Cards of other suits, played when lacking the led suit and a trump, do not take part
in the trick — but their points go to the winner.

> **Pitfall.** Discarding an off-suit card always loses, even if it is an ace. Comparing
> cards in a trick without regard to suit is a typical mistake.

### Trick points

The winner of a trick adds to their deal score the **sum of the values of all the cards
in the trick** (including discarded off-suit cards).

## 8. Scoring after the deal

A player's points for the deal = **points of the cards taken** + **points of the
marriages they declared**.

The sum of card points across all players is always 120.

### The declarer

Let `bid` be the final bid and `scored` the points the declarer accumulated.

- `scored >= bid` → **exactly `bid`** is added to their score, not `scored`.
- `scored < bid` → **`bid` is subtracted** from their score.

> **Pitfall.** On success the bid is recorded, not what was scored. Bid 170, scored
> 220 — 170 is recorded. The excess above the bid is lost.

> **Pitfall.** The declarer's points are **not rounded**, neither when checking the bid
> nor when recording it. One point short means the bid was not made. Rounding before the
> check is an error that changes the outcome of the deal.

### The defenders

Each defender adds the points they scored, **rounded to a multiple of 5**: down with a
remainder of 1–2, up with a remainder of 3–4. Examples: 17 → 15, 18 → 20.

> **Sources disagree — an important one.** Rounding to 5 or to 10:
> - The Russian tradition (mail.ru, igrafan, gambiter): to **5**, down at 2, up at 3.
> - The Polish tradition (Tysiąc) and the variant in Pagat: to **10**, with a remainder
>   of 5 rounded up (by agreement — sometimes down).
>
> **Chosen:** to 5 by the Russian rule. Table setting `roundingStep` (5/10).
> With a step of 10, a remainder of 5 rounds **up**.

> **Pitfall.** Rounding is applied to the defender's **total** points (cards +
> marriages), not to each trick separately. Per-trick rounding gives a different result.

> **Pitfall.** A defender's marriages count and are recorded even if they took few
> tricks. A marriage is not a bonus on top of tricks but an independent source of points.

### Conceding (the declarer giving up the deal)

The declarer, realizing the bid cannot be made, is entitled to **concede** (raspis) the
deal — to admit the loss without playing out the cards.

- The declarer: **`−bid`** to their score.
- Each defender: **`+bid/2`**.

> **Sources disagree.** What the defenders get on a concession: mail.ru, tisyacha.ru —
> half the bid; Pagat — a fixed 60 each.
> **Chosen:** half the bid (rounded to a multiple of 5 by the general rule).

> **Sources disagree.** Pagat adds a separate penalty counter for concessions: the first
> two carry no consequence, every third one is minus 120.
> **Chosen:** not implemented, there are enough penalty counters already.

**Conceding is forbidden to a player on the barrel** (see section 10).

## 9. Bolts and penalties

A **bolt** (also called a "stick") is a deal in which a player **took no tricks at all**.

For **three bolts** a player is docked **120 points**, and the bolt counter is reset.

> **Sources disagree.** Whether the three bolts must be **consecutive**: tisyacha.ru and
> some sources — consecutive (any trick resets the counter); mail.ru — simply three
> times, cumulatively. Pagat states a close rule as "score zero on three occasions",
> that is, cumulatively.
> **Chosen:** cumulative (three bolts per game, not necessarily consecutive).
> Table setting `boltsMustBeConsecutive`.

> **Pitfall.** A bolt is zero **tricks**, not zero points. A player who took a trick of
> three nines (0 points) does **not** get a bolt.

> **Pitfall.** The declarer can also get a bolt. A bolt and a failed bid are independent
> penalties; both are applied.

**Penalties for dealing violations** (an exposed card, an incorrect widow, a bid above
the ceiling) — 120 points to the dealer/offender and a redeal. Not applicable in an
online implementation: the server deals correctly, and illegal actions are rejected by
validation rather than penalized.

## 10. The drum

> **Not confirmed by sources.** The term "drum" (baraban) as a separate rule of Tysyacha
> **could not be found**. Checked: Pagat (ru and pl sections), Russian Wikipedia,
> Cyclowiki, gambiter.ru, mail.ru, igrafan, 1000cardgame.com, cards-1000.ru,
> tisyacha.ru — none of them describes a rule under that name.
>
> Most likely "drum" is a regional synonym for the **barrel** (section 11): both words
> describe the same situation of "stuck at the finish, obliged to bid". The phrase "to
> put someone on the drum" occurs in live speech in exactly the same sense as "to put
> someone on the barrel".
>
> The rule "whoever scores too much is put on the drum" (a penalty for a player who
> scored a lot **without bidding**) is not confirmed by the sources in any form. The
> closest rule that actually exists is the **blocking of a defender near the finish**:
> in the Polish tradition a player at 800+ (in the Russian one — on the barrel, 880+)
> **stops receiving points for defending** and can grow only through their own bids.
> This protects against winning "on someone else's back" and is probably what is meant.
>
> **Chosen:** there is no separate "drum" entity in the model. What is implemented is
> the blocking of defender points on the barrel (section 11). If the term is needed in
> the UI — treat it as a synonym of the barrel.

## 11. The barrel (880)

A player whose score reaches **880 or more** (but less than 1000) **sits on the barrel**:
their score is **fixed at 880** regardless of how much they scored beyond it.

On the barrel:

- **No points are awarded for defending.** Growth is possible only through one's own bid.
- **Three attempts** are given — three deals.
- To win, one must **win the bidding and make a bid of at least 120**.
- If it is not done in three attempts — a **penalty of 120 points**, the score becomes
  **760**, the player comes off the barrel and plays in the normal way.

> **Sources disagree.** The required bid: "at least 120" (Pagat, mail.ru) or "more than
> 120, that is, from 125" (cards-1000.ru), or "121 points" (Cyclowiki, igrafan — from 880
> to 1001 the shortfall is 121).
> The difference lies in whether the finish is at **1000** or at **1001**.
> **Chosen:** the finish is at 1000, the required bid is **at least 120**.
> Table setting `winningScore` (1000/1001) with a consistent recomputation of the threshold.

> **Pitfall.** "Three attempts" means three **deals**, not three deals in which the player
> won the bidding. A deal where an opponent won the bidding **uses up** an attempt: the
> player on the barrel scored no points and could not get closer. Counting only their own
> bids as attempts is an error that makes it impossible ever to fall off the barrel.

> **Sources disagree.** Some sources count as attempts only the deals in which the player
> was the declarer. **Chosen:** an attempt = a deal (see above).
> Setting `barrelAttemptsCountAllDeals`.

> **Pitfall.** A failed bid on the barrel subtracts the bid from 880 — the player falls off
> the barrel immediately, without waiting for the third attempt. They will sit on it again
> once they reach 880 again.

**Conceding on the barrel is forbidden** — the declarer must play the deal out.

**The third barrel.** Some sources: a player who has come off the barrel for the third time
in a game is reset to zero and starts from scratch; on the third barrel, in the third deal
the widow is given to them face up without bidding ("obligation").

> **Chosen:** not implemented. The rule is confirmed by a single source (cards-1000.ru) and
> the formulations are contradictory.

**The reverse barrel** — the symmetric rule for −880: if in three deals the player has not
reached −1000, they are raised to −760. Rarely encountered.

> **Chosen:** not implemented, setting `reverseBarrel` reserved for the future.

## 12. End of the game

The winner is the first player to reach **1000 points or more**.

**Hitting exactly 1000 is not required.** Overshooting is allowed and is not penalized in
any way — but in practice overshooting is impossible: the barrel fixes the score at 880,
and after that the player records only a made bid, at least 120, which lands them exactly
on 1000 or above.

> **Sources disagree.** The threshold: **1000** (Pagat, mail.ru, gambiter, the Polish
> tradition) or **1001** (Cyclowiki, igrafan — "1000 or 1001 by agreement"). The 1001
> variant exists so that coming off the barrel requires strictly more than 120 and a
> marriage is mandatory.
> **Chosen:** 1000. Table setting `winningScore`.

> **Sources disagree.** Whether a defender can win by passing 1000 on defending points:
> the Russian rules — no, the score is fixed on the barrel (880), and defending points are
> not recorded on the barrel at all; the Polish variant — the game continues, such a player
> is scored 990 or nothing.
> **Chosen:** winning is possible only through one's own made bid.
> This follows directly from the barrel and needs no separate rule.

If two players win at the same time (possible only with the barrel disabled), the one with
more points wins.

## 13. Dump truck (555)

A player whose score becomes **exactly 555** is reset — the score becomes 0.

The symmetric variant: a score of **−555** is also reset (raised to 0).

> **Pitfall.** The condition is **exact equality** with 555, not "reached or exceeded".
> It is checked after the deal result is recorded.

> **Chosen:** table setting `dumpTruck`, **off** by default.
> The rule is confirmed by several Russian sources but is absent from Pagat and the Polish
> tradition; it is purely for entertainment.

## 14. The golden (raspisnoy) round

A special mode for the first deals of a game.

> **Sources disagree — strongly.** Three incompatible descriptions were found:
> - **1000cardgame.com:** the first three rounds of deals — a fixed bid of 120 with no
>   bidding, the widow is taken by the player to the left, all points are doubled.
> - **cards-1000.ru:** the first round — the widow goes automatically to the player to the
>   left, the bid is 120, all points are doubled (±240); on failure the round is replayed.
> - **thousand.igrafan.ru:** the "golden round" is the first three rounds with a ×2
>   multiplier, bidding as usual.
>
> The term **"raspisnoy kon"** in the sources means something else — simply a deal in which
> the declarer conceded the game (section 8). It has no connection to the golden round; the
> resemblance is only in the sound.
>
> **Chosen:** not implemented. Table setting `goldenRound` reserved for the future; if
> implemented, take the cards-1000.ru variant as the most concrete: the first round (one
> deal per player), a bid of 120 with no bidding, the widow to the player to the left of the
> dealer, the result doubled.

## 15. Blind bidding

The declarer is entitled to declare a bid of **120 without looking at their cards**. The
result of the deal is doubled: **+240** on success, **−240** on failure.

> **Sources disagree.** The conditions for allowing it: 1000cardgame.com — no conditions;
> cards-1000.ru — only from a score of 240 points, and forbidden on the barrel.
> **Chosen:** not implemented. Setting `darkBid` reserved for the future.

## 16. Table settings

Confirmed variations worth exposing as table parameters:

| Setting | Values | Default |
|---|---|---|
| `players` | 2 / 3 / 4 | 3 |
| `twoPlayerMode` | auction / draw | auction |
| `bidStep` | 5 / 10 | 5 |
| `roundingStep` | 5 / 10 | 5 |
| `marriageOnFirstTrick` | on / off | off |
| `discardVisibility` | face up / face down | face down |
| `boltsMustBeConsecutive` | on / off | off |
| `barrelAttemptsCountAllDeals` | on / off | on |
| `winningScore` | 1000 / 1001 | 1000 |
| `dumpTruck` (555) | on / off | off |
| `skipBonus` (4 players) | none / aces / fixed30 | none |

Not implemented, reserved: `aceMarriage`, `goldenRound`, `darkBid`, `reverseBarrel`, the
third barrel.

---

## 17. Checklist of typical bugs

**Cards and deck**

- [ ] Rank order `9 J Q K 10 A` — the ten sits between the king and the ace
- [ ] Ranks are compared by position in the list, not by card value
- [ ] Tysyacha's rank order is not confused with Durak's in a shared card module
- [ ] The sum of card points across all players in a deal equals exactly 120

**Bidding**

- [ ] The first bidder is required to declare at least 100
- [ ] Bids are multiples of the bidding step
- [ ] The ceiling without a marriage is 120, with marriages `120 + sum of values`
- [ ] The ceiling is checked on the server against the real hand, not the client's claim
- [ ] The ceiling is computed from the hand **before** the widow
- [ ] A player who has passed does not return to the bidding
- [ ] After the widow the declarer may raise the bid, but bidding does not resume
- [ ] The declarer gives exactly one card to each opponent

**Marriages and trump**

- [ ] A marriage is declared only on one's own lead, not when following
- [ ] Both cards of the marriage are checked in hand **before** the played card is removed
- [ ] The declarer must lead with the king or the queen of that suit
- [ ] Marriage points go to the player who declared it, even if an opponent took the trick
- [ ] A marriage cannot be declared in the first trick of a deal
- [ ] Leading with a marriage card without declaring is allowed and scores nothing
- [ ] Defenders' marriages count on a par with the declarer's
- [ ] Trump is a mutable part of the deal state, not a constant
- [ ] The deal begins with no trump
- [ ] A change of trump does not re-evaluate tricks already played
- [ ] The trick in which a marriage is declared is already played under the new trump

**Play**

- [ ] The declarer leads first, after that the winner of the previous trick
- [ ] The obligation to beat is computed from the highest card of the suit on the table
- [ ] The obligation to trump applies only when a trump has been set
- [ ] Holding the led suit, a player plays it even if a trump would be stronger
- [ ] A trump must beat a trump, if able
- [ ] The trick is taken by the highest trump, otherwise the highest card of the led suit
- [ ] An off-suit discard does not win the trick, but its points go to the winner
- [ ] In the two-handed draw variant the restrictions switch on once the stock is exhausted

**Scoring**

- [ ] On success the declarer records the bid, not what was scored
- [ ] The declarer's points are not rounded, neither when checking nor when recording
- [ ] Defenders' rounding is applied to the deal total, not to each trick
- [ ] On a concession the defenders receive half the bid
- [ ] A bolt is zero **tricks**, not zero points
- [ ] The declarer can receive both a bolt and a minus for a failed bid at the same time

**The finish**

- [ ] At 880+ the score is fixed at exactly 880
- [ ] On the barrel no defending points are awarded
- [ ] An attempt on the barrel is used up by any deal, not only by one's own bid
- [ ] A failed bid on the barrel drops the score immediately
- [ ] Conceding on the barrel is forbidden
- [ ] Victory comes only through one's own made bid
- [ ] The dump truck checks exact equality with 555, not exceeding it
