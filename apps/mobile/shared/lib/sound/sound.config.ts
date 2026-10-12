import type { SoundName } from './sound-assets';

export const DEFAULT_VOLUME = 0.7;

export const OVERLAPPING_SOUNDS: ReadonlySet<SoundName> = new Set(['beat', 'deal', 'play']);

export const OVERLAP_VOICES = 2;
