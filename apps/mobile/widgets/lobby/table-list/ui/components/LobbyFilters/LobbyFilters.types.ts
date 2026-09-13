import type { BetFilter } from '../../../config';

export type LobbyFiltersProps = {
  bet: BetFilter;
  hideFull: boolean;

  count: number;
  onChangeBet: (bet: BetFilter) => void;
  onToggleHideFull: () => void;
};
