import { useEffect, useState } from 'react';

import type { UseSheetPresenceInput } from './use-sheet-presence.types';

export const useSheetPresence = ({ isOpen, exitDurationMs }: UseSheetPresenceInput): boolean => {
  const [isClosed, setIsClosed] = useState(true);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    const timer = setTimeout(setIsClosed, exitDurationMs, true);

    return () => clearTimeout(timer);
  }, [isOpen, exitDurationMs]);

  if (isOpen && isClosed) {
    setIsClosed(false);
  }

  return isOpen || !isClosed;
};
