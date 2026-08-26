# Durak rules — formalized for implementation

Source of truth for `packages/game-core`. The wording is chosen so that it can be
carried into code without guesswork. Wherever sources disagree, this is stated
explicitly along with the option that was chosen.

Primary sources: [Pagat — Podkidnoy Durak](https://www.pagat.com/beating/podkidnoy_durak.html),
[Pagat — Perevodnoy Durak](https://www.pagat.com/beating/perevodnoy_durak.html),
[Wikipedia](https://ru.wikipedia.org/wiki/Дурак_(карточная_игра)), minigames.mail.ru, durakgames.ru.

---

## 1. Deck and deal

The deck is 24 (9..A), 36 (6..A) or 52 (2..A) cards, four suits.
Ranks in ascending order of strength: `2 3 4 5 6 7 8 9 10 J Q K A`.

**Compare ranks only by position in this list.** Comparing strings or face
values is a source of bugs.

Each player is dealt **6 cards** regardless of deck size. The next card is turned
face up and placed crosswise under the bottom of the deck — its suit is trump for
the whole deal.

> **Pitfall.** The trump card under the deck is **part of the deck** and is taken
> last when drawing. Treating it as a separate entity is wrong.

## 2. First move

The first to attack is the holder of the **lowest trump**. If nobody has a trump
(possible with a 24-card deck and few players) — the holder of the lowest card
overall.

In subsequent deals the first to attack is the player to the left of whoever lost
the previous deal.

The defender is the player to the left of the attacker (clockwise).

## 3. Defence

A card can be beaten with:
- a card of the same suit and a **higher** rank;
- any trump, if the attacking card is not a trump.

**A trump is beaten only by a higher trump.** Suits do not interact with one another.

## 4. Throwing in

After the first card, everyone except the defender may throw in. Priority belongs
to the main attacker; the others join in clockwise.

**Rank restriction:** you may throw in only a card whose rank is **already on the
table** — either among the attacking cards **or among the cards the defender beat
with**.

> **Pitfall.** The defender's cards also open their ranks for throwing in.
> This rule is implemented incorrectly more often than any other.

**Count restriction:** the number of **attacking** cards in the bout (defence cards
do not count) is at most `min(6, cards in the defender's hand AT THE START of the bout)`.

> **Pitfall.** The limit is fixed at the start of the bout and is not recomputed.
> During the defence the hand shrinks, and recomputing from the current hand will
> wrongly block legal throw-ins.

> **Sources disagree.** Pagat and minigames.mail.ru mention the rule "the first
> bout is limited to five cards". Most Russian online implementations do not apply
> it. **Chosen:** the `min(6, hand)` rule is sufficient; there is no separate
> first-bout rule.

## 5. Ending the bout

**Successful defence** — all cards are beaten and nobody throws in any more.
All cards from the table go to the discard pile, out of the game for good. The
defender becomes the next attacker.

**Taking** — the defender cannot or does not want to defend. They take **all**
cards from the table, including their own defence cards.

> **Pitfall.** Taking is not instantaneous: while the defender is taking, the
> others may keep throwing in within the same limit.

After a take, the turn passes to the player **to the left of the defender** — the
defender themselves skips the attack.

## 6. Drawing

After each bout, players draw up to 6 cards in strict order:
main attacker → the other attackers clockwise → **defender last**.

> **Pitfall.** The draw order matters when the deck holds fewer cards than needed:
> it determines who gets the last (trump) card.

When the deck is empty, there is no drawing.

## 7. End of the deal

A player left with no cards while the deck is empty **leaves the game and is safe**.
They cannot attack, defend or throw in.

The loser (the **durak**, the fool) is the last player still holding cards. There
is always exactly one loser.

**Draw** — the deck is empty and at the end of a bout nobody has cards left. The
typical case: the defender beat everything with their last cards, and the attacker
also emptied their hand. Check only at the end of a bout, not mid-bout. A draw is
a table setting (`allowDraw`).

**With `allowDraw: false`** the same position must still produce a loser, because
"there is always exactly one loser" holds. The loser is the **defender of that
last bout**: they were the last to be under attack. Sources do not cover this
case — the rule is chosen so that the outcome is never empty.

> **Pitfall.** Ending the deal with `isDraw: false` and `loserUserId: null` is a
> dead state: nobody won, nobody lost, and the score has nothing to record.

---

## 8. Transfer Durak

Instead of defending, a player may **transfer** the attack: add a card of the same
rank, becoming an attacker, and pass the attack on to the next player clockwise.

Conditions:
1. **No card has been beaten yet.** Once a player has started defending, they lose
   the right to transfer in that bout.
2. All cards on the table are **of the same rank**, and the added card is of that
   same rank.
3. With several cards of the same rank, the transfer is made by adding **one**
   card, not one per card on the table.
4. **Sufficiency rule:** you may not transfer in a way that leaves the new defender
   without enough cards to defend. Formally: `cards on the table after the transfer
   ≤ hand size of the new defender`.

> **Pitfall.** Item 4 is the classic source of unplayable positions. Check it at
> action validation time.

Transfers can continue in a chain — each new defender is entitled to transfer further.

> **Sources disagree.** Some Russian sources limit the chain to three transfers.
> Pagat introduces no limits beyond the 6-card cap.
> **Chosen:** only the `min(6, hand)` limits and the sufficiency rule.

**Transfer by showing a trump** is a sub-variant: if the defender holds a **trump**
of the same rank, they may transfer by **showing** it and keeping it in hand.
Russian sources add: only once per deal, after which the card must be laid down.
A separate table setting (`allowTransferByShowingTrump`), off by default.

---

## 9. Table settings

Confirmed for RstGames: deck of 24/36/52, 2–6 players, throw-in/transfer Durak,
draw on/off, private tables with a password, "with cheats" mode.

Found in the genre but not confirmed for RstGames: play with epaulettes, 2×2 team
play, open cards, choice of the first-move rule.

"View the discard pile" in RstGames is a paid action costing coins, not a table
setting.

---

## 10. Checklist of typical bugs

- [ ] Ranks are compared by position in the list, not as strings
- [ ] The trump card under the deck is drawn last
- [ ] Defence cards open ranks for throwing in
- [ ] The attack limit is fixed at the start of the bout and is not recomputed
- [ ] The limit counts only attacking cards
- [ ] Draw order: attacker → throwers-in → defender
- [ ] After a take, the turn goes to the player **after** the defender
- [ ] Throwing in is still allowed while the defender is taking
- [ ] Transfer is forbidden after the first beaten card
- [ ] Transfer is checked for card sufficiency in the new defender's hand
- [ ] A draw is checked only at the end of a bout
- [ ] A player who has run out of cards leaves only when the deck is empty
