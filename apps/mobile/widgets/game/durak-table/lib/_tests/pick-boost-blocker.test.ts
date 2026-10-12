import { BOOST_PRICE } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { pickBoostBlocker } from '../pick-boost-blocker';

describe('pickBoostBlocker', () => {
  it('lets a boost through when it is affordable', () => {
    expect(
      pickBoostBlocker({ boost: 'peekTalon', coins: BOOST_PRICE.peekTalon, canUndo: false })
    ).toBeNull();
  });

  it('blocks a boost the player cannot afford', () => {
    expect(
      pickBoostBlocker({ boost: 'peekHand', coins: BOOST_PRICE.peekHand - 1, canUndo: true })
    ).toBe('notEnoughCoins');
  });

  it('blocks undo when there is no move of the player to take back', () => {
    expect(
      pickBoostBlocker({ boost: 'undoMove', coins: BOOST_PRICE.undoMove, canUndo: false })
    ).toBe('nothingToUndo');
  });

  it('allows undo when the last unanswered card is their own', () => {
    expect(
      pickBoostBlocker({ boost: 'undoMove', coins: BOOST_PRICE.undoMove, canUndo: true })
    ).toBeNull();
  });
});
