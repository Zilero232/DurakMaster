export const EMOJI_COOLDOWN_MS = 2500;

export const EMOJI_TABS = ['emoji', 'phrase'] as const;

export type EmojiTab = (typeof EMOJI_TABS)[number];

export const TAUNT_TILE_SIZE = 48;
