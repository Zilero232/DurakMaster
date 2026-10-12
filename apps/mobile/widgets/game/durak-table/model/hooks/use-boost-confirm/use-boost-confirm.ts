import type { BoostId } from '@durak-master/schemas';

import { useState } from 'react';

import type { UseBoostConfirmInput } from './use-boost-confirm.types';

import { pickBoostBlocker } from '../../../lib';

export const useBoostConfirm = ({ coins, canUndo, onUseBoost }: UseBoostConfirmInput) => {
  const [boost, setBoost] = useState<BoostId | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const blocker = boost ? pickBoostBlocker({ boost, coins, canUndo }) : null;

  const select = (next: BoostId) => {
    setBoost(next);
    setIsOpen(true);
  };

  const cancel = () => setIsOpen(false);

  const confirm = () => {
    if (boost && !blocker) {
      onUseBoost(boost);
    }

    setIsOpen(false);
  };

  return { boost, isOpen, blocker, select, cancel, confirm };
};
