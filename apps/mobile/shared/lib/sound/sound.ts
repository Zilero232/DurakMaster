import type { AudioPlayer } from 'expo-audio';

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';
import { clamp } from 'remeda';

import type { SoundName } from './sound-assets';

import { SOUND_SOURCES } from './sound-assets';

let volume = 0.7;

const players = new Map<SoundName, AudioPlayer[]>();

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

const getPlayers = (name: SoundName): AudioPlayer[] => {
  const existing = players.get(name);

  if (existing) {
    return existing;
  }

  const created = SOUND_SOURCES[name].map((source) => {
    const player = createAudioPlayer(source);

    player.volume = volume;

    return player;
  });

  players.set(name, created);

  return created;
};

const isWeb = Platform.OS === 'web';

let isUnlocked = !isWeb;

export const unlockSound = () => {
  isUnlocked = true;
};

export const playSound = (name: SoundName) => {
  if (volume === 0 || !isUnlocked) {
    return;
  }

  ensureAudioMode();

  const variants = getPlayers(name);
  const player = variants[Math.floor(Math.random() * variants.length)];

  if (!player) {
    return;
  }

  try {
    void player.seekTo(0);

    const result: unknown = player.play();

    if (result instanceof Promise) {
      void result.catch(() => {});
    }
  } catch {}
};

export const setVolume = (value: number) => {
  volume = clamp(value, { min: 0, max: 1 });

  for (const variants of players.values()) {
    for (const player of variants) {
      player.volume = volume;
    }
  }
};

export type { SoundName };
