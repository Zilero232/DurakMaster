import type { BurkozelAction, BurkozelState } from '@durak-master/schemas';

/**
 * What a player who ran out of time plays. There is no pass in burkozel — the
 * turn has to produce cards — so it throws the first ones off the top of the hand.
 */
export function decideTimeoutAction(state: BurkozelState, userId: string): BurkozelAction {
  const hand = state.hands[userId] ?? [];
  const required =
    state.trick.length === 0 ? 1 : Math.min(state.trick[0]?.cards.length ?? 1, hand.length);

  return { type: 'play', cards: hand.slice(0, Math.max(required, 1)) };
}
