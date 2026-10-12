import { match, P } from 'ts-pattern';

import { useMyProfile, useSessionStore } from '@/entities/session';
import { MatchResult } from '@/widgets/game/match-result';

import { AppShell } from '../AppShell';
import { TableRouter } from '../TableRouter';

export const HomeScreen = () => {
  const currentTable = useSessionStore((store) => store.currentTable);
  const { profile } = useMyProfile();
  const outcome = useSessionStore((store) => store.outcome);
  const goToMenu = useSessionStore((store) => store.goToMenu);
  const dismissOutcome = useSessionStore((store) => store.dismissOutcome);

  return match({ outcome, currentTable })
    .with({ outcome: P.nonNullable }, ({ outcome: result }) => (
      <MatchResult
        canRematch={currentTable !== null}
        creditsDelta={result.creditsDelta}
        isDraw={result.isDraw}
        isLoser={result.loserUserId === profile?.userId}
        ratingDelta={result.ratingDelta}
        onRematch={dismissOutcome}
        onToMenu={goToMenu}
      />
    ))
    .with({ currentTable: P.nonNullable }, () => <TableRouter />)
    .otherwise(() => <AppShell />);
};
