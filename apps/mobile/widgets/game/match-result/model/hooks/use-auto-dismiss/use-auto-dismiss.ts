import { useEffect } from 'react';

import type { UseAutoDismissInput } from './use-auto-dismiss.types';

export const useAutoDismiss = ({ afterMs, onDismiss }: UseAutoDismissInput) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, afterMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react/exhaustive-deps -- the banner closes once, on its first timer
  }, [afterMs]);
};
