import type { HapticKind } from '@/shared/lib/haptics';
import type { SoundName } from '@/shared/lib/sound';

import { SLIDE_MS } from '@/entities/game-table';

import type { TableSnapshot } from '../../../lib';

export const CARD_LANDING_MS = Math.round(SLIDE_MS * 0.45);

export const LANDING_SOUNDS: ReadonlySet<SoundName> = new Set(['beat', 'play']);

export const BEFORE_DEAL: TableSnapshot = { tableSize: 0, handSize: 0, beaten: 0, discardCount: 0 };

export const SOUND_HAPTIC: Record<SoundName, HapticKind> = {
  beat: 'beat',
  chat: 'tap',
  click: 'tap',
  deal: 'tap',
  error: 'error',
  invite: 'tap',
  join: 'tap',
  lose: 'lose',
  pass: 'play',
  play: 'play',
  ready: 'tap',
  shuffle: 'play',
  take: 'take',
  turn: 'tap',
  win: 'win'
};
