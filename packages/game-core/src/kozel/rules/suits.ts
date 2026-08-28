import type { Card, Suit } from '@durak-master/schemas';

/**
 * The suit a card plays as. Queens, jacks and every club belong to the trump
 * group, not to the suit painted on them: the queen of diamonds is a trump and
 * does not answer a diamond lead, and a hand whose only "diamond" is that queen
 * holds no diamonds at all.
 *
 * Reading `card.suit` directly in a follow-suit check is the single most common
 * bug in implementations of this game.
 */
export const effectiveSuit = (card: Card): 'trump' | Suit =>
  card.rank === 'queen' || card.rank === 'jack' || card.suit === 'clubs' ? 'trump' : card.suit;

export const isTrump = (card: Card): boolean => effectiveSuit(card) === 'trump';
