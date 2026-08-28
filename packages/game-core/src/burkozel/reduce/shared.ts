import type { GameErrorCode } from '@durak-master/schemas';

import type { ReduceResult } from '../../module';

export type BurkozelReduceResult = ReduceResult<'burkozel'>;

export const fail = (error: GameErrorCode): BurkozelReduceResult => ({ ok: false, error });
