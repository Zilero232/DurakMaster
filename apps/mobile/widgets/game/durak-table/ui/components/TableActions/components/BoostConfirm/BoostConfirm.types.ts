import type { BoostId } from '@durak-master/schemas';

import type { BoostBlocker } from '../../../../../lib';

export type BoostConfirmProps = {
  boost: BoostId;
  blocker: BoostBlocker | null;
  coins: number;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};
