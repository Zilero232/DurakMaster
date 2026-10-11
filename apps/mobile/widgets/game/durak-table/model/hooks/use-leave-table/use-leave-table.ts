import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import type { UseLeaveTableInput } from './use-leave-table.types';

export const useLeaveTable = ({ isPlaying, onLeave }: UseLeaveTableInput) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const requestLeave = useCallback(() => {
    if (isPlaying) {
      setIsConfirming(true);

      return;
    }

    onLeave();
  }, [isPlaying, onLeave]);

  const cancelLeave = () => setIsConfirming(false);

  const confirmLeave = () => {
    setIsConfirming(false);
    onLeave();
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isConfirming) {
        setIsConfirming(false);
      } else {
        requestLeave();
      }

      return true;
    });

    return () => subscription.remove();
  }, [isConfirming, requestLeave]);

  return { isConfirming, requestLeave, cancelLeave, confirmLeave };
};
