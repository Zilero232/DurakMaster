import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import type { TableMenuState, UseTableMenuInput } from './use-table-menu.types';

export const useTableMenu = ({ isPlaying, onLeave }: UseTableMenuInput): TableMenuState => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingSurrender, setIsConfirmingSurrender] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(isPlaying);

  if (wasPlaying !== isPlaying) {
    setWasPlaying(isPlaying);
    setIsConfirmingSurrender(false);
  }

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setIsOpen(true);

      return true;
    });

    return () => subscription.remove();
  }, []);

  const open = () => setIsOpen(true);

  const close = () => {
    if (isConfirmingSurrender) {
      setIsConfirmingSurrender(false);

      return;
    }

    setIsOpen(false);
  };

  const requestLeave = () => {
    if (isPlaying) {
      setIsConfirmingSurrender(true);

      return;
    }

    setIsOpen(false);
    onLeave();
  };

  const confirmSurrender = () => {
    setIsConfirmingSurrender(false);
    setIsOpen(false);
    onLeave();
  };

  const cancelSurrender = () => setIsConfirmingSurrender(false);

  return {
    isOpen,
    isConfirmingSurrender,
    open,
    close,
    requestLeave,
    confirmSurrender,
    cancelSurrender
  };
};
