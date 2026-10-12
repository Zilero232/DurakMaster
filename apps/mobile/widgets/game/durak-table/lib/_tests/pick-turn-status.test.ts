import { describe, expect, it } from 'vitest';

import { pickTurnStatus } from '../pick-turn-status';

const players = [
  { seat: 0, name: 'Me' },
  { seat: 1, name: 'Anna' },
  { seat: 2, name: 'Boris' }
];

const base = { activeSeat: 1, defenderSeat: 2, mySeat: 0, players, isWaiting: false };

describe('pickTurnStatus', () => {
  it('says nothing while the table waits for players', () => {
    expect(pickTurnStatus({ ...base, isWaiting: true })).toBeNull();
  });

  it('tells the player it is their move', () => {
    expect(pickTurnStatus({ ...base, activeSeat: 0 })).toEqual({ kind: 'mine' });
  });

  it('names the defender while they defend', () => {
    expect(pickTurnStatus({ ...base, activeSeat: 2 })).toEqual({ kind: 'defends', name: 'Boris' });
  });

  it('names whoever attacks or throws in', () => {
    expect(pickTurnStatus(base)).toEqual({ kind: 'moves', name: 'Anna' });
  });
});
