import type { PlayerView } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { isWaitingForPlayers } from '../is-waiting-for-players';

const viewWith = (phase: PlayerView['phase']) => ({ phase }) as PlayerView;

describe('isWaitingForPlayers', () => {
  it('waits while there is no view yet', () => {
    expect(isWaitingForPlayers({ table: { status: 'playing' }, view: null })).toBe(true);
  });

  it('waits before the first deal', () => {
    expect(isWaitingForPlayers({ table: { status: 'waiting' }, view: viewWith('waiting') })).toBe(
      true
    );
  });

  it('does not wait during a deal', () => {
    expect(isWaitingForPlayers({ table: { status: 'playing' }, view: viewWith('playing') })).toBe(
      false
    );
  });

  it('waits again once the deal is finished', () => {
    expect(isWaitingForPlayers({ table: { status: 'playing' }, view: viewWith('finished') })).toBe(
      true
    );
  });

  it('waits when the room reopened but the finished view is still cached', () => {
    expect(isWaitingForPlayers({ table: { status: 'waiting' }, view: viewWith('finished') })).toBe(
      true
    );
  });

  it('waits when the room reopened before the next view arrives', () => {
    expect(isWaitingForPlayers({ table: { status: 'waiting' }, view: viewWith('playing') })).toBe(
      true
    );
  });
});
