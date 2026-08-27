import { useBoolean } from '@siberiacancode/reactuse';
import { useEffect } from 'react';

import { HINT_LIFETIME_MS } from '../../../config';

export const useBoostHint = () => {
  const [isHintVisible, toggleHint] = useBoolean(false);

  useEffect(() => {
    if (!isHintVisible) {
      return;
    }

    const timer = setTimeout(toggleHint, HINT_LIFETIME_MS, false);

    return () => clearTimeout(timer);
  }, [isHintVisible, toggleHint]);

  return { isHintVisible, showHint: () => toggleHint(true) };
};
