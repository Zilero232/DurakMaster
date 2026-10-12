import type { AudioPlayer } from 'expo-audio';

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { clamp, sample } from 'remeda';

import type { SoundName, SoundVariant } from './sound-assets';

import { SOUND_VARIANTS } from './sound-assets';
import { DEFAULT_VOLUME, OVERLAP_VOICES, OVERLAPPING_SOUNDS } from './sound.config';

type Voices = {
  players: AudioPlayer[];
  next: number;
};

let volume = DEFAULT_VOLUME;

const voices = new Map<string, Voices>();

const createVoice = (source: number): AudioPlayer => {
  const player = createAudioPlayer(source);

  player.volume = volume;

  player.addListener('playbackStatusUpdate', (status) => {
    if (status.didJustFinish) {
      player.pause();
      void player.seekTo(0).catch(() => {});
    }
  });

  return player;
};

const loadVariant = (name: SoundName, { key, source }: SoundVariant) => {
  if (voices.has(key)) {
    return;
  }

  const count = OVERLAPPING_SOUNDS.has(name) ? OVERLAP_VOICES : 1;

  voices.set(key, { players: Array.from({ length: count }, () => createVoice(source)), next: 0 });
};

export const preloadSounds = () => {
  void setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'mixWithOthers',
    shouldPlayInBackground: false
  }).catch(() => {});

  for (const [name, variants] of Object.entries(SOUND_VARIANTS)) {
    for (const variant of variants) {
      loadVariant(name as SoundName, variant);
    }
  }
};

const restart = (player: AudioPlayer) => {
  if (!player.playing) {
    player.play();

    return;
  }

  void player
    .seekTo(0)
    .then(() => player.play())
    .catch(() => {});
};

export const playSound = (name: SoundName) => {
  if (volume === 0) {
    return;
  }

  const [variant] = sample(SOUND_VARIANTS[name], 1);

  if (!variant) {
    return;
  }

  loadVariant(name, variant);

  const pool = voices.get(variant.key);
  const player = pool?.players[pool.next];

  if (!pool || !player) {
    return;
  }

  pool.next = (pool.next + 1) % pool.players.length;

  try {
    restart(player);
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
