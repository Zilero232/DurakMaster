import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Button, LoserHat, StatusScreen } from '@/ui-kit';

import type { MatchResultProps } from './MatchResult.types';

import { useResultFanfare } from '../../model/hooks';

export const MatchResult = ({ isLoser, isDraw, creditsDelta, onDismiss }: MatchResultProps) => {
  const { t } = useTranslation();

  useResultFanfare({ isDraw, isLoser });

  const outcome = match({ isDraw, isLoser })
    .with({ isDraw: true }, () => ({ title: 'result.draw', hint: 'result.drawHint' }))
    .with({ isLoser: true }, () => ({ title: 'result.lose', hint: 'result.loseHint' }))
    .otherwise(() => ({ title: 'result.win', hint: 'result.winHint' }));

  const title = t(outcome.title);
  const description = t(outcome.hint);

  return (
    <StatusScreen
      actions={
        <Button size='lg' variant='primary' onPress={onDismiss}>
          {t('result.toMenu')}
        </Button>
      }
      description={description}
      highlight={creditsDelta === 0 ? undefined : t('result.credits', { value: creditsDelta })}
      highlightTone={creditsDelta > 0 ? 'gain' : 'loss'}
      icon={isLoser && !isDraw ? <LoserHat size={64} /> : undefined}
      title={title}
    />
  );
};
