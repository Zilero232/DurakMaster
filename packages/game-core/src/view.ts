import type { GameState, PlayerView } from '@durak-master/schemas';

export function toPlayerView(state: GameState, userId: string): PlayerView {
  const { hands, talon, discard, ...rest } = state;

  return {
    ...rest,
    hand: hands[userId] ?? [],
    talonCount: talon.length,
    discardCount: discard.length,
    discardPile: discard
  };
}

export function toSpectatorView(state: GameState): PlayerView {
  const { hands: _hands, talon, discard, ...rest } = state;

  return {
    ...rest,
    hand: [],
    talonCount: talon.length,
    discardCount: discard.length,
    discardPile: discard
  };
}
