import type { KozelAction, KozelState } from '@durak-master/schemas';

import type { KozelReduceResult } from './shared';

import { chooseLeader } from './choose-leader';
import { playCard } from './play';
import { fail } from './shared';

export type { KozelReduceResult } from './shared';

export function reduce(state: KozelState, userId: string, action: KozelAction): KozelReduceResult {
  switch (action.type) {
    case 'play': {
      return playCard(state, userId, action.card);
    }

    case 'chooseLeader': {
      return chooseLeader(state, userId, action.seat);
    }

    default: {
      // `exchangeLastTrump` needs the rule enabled; it is off by default and the
      // sources describe it too loosely to run without one.
      return fail('INVALID_ACTION_FOR_PHASE');
    }
  }
}
