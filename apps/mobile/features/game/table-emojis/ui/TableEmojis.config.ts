export const TABLE_EMOJIS = [
  '😂',
  '🤡',
  '🐢',
  '💀',
  '🥱',
  '🤏',
  '🍿',
  '🫡',
  '🔥',
  '💪',
  '🤝',
  '😭'
] as const;

export type TableEmoji = (typeof TABLE_EMOJIS)[number];

export const EMOJI_COOLDOWN_MS = 2500;
