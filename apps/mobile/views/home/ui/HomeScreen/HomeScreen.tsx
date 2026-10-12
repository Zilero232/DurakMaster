import { match, P } from 'ts-pattern';

import { useMyProfile, useSessionStore } from '@/entities/session';
import { MatchBanner, MatchResult } from '@/widgets/game/match-result';

import { AppShell } from '../AppShell';
import { TableRouter } from '../TableRouter';

export const HomeScreen = () => {
  const currentTable = useSessionStore((store) => store.currentTable);
  const { profile } = useMyProfile();
  const outcome = useSessionStore((store) => store.outcome);
  const goToMenu = useSessionStore((store) => store.goToMenu);
  const dismissOutcome = useSessionStore((store) => store.dismissOutcome);

  return match({ outcome, currentTable })
    .with({ currentTable: P.nonNullable }, ({ outcome: result }) => (
      <>
        <TableRouter />

        {result !== null && (
          <MatchBanner
            creditsDelta={result.creditsDelta}
            isDraw={result.isDraw}
            isLoser={result.loserUserId === profile?.userId}
            ratingDelta={result.ratingDelta}
            reason={result.reason}
            onDone={dismissOutcome}
          />
        )}
      </>
    ))
    .with({ outcome: P.nonNullable }, ({ outcome: result }) => (
      <MatchResult
        creditsDelta={result.creditsDelta}
        isDraw={result.isDraw}
        isLoser={result.loserUserId === profile?.userId}
        ratingDelta={result.ratingDelta}
        reason={result.reason}
        onToMenu={goToMenu}
      />
    ))
    .otherwise(() => <AppShell />);
};
