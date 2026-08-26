import type { BurkozelState, BurkozelView, BurkozelVisiblePlay } from '@durak-master/schemas';

import { setPoints } from './rules';

function visibleTrick(state: BurkozelState): BurkozelVisiblePlay[] {
  return state.trick.map((play) => ({
    seat: play.seat,
    cards: play.isFaceUp ? play.cards : null,
    cardCount: play.cards.length,
    isFaceUp: play.isFaceUp
  }));
}

export function toPlayerView(state: BurkozelState, userId: string): BurkozelView {
  const { hands: _hands, talon: _talon, wonCards: _wonCards, trick: _trick, ...rest } = state;

  return {
    ...rest,
    hand: state.hands[userId] ?? [],
    talonCount: state.talon.length,
    myPoints: setPoints(state.wonCards[userId] ?? []),
    trick: visibleTrick(state)
  };
}

export function toSpectatorView(state: BurkozelState): BurkozelView {
  const { hands: _hands, talon: _talon, wonCards: _wonCards, trick: _trick, ...rest } = state;

  return {
    ...rest,
    hand: [],
    talonCount: state.talon.length,
    myPoints: 0,
    trick: visibleTrick(state)
  };
}
