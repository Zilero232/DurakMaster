import type { BetFilter, GameFilter } from '../../../model';

export type LobbyFiltersProps = {
  game: GameFilter;
  bet: BetFilter;
  hideFull: boolean;

  count: number;
  onChangeGame: (game: GameFilter) => void;
  onChangeBet: (bet: BetFilter) => void;
  onToggleHideFull: () => void;
};
