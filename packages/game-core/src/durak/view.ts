import type { DurakState, DurakView } from '@durak-master/schemas';

export function toPlayerView(state: DurakState, userId: string): DurakView {
  const { hands, talon, discard, ...rest } = state;

  return {
    ...rest,
    hand: hands[userId] ?? [],
    talonCount: talon.length,
    discardCount: discard.length,
    discardPile: discard
  };
}

export function toSpectatorView(state: DurakState): DurakView {
  const { hands: _hands, talon, discard, ...rest } = state;

  return {
    ...rest,
    hand: [],
    talonCount: talon.length,
    discardCount: discard.length,
    discardPile: discard
  };
}
