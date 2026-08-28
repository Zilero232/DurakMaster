import type { TysyachaAction, TysyachaState } from '@durak-master/schemas';

import { decideBotAction } from './decide-action';

export function decideTimeoutAction(state: TysyachaState, userId: string): TysyachaAction {
  return decideBotAction(state, userId);
}
