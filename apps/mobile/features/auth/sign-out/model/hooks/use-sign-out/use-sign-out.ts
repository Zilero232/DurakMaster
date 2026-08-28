import { useState } from 'react';

import { useSessionStore } from '@/entities/session';
import { useSocialStore } from '@/entities/social';
import { logout } from '@/shared/api';

export const useSignOut = () => {
  const [isConfirming, setIsConfirming] = useState(false);

  const disconnect = useSessionStore((store) => store.disconnect);
  const resetSocial = useSocialStore((store) => store.reset);

  const confirm = () => {
    setIsConfirming(false);
    disconnect();
    resetSocial();
    void logout();
  };

  return {
    isConfirming,
    request: () => setIsConfirming(true),
    cancel: () => setIsConfirming(false),
    confirm
  };
};
