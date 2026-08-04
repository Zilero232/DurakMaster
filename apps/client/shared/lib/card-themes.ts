import type { Card, Rank, Suit } from '@durak-master/schemas';

/**
 * Имена файлов колоды. Числовые ранги в файлах записаны цифрами,
 * фигурные — английскими словами, как в исходной раскладке Wikimedia.
 */
const RANK_FILE: Record<Rank, string> = {
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  jack: 'jack',
  queen: 'queen',
  king: 'king',
  ace: 'ace',
};

export const CARD_BACKS = ['blue', 'green'] as const;
export type CardBack = (typeof CARD_BACKS)[number];

/**
 * Лицевые стороны у всех тем одни и те же — перекрашиваются CSS-фильтром.
 * Рисовать 36 карт в четырёх вариантах ради смены оттенка расточительно:
 * фильтр даёт тот же результат без лишних килобайт в бандле.
 */
export const CARD_THEMES = [
  {
    id: 'classic',
    back: 'blue',
    filter: null,
    accent: 'var(--gold)',
  },
  {
    id: 'emerald',
    back: 'green',
    filter: 'hue-rotate(96deg) saturate(1.05)',
    accent: 'oklch(0.78 0.15 156)',
  },
  {
    id: 'crimson',
    back: 'blue',
    filter: 'hue-rotate(-28deg) saturate(1.18)',
    accent: 'oklch(0.7 0.19 22)',
  },
  {
    id: 'noir',
    back: 'blue',
    filter: 'grayscale(1) contrast(1.12)',
    accent: 'oklch(0.86 0.02 250)',
  },
] as const;

export type CardThemeId = (typeof CARD_THEMES)[number]['id'];
export type CardTheme = (typeof CARD_THEMES)[number];

export const DEFAULT_CARD_THEME: CardThemeId = 'classic';

export const CARD_THEME_STORAGE_KEY = 'durak-master.card-theme';

export const getCardTheme = (id: CardThemeId): CardTheme =>
  CARD_THEMES.find((theme) => theme.id === id) ?? CARD_THEMES[0];

const ASSET_SET = 'atlas';

export function cardAssetUrl(card: Card): string {
  return `/cards/${ASSET_SET}/${RANK_FILE[card.rank]}_${card.suit}.svg`;
}

export function cardBackUrl(back: CardBack = 'blue'): string {
  return `/cards/${ASSET_SET}/back_${back}.svg`;
}

const SUIT_SYMBOL: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

/** Символ масти для компактных подписей — козырь в шапке стола. */
export function suitSymbol(suit: Suit): string {
  return SUIT_SYMBOL[suit];
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

/** Стабильный ключ карты — для React-ключей и сравнений. */
export function cardKey(card: Card): string {
  return `${card.rank}:${card.suit}`;
}
