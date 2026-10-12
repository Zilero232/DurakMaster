import { match } from 'ts-pattern';

import type { Outcome } from '../config';
import type { PickOutcomeInput } from './pick-outcome.types';

import { OUTCOMES } from '../config';

export const pickOutcome = ({ isDraw, isLoser, reason }: PickOutcomeInput): Outcome =>
  match({ isDraw, isLoser, reason })
    .with({ isDraw: true }, () => OUTCOMES.draw)
    .with({ isLoser: true, reason: 'timeout' }, () => OUTCOMES.loseByTimeout)
    .with({ isLoser: true, reason: 'left' }, () => OUTCOMES.loseByLeaving)
    .with({ isLoser: true }, () => OUTCOMES.lose)
    .otherwise(() => OUTCOMES.win);
