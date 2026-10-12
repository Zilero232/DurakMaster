import type { TableRule } from '../../../lib';
import type { TableMenuState } from '../../../model';

export type TableMenuProps = {
  rules: TableRule[];
  bet: number;
  isPlaying: boolean;
  menu: TableMenuState;
};
