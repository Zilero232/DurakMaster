import type { SoundName } from '@/shared/lib/sound';

export type TableSnapshot = {
  tableSize: number;
  handSize: number;
  beaten: number;
  discardCount: number;
};

export type PickTableSoundInput = {
  current: TableSnapshot;
  previous: TableSnapshot;
};

export type TableSoundCue = {
  sound: SoundName;

  /** A deal plays once per card that arrived, so it reads as a hand being dealt. */
  repeat: number;
};
