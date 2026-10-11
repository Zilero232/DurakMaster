import type { AudioPlayer } from 'expo-audio';

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { clamp, sample } from 'remeda';

import type { SoundName, SoundVariant } from './sound-assets';

import { SOUND_VARIANTS } from './sound-assets';
import { DEFAULT_VOLUME, VOICES_PER_SOUND } from './sound.config';

type Voices = {
  players: AudioPlayer[];
  next: number;
};

let volume = DEFAULT_VOLUME;

const voices = new Map<string, Voices>();

let isAudioModeReady = false;

const ensureAudioMode = () => {
  if (isAudioModeReady) {
    return;
  }

  isAudioModeReady = true;

  void setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'mixWithOthers',
    shouldPlayInBackground: false
  }).catch(() => {});
};

const getVoices = ({ key, source }: SoundVariant): Voices => {
  const existing = voices.get(key);

  if (existing) {
    return existing;
  }

  const created: Voices = {
    players: Array.from({ length: VOICES_PER_SOUND }, () => {
      const player = createAudioPlayer(source);

      player.volume = volume;

      return player;
    }),
    next: 0
  };

  voices.set(key, created);

  return created;
};

export const playSound = (name: SoundName) => {
  if (volume === 0) {
    return;
  }

  ensureAudioMode();

  const [variant] = sample(SOUND_VARIANTS[name], 1);

  if (!variant) {
    return;
  }

  const pool = getVoices(variant);
  const player = pool.players[pool.next];

  pool.next = (pool.next + 1) % pool.players.length;

  if (!player) {
    return;
  }

  try {
    player.seekTo(0);
    player.play();
  } catch {}
};

export const setVolume = (value: number) => {
  volume = clamp(value, { min: 0, max: 1 });

  for (const pool of voices.values()) {
    for (const player of pool.players) {
      player.volume = volume;
    }
  }
};

export type { SoundName };
