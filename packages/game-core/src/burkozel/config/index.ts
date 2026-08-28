import type { Card } from '@durak-master/schemas';

/**
 * The shokha — the six of spades — beats everything and is beaten by nothing.
 * It is off the rank order entirely, so it is matched by identity rather than
 * by strength. Only in play when the rules turn it on.
 */
export const SHOKHA: Card = { rank: 'six', suit: 'spades' };
