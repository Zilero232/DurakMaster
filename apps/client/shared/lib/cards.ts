/**
 * Реэкспорт для обратной совместимости.
 *
 * Реализация переехала в `card-themes.ts` вместе с поддержкой нескольких
 * оформлений колоды; импорты `@/shared/lib/cards` продолжают работать.
 */
export {
  CARD_BACKS,
  CARD_THEME_STORAGE_KEY,
  CARD_THEMES,
  type CardBack,
  type CardTheme,
  type CardThemeId,
  cardAssetUrl,
  cardBackUrl,
  cardKey,
  DEFAULT_CARD_THEME,
  getCardTheme,
  isRedSuit,
  suitSymbol,
} from './card-themes';
