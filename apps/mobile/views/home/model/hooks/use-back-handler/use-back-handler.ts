import { useEffect } from 'react';
import { BackHandler } from 'react-native';

import type { UseBackHandlerInput } from './use-back-handler.types';

export const useBackHandler = ({ isEnabled, onBack }: UseBackHandlerInput) => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();

      return true;
    });

    return () => subscription.remove();
  }, [isEnabled, onBack]);
};
