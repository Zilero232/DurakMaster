import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useDismissOnBack = (onDismiss: () => void) => {
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onDismiss();

      return true;
    });

    return () => subscription.remove();
  }, [onDismiss]);
};
