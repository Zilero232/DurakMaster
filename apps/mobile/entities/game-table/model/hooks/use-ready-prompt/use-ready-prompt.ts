import { useEffect, useRef } from 'react';

import { playSound } from '@/shared/lib/sound';

import type { UseReadyPromptInput } from './use-ready-prompt.types';

export const useReadyPrompt = ({ isWaiting, isReady, hasFreeSeat }: UseReadyPromptInput): void => {
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
