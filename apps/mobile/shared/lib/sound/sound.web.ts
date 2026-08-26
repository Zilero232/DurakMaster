import { clamp, sample } from 'remeda';

import type { SoundName } from './sound-assets';

import { SOUND_SOURCES } from './sound-assets';

let volume = 0.7;

const elements = new Map<SoundName, HTMLAudioElement[]>();

const resolveUri = (source: number | string): string =>
  typeof source === 'string' ? source : ((source as unknown as { uri?: string }).uri ?? '');

const getElements = (name: SoundName): HTMLAudioElement[] => {
  const existing = elements.get(name);

  if (existing) {
    return existing;
  }

  const created = SOUND_SOURCES[name].map((source) => {
    const audio = new Audio(resolveUri(source));

    audio.volume = volume;
    audio.preload = 'auto';

    return audio;
  });

  elements.set(name, created);

  return created;
};

export const unlockSound = () => {};

export const playSound = (name: SoundName) => {
  if (volume === 0) {
    return;
  }

  const variants = getElements(name);
  const [audio] = sample(variants, 1);

  if (!audio) {
    return;
  }

  audio.currentTime = 0;

  void audio.play().catch(() => {});
};

export const setVolume = (value: number) => {
  volume = clamp(value, { min: 0, max: 1 });

  for (const variants of elements.values()) {
    for (const audio of variants) {
      audio.volume = volume;
    }
  }
};
