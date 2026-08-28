import { useSessionStore } from '@/entities/session';
import { MatchResult } from '@/widgets/game/match-result';

import { AppShell } from '../AppShell';
import { TableRouter } from '../TableRouter';

export const HomeScreen = () => {
  const currentTable = useSessionStore((store) => store.currentTable);
  const profile = useSessionStore((store) => store.profile);
  const outcome = useSessionStore((store) => store.outcome);
  const clearOutcome = useSessionStore((store) => store.clearOutcome);

  if (currentTable) {
    return <TableRouter />;
  }

  if (outcome) {
    return (
      <MatchResult
        creditsDelta={outcome.creditsDelta}
        isDraw={outcome.isDraw}
        isLoser={outcome.loserUserId === profile?.userId}
        onDismiss={clearOutcome}
      />
    );
  }

  return <AppShell />;
};
