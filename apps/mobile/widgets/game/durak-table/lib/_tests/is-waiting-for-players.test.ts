import type { PlayerView } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { isWaitingForPlayers } from '../is-waiting-for-players';

const viewWith = (phase: PlayerView['phase']) => ({ phase }) as PlayerView;

describe('isWaitingForPlayers', () => {
  it('waits while there is no view yet', () => {
    expect(isWaitingForPlayers({ status: 'playing' }, null)).toBe(true);
  });

  it('waits before the first deal', () => {
    expect(isWaitingForPlayers({ status: 'waiting' }, viewWith('waiting'))).toBe(true);
  });

  it('does not wait during a deal', () => {
    expect(isWaitingForPlayers({ status: 'playing' }, viewWith('playing'))).toBe(false);
  });

  it('waits again once the deal is finished', () => {
    expect(isWaitingForPlayers({ status: 'playing' }, viewWith('finished'))).toBe(true);
  });

  it('waits when the room reopened but the finished view is still cached', () => {
    expect(isWaitingForPlayers({ status: 'waiting' }, viewWith('finished'))).toBe(true);
  });

  it('waits when the room reopened before the next view arrives', () => {
    expect(isWaitingForPlayers({ status: 'waiting' }, viewWith('playing'))).toBe(true);
  });
});
