import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useSessionStore } from '@/entities/session';
import { useSocialStore } from '@/entities/social';
import { signOut } from '@/shared/api';

export const useSignOut = () => {
  const isSigningOut = useSessionStore((store) => store.isSigningOut);
  const disconnect = useSessionStore((store) => store.disconnect);
  const setSigningOut = useSessionStore((store) => store.setSigningOut);
  const resetSocial = useSocialStore((store) => store.reset);

  const queryClient = useQueryClient();

  const [isConfirming, setIsConfirming] = useState(false);

  const confirm = async () => {
    setIsConfirming(false);
    setSigningOut(true);

    const { error } = await signOut();

    if (error) {
      setSigningOut(false);

      return;
    }

    disconnect();
    resetSocial();
    queryClient.clear();
  };

  return {
    isConfirming,
    isSigningOut,
    request: () => setIsConfirming(true),
    cancel: () => setIsConfirming(false),
    confirm
  };
};
