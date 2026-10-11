import { useState } from 'react';

import { useSessionStore } from '@/entities/session';

import type { UseTableSheetsInput } from './use-table-sheets.types';

export const useTableSheets = ({ isWaiting }: UseTableSheetsInput) => {
  const currentTable = useSessionStore((store) => store.currentTable);
  const tablePlayers = useSessionStore((store) => store.tablePlayers);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [wasWaiting, setWasWaiting] = useState(isWaiting);

  if (wasWaiting !== isWaiting) {
    setWasWaiting(isWaiting);
    setIsInviteOpen(false);
  }

  const selectedPlayer = tablePlayers.find((player) => player.userId === selectedUserId) ?? null;

  const selectSeat = (userId: string) => {
    const isSeatTaken = currentTable?.players.some((player) => player.userId === userId) ?? false;

    if (isWaiting && !isSeatTaken) {
      setIsInviteOpen(true);

      return;
    }

    setSelectedUserId(userId);
  };

  return {
    selectedPlayer,
    isPlayerCardOpen: selectedUserId !== null,
    isInviteOpen,
    selectSeat,
    closePlayerCard: () => setSelectedUserId(null),
    openInvite: () => setIsInviteOpen(true),
    closeInvite: () => setIsInviteOpen(false)
  };
};
