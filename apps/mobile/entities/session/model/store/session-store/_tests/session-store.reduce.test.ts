import { describe, expect, it } from 'vitest';

import type { GameOutcome } from '../session-store.types';

import { INITIAL_STATE } from '../session-store.config';
import { reduceServerMessage } from '../session-store.reduce';

const OUTCOME: GameOutcome = {
  loserUserId: 'a',
  isDraw: false,
  creditsDelta: -100,
  ratingDelta: 0
};

describe('session store reducer', () => {
  it('keeps the result on screen when the surrender drops the player from the table', () => {
    const finished = reduceServerMessage(INITIAL_STATE, {
      type: 'game:finished',
      payload: OUTCOME
    });

    const afterFinish = { ...INITIAL_STATE, ...finished };

    const left = reduceServerMessage(afterFinish, { type: 'table:left' });

    expect({ ...afterFinish, ...left }).toMatchObject({ currentTable: null, outcome: OUTCOME });
  });
});
