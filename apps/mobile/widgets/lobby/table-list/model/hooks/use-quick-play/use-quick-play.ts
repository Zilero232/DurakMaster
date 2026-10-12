import { useMyProfile, useSessionStore } from '@/entities/session';

import type { UseQuickPlayInput } from './use-quick-play.types';

import { pickQuickPlayTable } from '../../../lib';

export const useQuickPlay = ({ onCreate, onJoin }: UseQuickPlayInput) => {
  const tables = useSessionStore((store) => store.tables);
  const joiningTableId = useSessionStore((store) => store.joiningTableId);

  const { profile } = useMyProfile();

  const canQuickPlay = profile !== null && joiningTableId === null;

  const quickPlay = () => {
    if (!canQuickPlay) {
      return;
    }

    const table = pickQuickPlayTable({
      tables,
      credits: profile.credits,
      myUserId: profile.userId
    });

    if (table) {
      onJoin(table.id);

      return;
    }

    onCreate();
  };

  return { canQuickPlay, quickPlay };
};
