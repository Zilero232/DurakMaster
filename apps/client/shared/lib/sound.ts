'use client';

import { clamp } from 'remeda';

/**
 * Звук стола.
 *
 * Синтезируем через Web Audio вместо готовых файлов: набор звуков крошечный,
 * а так не нужны ассеты, лицензии и лишний трафик.
 *
 * Ключевое для правдоподобия — ШУМ. Карта по сукну это удар с широким
 * спектром, а не тон: чистая синусоида звучит как пищалка из будильника.
 * Поэтому основа большинства звуков — отфильтрованный белый шум с быстрой
 * атакой и коротким спадом, а тональные компоненты только подкрашивают.
 *
 * ВАЖНО про WebView: Android WebView и iOS WKWebView не дают воспроизводить
 * звук до реального жеста пользователя, и обойти это библиотеками нельзя.
 * Поэтому контекст создаётся лениво — при первом клике, — а до этого молчим.
 */

type SoundName =
  | 'deal'
  | 'play'
  | 'beat'
  | 'take'
  | 'pass'
  | 'shuffle'
  | 'win'
  | 'lose'
  | 'turn'
  | 'click'
  | 'error';

let context: AudioContext | null = null;
let masterGain: GainNode | null = null;
/** Общая громкость 0..1. Ноль — полная тишина. */
let volume = 0.7;
let noiseBuffer: AudioBuffer | null = null;

const ensureContext = (): AudioContext | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!context) {
    const Ctor =
      window.AudioContext ??
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!Ctor) {
      return null;
    }

    context = new Ctor();
    masterGain = context.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(context.destination);
  }

  // После возврата из фона контекст остаётся suspended — будим его.
  if (context.state === 'suspended') {
    void context.resume();
  }

  return context;
};

/**
 * Буфер белого шума на две секунды — переиспользуется всеми звуками.
 * Генерировать его на каждый удар слишком дорого при быстрой раздаче.
 */
const ensureNoise = (ctx: AudioContext): AudioBuffer => {
  if (noiseBuffer) {
    return noiseBuffer;
  }

  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  noiseBuffer = buffer;

  return buffer;
};

/** Небольшой разброс, чтобы серия одинаковых ходов не звучала механически. */
const vary = (value: number, amount = 0.12) => value * (1 + (Math.random() * 2 - 1) * amount);

type NoiseOptions = {
  /** Длительность звука в секундах. */
  duration: number;
  /** Центр полосового фильтра — «материал» удара. */
  frequency: number;
  /** Добротность: выше — звонче и уже полоса. */
  q?: number;
  volume?: number;
  /** Сдвиг частоты фильтра к концу — эффект скольжения. */
  sweepTo?: number;
  type?: BiquadFilterType;
};

/** Шумовой удар — основа всех «карточных» звуков. */
const playNoise = ({
  duration,
  frequency,
  q = 1,
  volume: level = 0.3,
  sweepTo,
  type = 'bandpass',
}: NoiseOptions) => {
  const ctx = ensureContext();

  if (!ctx || !masterGain || volume === 0) {
    return;
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const now = ctx.currentTime;

  source.buffer = ensureNoise(ctx);
  // Случайное смещение по буферу: одинаковый участок шума узнаётся на слух.
  const offset = Math.random() * 1.5;

  filter.type = type;
  filter.frequency.setValueAtTime(frequency, now);
  filter.Q.value = q;

  if (sweepTo !== undefined) {
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, sweepTo), now + duration);
  }

  // Мгновенная атака и экспоненциальный спад — так звучит удар.
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(level, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  source.start(now, offset, duration + 0.05);
  source.stop(now + duration + 0.05);
};

type ToneOptions = {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  sweepTo?: number;
  delay?: number;
};

/** Тональная составляющая — для фанфар и сигналов, не для ударов. */
const playTone = ({
  frequency,
  duration,
  type = 'sine',
  volume: level = 0.15,
  sweepTo,
  delay = 0,
}: ToneOptions) => {
  const ctx = ensureContext();

  if (!ctx || !masterGain || volume === 0) {
    return;
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime + delay;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);

  if (sweepTo !== undefined) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, sweepTo), start + duration);
  }

  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(level, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(masterGain);

  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
};

const SOUNDS: Record<SoundName, () => void> = {
  /** Карта скользит из колоды — короткий высокий шелест. */
  deal: () =>
    playNoise({ duration: 0.1, frequency: vary(2600), q: 0.8, volume: 0.16, sweepTo: 1400 }),

  /** Карта легла на сукно: глухой шлепок с призвуком бумаги. */
  play: () => {
    playNoise({ duration: 0.12, frequency: vary(900), q: 0.6, volume: 0.34, sweepTo: 320 });
    playTone({ frequency: vary(150), duration: 0.07, type: 'triangle', volume: 0.1 });
  },

  /** Отбились — тот же шлепок, но с ясным высоким акцентом сверху. */
  beat: () => {
    playNoise({ duration: 0.1, frequency: vary(1500), q: 0.9, volume: 0.28, sweepTo: 600 });
    playTone({ frequency: vary(660), duration: 0.09, type: 'triangle', volume: 0.09 });
  },

  /** Забираю карты — низкий протяжный скреб со стола. */
  take: () => {
    playNoise({ duration: 0.34, frequency: 1500, q: 0.5, volume: 0.24, sweepTo: 180 });
    playTone({ frequency: 200, duration: 0.28, type: 'sawtooth', volume: 0.06, sweepTo: 90 });
  },

  /** «Бито» — карты сметаются в отбой. */
  pass: () => {
    playNoise({ duration: 0.24, frequency: 1100, q: 0.4, volume: 0.24, sweepTo: 2600 });
  },

  /** Тасовка перед раздачей — серия быстрых шелестов. */
  shuffle: () => {
    for (let i = 0; i < 5; i++) {
      window.setTimeout(
        () => playNoise({ duration: 0.07, frequency: vary(2200), q: 0.7, volume: 0.13 }),
        i * 55,
      );
    }
  },

  /** Победа — восходящее трезвучие. */
  win: () => {
    playTone({ frequency: 523.25, duration: 0.2, type: 'triangle', volume: 0.16 });
    playTone({ frequency: 659.25, duration: 0.2, type: 'triangle', volume: 0.16, delay: 0.11 });
    playTone({ frequency: 783.99, duration: 0.44, type: 'triangle', volume: 0.18, delay: 0.22 });
    playTone({ frequency: 1046.5, duration: 0.44, type: 'sine', volume: 0.09, delay: 0.22 });
  },

  /** Поражение — нисходящая малая секунда, звучит «подавленно». */
  lose: () => {
    playTone({ frequency: 392, duration: 0.26, type: 'triangle', volume: 0.14 });
    playTone({ frequency: 311.13, duration: 0.5, type: 'triangle', volume: 0.14, delay: 0.16 });
  },

  /** Твой ход — мягкий двойной сигнал, не сирена. */
  turn: () => {
    playTone({ frequency: 880, duration: 0.09, type: 'sine', volume: 0.1 });
    playTone({ frequency: 1174.66, duration: 0.12, type: 'sine', volume: 0.09, delay: 0.09 });
  },

  /** Нажатие в интерфейсе — сухой щелчок. */
  click: () => playNoise({ duration: 0.03, frequency: 2400, q: 1.6, volume: 0.12 }),

  /** Недопустимое действие — короткий низкий отказ. */
  error: () => {
    playTone({ frequency: 220, duration: 0.14, type: 'square', volume: 0.07, sweepTo: 150 });
  },
};

export const playSound = (name: SoundName) => {
  SOUNDS[name]?.();
};

/** Громкость 0..1. Хранение — на стороне стора настроек. */
export const setVolume = (value: number) => {
  volume = clamp(value, { min: 0, max: 1 });

  if (masterGain && context) {
    // Плавно, иначе на резком изменении слышен щелчок.
    masterGain.gain.setTargetAtTime(volume, context.currentTime, 0.02);
  }
};
