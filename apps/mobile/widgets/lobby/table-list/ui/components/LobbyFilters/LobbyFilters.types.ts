import type { BetFilter } from '../../../model';

export type LobbyFiltersProps = {
  bet: BetFilter;
  hideFull: boolean;

  count: number;
  onChangeBet: (bet: BetFilter) => void;
  onToggleHideFull: () => void;
};
