import { useEffect, useRef } from 'react';

import { playSound } from '@/shared/lib/sound';

type ReadyPrompt = {
  isWaiting: boolean;
  isReady: boolean;
  hasFreeSeat: boolean;
};

export const useReadyPrompt = ({ isWaiting, isReady, hasFreeSeat }: ReadyPrompt): void => {
  const promptedRef = useRef(false);

  const isPrompting = isWaiting && !isReady && !hasFreeSeat;

  useEffect(() => {
    if (!isPrompting) {
      promptedRef.current = false;

      return;
    }

    if (promptedRef.current) {
      return;
    }

    promptedRef.current = true;
    playSound('ready');
  }, [isPrompting]);
};
