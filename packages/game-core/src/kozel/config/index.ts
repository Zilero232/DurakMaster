import type { Card, Suit } from '@durak-master/schemas';

/** Kozel is played four-handed and only four-handed: two partnerships, no talon. */
export const KOZEL_SEATS = 4;

/** The lowest trump. Its holder opens the very first deal of a game. */
export const LOWEST_TRUMP: Card = { rank: 'eight', suit: 'clubs' };

/** Clubs are missing on purpose: the whole suit plays as trump. */
export const PLAIN_SUITS: Suit[] = ['spades', 'hearts', 'diamonds'];

/** A team escapes a double loss by reaching this many points ("spas"). */
export const SPAS_POINTS = 31;

/** From here up the winner takes two pairs instead of one. */
export const DOUBLE_WIN_POINTS = 90;

/** An exact half of the deck for each team — the deal pays nobody. */
export const EGGS_POINTS = 60;
