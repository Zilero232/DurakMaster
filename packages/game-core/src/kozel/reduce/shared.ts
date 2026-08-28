import type { GameErrorCode } from '@durak-master/schemas';

import type { ReduceResult } from '../../module';

export type KozelReduceResult = ReduceResult<'kozel'>;

export const fail = (error: GameErrorCode): KozelReduceResult => ({ ok: false, error });
