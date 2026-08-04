import type { GameState, PlayerView } from '@durak-master/schemas';

/**
 * Проекция состояния для конкретного игрока.
 *
 * ЕДИНСТВЕННЫЙ разрешённый способ отдать состояние клиенту. Прятать карты
 * на клиенте нельзя: скрытые поля видны в сетевом трафике и в DevTools.
 *
 * Убирает: руки других игроков и ПОРЯДОК КОЛОДЫ — это единственная
 * по-настоящему скрытая информация в дураке.
 *
 * Отбой отдаётся целиком: эти карты уже лежали на столе открытыми.
 * Скрывать их — не защита от подглядывания, а налог на память игрока.
 */
export function toPlayerView(state: GameState, userId: string): PlayerView {
  const { hands, talon, discard, ...rest } = state;

  return {
    ...rest,
    hand: hands[userId] ?? [],
    talonCount: talon.length,
    discardCount: discard.length,
    discardPile: discard,
  };
}

/**
 * Проекция для зрителя: рук не видно вообще.
 */
export function toSpectatorView(state: GameState): PlayerView {
  const { hands: _hands, talon, discard, ...rest } = state;

  return {
    ...rest,
    hand: [],
    talonCount: talon.length,
    discardCount: discard.length,
    discardPile: discard,
  };
}
