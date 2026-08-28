import { useRef } from 'react';

import { EMOJI_COOLDOWN_MS } from '../../../config';

export const useSendGuard = (onSent: () => void) => {
  const cooldownUntilRef = useRef(0);

  return (send: () => void) => {
    if (Date.now() < cooldownUntilRef.current) {
      return;
    }

    send();

    cooldownUntilRef.current = Date.now() + EMOJI_COOLDOWN_MS;

    onSent();
  };
};
